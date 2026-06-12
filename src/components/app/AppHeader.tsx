import Link from "next/link";

import { logout } from "@/app/login/actions";
import { Avatar } from "@/components/ui/Avatar";
import { LogOut } from "@/components/ui/Icons";
import type { SafeMatchmaker } from "@/types";

/**
 * Top navigation for authenticated pages. Server component — the logout button
 * is a plain `<form action={serverAction}>`, so no client JS is needed.
 */
export function AppHeader({ matchmaker }: { matchmaker: SafeMatchmaker }) {
  const [firstName = "", ...rest] = matchmaker.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-base font-bold text-white">
            ♥
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            TDC Matchmaker
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Avatar
            person={{ firstName, lastName, avatarSeed: matchmaker.avatarSeed }}
            size={36}
          />
          <form action={logout}>
            <button
              type="submit"
              title="Log out"
              className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:bg-surface-muted hover:text-ink"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
