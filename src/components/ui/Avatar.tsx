import Image from "next/image";

import { avatarColor } from "@/lib/utils";
import type { Biodata } from "@/types";

interface AvatarProps {
  person: Pick<Biodata, "firstName" | "lastName" | "avatarSeed"> &
    Partial<Pick<Biodata, "gender">>;
  size?: number;
}

/**
 * Illustrated avatar via DiceBear (deterministic by seed). We mix `gender`
 * into the seed so men/women profiles look visibly distinct, and keep the
 * legacy seeded HSL colour as a soft frame behind the SVG.
 */
export function Avatar({ person, size = 44 }: AvatarProps) {
  const seed = `${person.gender ?? "x"}-${person.avatarSeed}`;
  const url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(
    seed,
  )}&radius=50&backgroundType=solid&backgroundColor=transparent`;

  return (
    <span
      aria-hidden
      className="relative inline-flex shrink-0 overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: avatarColor(person.avatarSeed),
      }}
    >
      <Image
        src={url}
        alt=""
        width={size}
        height={size}
        unoptimized
        className="h-full w-full"
      />
    </span>
  );
}
