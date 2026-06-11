/**
 * Minimal line icons (stroke-based, 24x24) used across the app.
 * Kept as inline SVG to avoid an icon-library dependency and to inherit
 * `currentColor`, so they tint cleanly inside pastel tiles.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ShieldCheck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 5 6v5c0 4.2 2.9 7.6 7 9 4.1-1.4 7-4.8 7-9V6l-7-3Z" />
      <path d="m9 11.5 2 2 4-4" />
    </svg>
  );
}

export function Route(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="18" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <path d="M8 18h6a3 3 0 0 0 3-3V8.5M6 15.8V9a3 3 0 0 1 3-3h4" />
    </svg>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4.5 13.4 9 18 10.5 13.4 12 12 16.5 10.6 12 6 10.5 10.6 9 12 4.5Z" />
      <path d="M18.5 16.5 19 18l1.5.5L19 19l-.5 1.5L18 19l-1.5-.5L18 18l.5-1.5Z" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 5 8-5" />
    </svg>
  );
}

export function NoteIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M8 10h8M8 14h5" />
    </svg>
  );
}

export function HeartSend(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-6.5-4.3-8.5-8.2C2.1 9 3.6 6 6.4 6c1.8 0 3 1.1 3.6 2.1C10.6 7.1 11.8 6 13.6 6c2.8 0 4.3 3 2.9 5.8" />
      <path d="m15 17 4 4m0-4-4 4" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function Search(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" />
    </svg>
  );
}

export function LogOut(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}
