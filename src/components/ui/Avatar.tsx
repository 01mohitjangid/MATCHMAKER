import { avatarColor, initials } from "@/lib/utils";
import type { Biodata } from "@/types";

interface AvatarProps {
  person: Pick<Biodata, "firstName" | "lastName" | "avatarSeed">;
  size?: number;
}

/**
 * Initials avatar with a deterministic, seed-derived background colour.
 * We render initials rather than photos to keep the demo privacy-friendly
 * and avoid shipping image assets.
 */
export function Avatar({ person, size = 44 }: AvatarProps) {
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: avatarColor(person.avatarSeed),
        fontSize: size * 0.38,
      }}
    >
      {initials(person)}
    </span>
  );
}
