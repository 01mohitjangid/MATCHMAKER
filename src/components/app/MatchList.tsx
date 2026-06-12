import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { HeartSend } from "@/components/ui/Icons";
import { ageFromDob, cn, formatHeight, formatIncome, fullName } from "@/lib/utils";
import type { MatchResult, MatchTier } from "@/types";

type Tone = "brand" | "positive" | "neutral";

const TIER_STYLE: Record<MatchTier, { tone: Tone; number: string; ring: string }> = {
  "High Potential Match": {
    tone: "brand",
    number: "text-brand",
    ring: "border-brand/40 ring-1 ring-brand/20",
  },
  "Strong Match": { tone: "positive", number: "text-positive", ring: "border-line" },
  "Worth Exploring": { tone: "neutral", number: "text-ink", ring: "border-line" },
  "Long Shot": { tone: "neutral", number: "text-ink-faint", ring: "border-line" },
};

export function MatchList({ matches }: { matches: MatchResult[] }) {
  if (matches.length === 0) {
    return (
      <p className="rounded-card border border-line bg-surface px-5 py-12 text-center text-sm text-ink-faint">
        No eligible matches in the current pool for this client.
      </p>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {matches.map((m) => (
        <MatchCard key={m.candidate.id} match={m} />
      ))}
    </div>
  );
}

function MatchCard({ match }: { match: MatchResult }) {
  const { candidate: c, score, tier, reasons } = match;
  const style = TIER_STYLE[tier];
  const topReasons = reasons.filter((r) => r.positive).slice(0, 4);

  return (
    <article className={cn("rounded-card border bg-surface p-5", style.ring)}>
      <div className="flex items-start gap-3">
        <Avatar person={c} size={48} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{fullName(c)}</p>
          <p className="truncate text-sm text-ink-soft">
            {ageFromDob(c.dateOfBirth)} yrs · {c.city}
          </p>
        </div>
        <div className="text-right">
          <p className={cn("text-3xl font-bold leading-none", style.number)}>
            {score}
          </p>
          <p className="text-[11px] uppercase tracking-wide text-ink-faint">
            / 100
          </p>
        </div>
      </div>

      <div className="mt-3">
        <Badge tone={style.tone}>{tier}</Badge>
      </div>

      <p className="mt-3 text-sm text-ink-soft">
        {c.designation} · {formatIncome(c.incomeLPA)} · {formatHeight(c.heightCm)}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {topReasons.map((r, i) => (
          <span
            key={i}
            className="rounded-pill bg-surface-muted px-2.5 py-1 text-xs text-ink-soft"
          >
            {r.label}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
        <span className="text-xs text-ink-faint">
          {c.activeOnApp ? "Active recently" : "On the roster"}
        </span>
        {/* Wired up in Step 4 (AI intro + mock email). */}
        <button
          type="button"
          disabled
          title="Send match arrives in Step 4"
          className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-pill bg-brand px-4 py-2 text-sm font-medium text-white opacity-50"
        >
          <HeartSend className="h-4 w-4" />
          Send match
        </button>
      </div>
    </article>
  );
}
