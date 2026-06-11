import { cn } from "@/lib/utils";
import type { JourneyStage } from "@/types";

type Tone = "brand" | "positive" | "warning" | "danger" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  brand: "bg-brand-soft text-brand-strong",
  positive: "bg-positive-soft text-positive",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  neutral: "bg-surface-muted text-ink-soft",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}

/** Small pill label used for status tags, tiers, and attributes. */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-medium",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Maps a journey stage to a sensible badge tone. Reused on the dashboard. */
export function toneForStage(stage: JourneyStage): Tone {
  switch (stage) {
    case "Matched":
      return "positive";
    case "Active Matching":
    case "Dates in Progress":
      return "brand";
    case "On Hold":
      return "warning";
    case "New Lead":
    case "Profile Review":
      return "neutral";
    case "Verified":
      return "positive";
    default:
      return "neutral";
  }
}
