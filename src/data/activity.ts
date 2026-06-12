/**
 * Mutable activity: meeting notes and sent matches.
 *
 * Persisted to Firestore when configured; otherwise kept in a module-level
 * in-memory store so the features still work during a local session (they
 * just won't survive a server restart without Firebase).
 *
 * These are intentionally NOT React-cached — they change during a session.
 */

import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

import { COLLECTIONS, getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { MatchmakerNote } from "@/types";

// In-memory fallbacks (used when Firebase isn't configured).
const memNotes = new Map<string, MatchmakerNote[]>();
const memSent = new Map<string, Set<string>>();

// ---- Notes ---------------------------------------------------------------

/** Notes for a client, newest first. */
export async function getNotes(clientId: string): Promise<MatchmakerNote[]> {
  if (!isFirebaseConfigured) {
    return [...(memNotes.get(clientId) ?? [])];
  }
  const snap = await getDocs(
    query(collection(getDb(), COLLECTIONS.notes), where("clientId", "==", clientId)),
  );
  return snap.docs
    .map((d) => d.data() as MatchmakerNote)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Record a new note and return it. */
export async function addNote(
  clientId: string,
  body: string,
  author: string,
): Promise<MatchmakerNote> {
  const note: MatchmakerNote = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    author,
    body,
  };

  if (!isFirebaseConfigured) {
    memNotes.set(clientId, [note, ...(memNotes.get(clientId) ?? [])]);
    return note;
  }
  await setDoc(doc(getDb(), COLLECTIONS.notes, `${clientId}_${note.id}`), {
    ...note,
    clientId,
  });
  return note;
}

// ---- Sent matches --------------------------------------------------------

/** Candidate ids already sent for this client. */
export async function getSentMatchIds(clientId: string): Promise<string[]> {
  if (!isFirebaseConfigured) {
    return [...(memSent.get(clientId) ?? [])];
  }
  const snap = await getDocs(
    query(
      collection(getDb(), COLLECTIONS.sentMatches),
      where("clientId", "==", clientId),
    ),
  );
  return snap.docs.map((d) => (d.data() as { candidateId: string }).candidateId);
}

/** Mark a candidate as sent for this client (idempotent on the pair). */
export async function recordSentMatch(
  clientId: string,
  candidateId: string,
  intro: string,
): Promise<void> {
  if (!isFirebaseConfigured) {
    const set = memSent.get(clientId) ?? new Set<string>();
    set.add(candidateId);
    memSent.set(clientId, set);
    return;
  }
  await setDoc(doc(getDb(), COLLECTIONS.sentMatches, `${clientId}_${candidateId}`), {
    clientId,
    candidateId,
    intro,
    createdAt: new Date().toISOString(),
  });
}
