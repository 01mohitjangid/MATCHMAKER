"use client";

import { useActionState, useEffect, useRef } from "react";

import { addNoteAction, type NoteState } from "@/app/(app)/clients/[id]/actions";
import { NoteIcon } from "@/components/ui/Icons";
import { formatDate } from "@/lib/utils";
import type { MatchmakerNote } from "@/types";

const initialState: NoteState = {};

/**
 * Meeting/call notes for a client — add and list. Notes are server-persisted;
 * after a successful add, the route revalidates and `notes` arrives fresh.
 */
export function NotesPanel({
  clientId,
  notes,
}: {
  clientId: string;
  notes: MatchmakerNote[];
}) {
  const [state, formAction, pending] = useActionState(addNoteAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the textarea via the DOM once a note saves (no setState in effect).
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="rounded-card border border-line bg-surface p-6">
      <form ref={formRef} action={formAction}>
        <input type="hidden" name="clientId" value={clientId} />
        <label htmlFor="note" className="text-sm font-medium">
          Add a note
        </label>
        <textarea
          id="note"
          name="body"
          required
          rows={3}
          placeholder="Quick note from a call or meeting…"
          className="mt-1.5 w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-3 text-sm outline-none focus:border-brand"
        />
        {state.error && <p className="mt-2 text-sm text-danger">{state.error}</p>}
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="rounded-pill bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save note"}
          </button>
        </div>
      </form>

      <div className="mt-5 border-t border-line pt-5">
        {notes.length === 0 ? (
          <div className="flex items-center gap-2 text-sm text-ink-faint">
            <NoteIcon className="h-4 w-4" />
            No notes yet. Add the first one above.
          </div>
        ) : (
          <ul className="space-y-3">
            {notes.map((n) => (
              <li
                key={n.id}
                className="rounded-xl bg-surface-muted px-4 py-3 text-sm"
              >
                <p className="leading-relaxed">{n.body}</p>
                <p className="mt-1.5 text-xs text-ink-faint">
                  {n.author} · {formatDate(n.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
