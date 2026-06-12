import Link from "next/link";

import { ArrowRight, GitHub, LinkedIn, MapPin } from "@/components/ui/Icons";

/**
 * Global signature footer, shown on every page (mounted in the root layout).
 * Light, on the project canvas — brand statement + CTA on the left, builder
 * credit + contact on the right. Edit the values below.
 */


export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        {/* Brand statement + meta */}
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-base font-bold text-white">
                ♥
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                TDC Matchmaker
              </span>
            </div>

            <h2 className="mt-7 max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
              Make every introduction count.
            </h2>

            <Link
              href="/login"
              className="mt-7 inline-flex items-center gap-2 rounded-pill bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-strong"
            >
              Open the workspace
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-6">
            

            
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-6 text-[11px] uppercase tracking-[0.15em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026  TDC Matchmaker</span>
          <span>Built with care</span>
        </div>
      </div>
    </footer>
  );
}

function Col({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[11px] uppercase tracking-[0.15em] text-ink-faint">
        {label}
      </p>
      <div className="text-sm text-ink-soft">{children}</div>
    </div>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid h-9 w-9 place-items-center rounded-full border border-line-strong text-ink-soft transition-colors hover:border-ink hover:text-ink"
    >
      {children}
    </a>
  );
}
