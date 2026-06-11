import type { Biodata } from "@/types";

/**
 * Merge Tailwind class names, dropping falsy values. Lightweight stand-in for
 * `clsx` — enough for conditional classes without an extra dependency.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Age in whole years derived from an ISO date of birth, relative to `now`. */
export function ageFromDob(dob: string, now: Date = new Date()): number {
  const birth = new Date(dob);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/** Format centimetres as e.g. `5'9"` (feet/inches), the Indian convention. */
export function formatHeight(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
}

/** Format income LPA as e.g. `₹24 LPA`. */
export function formatIncome(lpa: number): string {
  return `₹${lpa} LPA`;
}

export function fullName(p: Pick<Biodata, "firstName" | "lastName">): string {
  return `${p.firstName} ${p.lastName}`;
}

export function initials(p: Pick<Biodata, "firstName" | "lastName">): string {
  return `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase();
}

/**
 * Deterministic HSL background for an avatar, derived from a seed string.
 * Keeps avatars stable and visually distinct without storing photos.
 */
export function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 52% 58%)`;
}

/** Format an ISO date string as e.g. `21 Aug 1994`. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
