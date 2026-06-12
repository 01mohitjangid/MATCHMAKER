import { SendMatchControl } from "@/components/app/SendMatchControl";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
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

export function MatchList({
  matches,
  clientId,
  sentIds,
}: {
  matches: MatchResult[];
  clientId: string;
  sentIds: string[];
}) {
  if (matches.length === 0) {
    return (
      <p className="rounded-card border border-line bg-surface px-5 py-12 text-center text-sm text-ink-faint">
        No eligible matches in the current pool for this client.
      </p>
    );
  }

  const sent = new Set(sentIds);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {matches.map((m) => (
        <MatchCard
          key={m.candidate.id}
          match={m}
          clientId={clientId}
          alreadySent={sent.has(m.candidate.id)}
        />
      ))}
    </div>
  );
}

function MatchCard({
  match,
  clientId,
  alreadySent,
}: {
  match: MatchResult;
  clientId: string;
  alreadySent: boolean;
}) {
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
        <SendMatchControl
          clientId={clientId}
          candidate={{
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            avatarSeed: c.avatarSeed,
          }}
          reasons={reasons}
          alreadySent={alreadySent}
        />
      </div>
    </article>
  );
}
