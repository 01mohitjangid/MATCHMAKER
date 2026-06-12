"use server";

import { revalidatePath } from "next/cache";

import { addNote, recordSentMatch } from "@/data/activity";
import { getCandidatePoolFor, getCustomerById } from "@/data/repository";
import { generateIntro } from "@/lib/ai";
import { getSession } from "@/lib/auth";
import { fullName } from "@/lib/utils";
import type { MatchReason } from "@/types";

/** Generate (but do not send) an AI intro for a client→candidate pair. */
export async function generateMatchIntro(
  clientId: string,
  candidateId: string,
  reasons: MatchReason[],
) {
  const client = await getCustomerById(clientId);
  if (!client) return { error: "Client not found" as const };

  const pool = await getCandidatePoolFor(client.gender);
  const candidate = pool.find((c) => c.id === candidateId);
  if (!candidate) return { error: "Candidate not found" as const };

  const { intro, source } = await generateIntro(client, candidate, reasons);
  return {
    intro,
    source,
    candidate: {
      name: fullName(candidate),
      email: candidate.email,
      designation: candidate.designation,
      city: candidate.city,
    },
  };
}

/** Record a sent match (the "mock email"). */
export async function sendMatch(
  clientId: string,
  candidateId: string,
  intro: string,
) {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" as const };

  await recordSentMatch(clientId, candidateId, intro);
  revalidatePath(`/clients/${clientId}`);
  return { ok: true as const };
}

export interface NoteState {
  ok?: boolean;
  error?: string;
}

/** Add a meeting/call note. Bound to the notes form via `useActionState`. */
export async function addNoteAction(
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const session = await getSession();
  if (!session) return { error: "Not authenticated" };

  const clientId = String(formData.get("clientId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!clientId) return { error: "Missing client" };
  if (!body) return { error: "Note can't be empty." };

  await addNote(clientId, body, session.name);
  revalidatePath(`/clients/${clientId}`);
  return { ok: true };
}
