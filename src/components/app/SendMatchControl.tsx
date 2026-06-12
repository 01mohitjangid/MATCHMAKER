"use client";

import { useState } from "react";

import {
  generateMatchIntro,
  sendMatch,
} from "@/app/(app)/clients/[id]/actions";
import { Avatar } from "@/components/ui/Avatar";
import { HeartSend, Sparkles, X } from "@/components/ui/Icons";
import type { MatchReason } from "@/types";

interface CandidateLite {
  id: string;
  firstName: string;
  lastName: string;
  avatarSeed: string;
}

interface Props {
  clientId: string;
  candidate: CandidateLite;
  reasons: MatchReason[];
  alreadySent: boolean;
}

type Status = "idle" | "loading" | "ready" | "sending" | "sent" | "error";

export function SendMatchControl({
  clientId,
  candidate,
  reasons,
  alreadySent,
}: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [intro, setIntro] = useState("");
  const [source, setSource] = useState<"ai" | "fallback">("ai");
  const [recipient, setRecipient] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [sent, setSent] = useState(alreadySent);

  async function handleOpen() {
    setOpen(true);
    setStatus("loading");
    const res = await generateMatchIntro(clientId, candidate.id, reasons);
    if ("error" in res) {
      setStatus("error");
      return;
    }
    setIntro(res.intro);
    setSource(res.source);
    setRecipient({ name: res.candidate.name, email: res.candidate.email });
    setStatus("ready");
  }

  async function handleSend() {
    setStatus("sending");
    const res = await sendMatch(clientId, candidate.id, intro);
    if ("error" in res) {
      setStatus("error");
      return;
    }
    setSent(true);
    setStatus("sent");
  }

  function close() {
    setOpen(false);
    if (status !== "sent") setStatus("idle");
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={
          sent
            ? "inline-flex items-center gap-1.5 rounded-pill bg-positive-soft px-4 py-2 text-sm font-medium text-positive"
            : "inline-flex items-center gap-1.5 rounded-pill bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
        }
      >
        <HeartSend className="h-4 w-4" />
        {sent ? "Sent ✓" : "Send match"}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
          onClick={close}
        >
          <div
            className="w-full max-w-lg rounded-card border border-line bg-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar person={candidate} size={44} />
                <div>
                  <p className="font-semibold">
                    {candidate.firstName} {candidate.lastName}
                  </p>
                  <p className="text-sm text-ink-soft">Suggested match</p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                className="grid h-8 w-8 place-items-center rounded-full text-ink-faint hover:bg-surface-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {status === "loading" && (
              <div className="mt-6 flex items-center gap-3 text-sm text-ink-soft">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand" />
                Writing a personalised intro…
              </div>
            )}

            {status === "error" && (
              <p className="mt-6 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger">
                Something went wrong. Please try again.
              </p>
            )}

            {(status === "ready" || status === "sending") && (
              <>
                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      Email intro
                    </label>
                    <span className="inline-flex items-center gap-1 text-xs text-ink-faint">
                      <Sparkles className="h-3.5 w-3.5 text-[#7c3aed]" />
                      {source === "ai" ? "AI-generated" : "Template"}
                    </span>
                  </div>
                  <textarea
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    rows={5}
                    className="w-full resize-none rounded-xl border border-line-strong bg-surface px-3.5 py-3 text-sm leading-relaxed outline-none focus:border-brand"
                  />
                  {recipient && (
                    <p className="mt-2 text-xs text-ink-faint">
                      Mock email to {recipient.name} ·{" "}
                      <span className="font-medium text-ink-soft">
                        {recipient.email}
                      </span>
                    </p>
                  )}
                </div>

                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-pill border border-line-strong px-4 py-2 text-sm font-medium hover:bg-surface-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={status === "sending" || !intro.trim()}
                    className="inline-flex items-center gap-1.5 rounded-pill bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-strong disabled:opacity-60"
                  >
                    <HeartSend className="h-4 w-4" />
                    {status === "sending" ? "Sending…" : "Send email"}
                  </button>
                </div>
              </>
            )}

            {status === "sent" && (
              <div className="mt-6 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-positive-soft text-positive">
                  ✓
                </div>
                <p className="mt-3 font-semibold">Match sent!</p>
                <p className="mt-1 text-sm text-ink-soft">
                  A mock introduction email was drafted to{" "}
                  {recipient?.name ?? candidate.firstName}.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 rounded-pill bg-ink px-5 py-2 text-sm font-medium text-white"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
