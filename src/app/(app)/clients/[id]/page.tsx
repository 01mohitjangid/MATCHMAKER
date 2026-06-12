import Link from "next/link";
import { notFound } from "next/navigation";

import { MatchList } from "@/components/app/MatchList";
import { NotesPanel } from "@/components/app/NotesPanel";
import {
  BiodataSections,
  PreferencesSection,
} from "@/components/app/ProfileSections";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, toneForStage } from "@/components/ui/Badge";
import {
  HeartSend,
  Mail,
  Search,
  ShieldCheck,
  Sparkles,
} from "@/components/ui/Icons";
import { getNotes, getSentMatchIds } from "@/data/activity";
import { getCandidatePoolFor, getCustomerById } from "@/data/repository";
import { rankMatches } from "@/lib/matching";
import { ageFromDob, fullName } from "@/lib/utils";

/**
 * Client detail view — full verified biodata, partner preferences, and the
 * gender-specific ranked matches with explainable scores.
 */
export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  // Opposite-gender pool → ranked, scored matches. Notes + sent state alongside.
  const pool = await getCandidatePoolFor(customer.gender);
  const matches = rankMatches(customer, pool);
  const [sentIds, notes] = await Promise.all([
    getSentMatchIds(customer.id),
    getNotes(customer.id),
  ]);

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        ← Back to dashboard
      </Link>

      {/* Header — peach banner */}
      <header className="relative mt-4 overflow-hidden rounded-card">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, #ffeede 0%, #ffe2d2 55%, #fde7ee 100%)",
          }}
        />
        <FloralCornerLeft className="pointer-events-none absolute -left-2 -bottom-2 hidden h-32 w-32 opacity-90 sm:block" />
        <FloralCornerRight className="pointer-events-none absolute -right-2 -top-2 hidden h-32 w-32 opacity-90 sm:block" />

        <div className="relative flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:p-9">
          <div className="rounded-full bg-white/70 p-1 shadow-sm ring-1 ring-black/5">
            <Avatar person={customer} size={72} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="display text-3xl font-bold tracking-tight sm:text-4xl">
                {fullName(customer)}
              </h1>
              {customer.verified && (
                <span className="inline-flex items-center gap-1 rounded-pill bg-white/80 px-2.5 py-1 text-xs font-medium text-positive ring-1 ring-positive/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="mt-1.5 text-ink-soft">
              {ageFromDob(customer.dateOfBirth)} yrs · {customer.gender} ·{" "}
              {customer.city}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/70 px-3 py-1 font-medium text-ink-soft ring-1 ring-black/5">
                <Sparkles className="h-3.5 w-3.5 text-brand" />
                {matches.length} ranked matches
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/70 px-3 py-1 font-medium text-ink-soft ring-1 ring-black/5">
                <Mail className="h-3.5 w-3.5 text-accent" />
                {sentIds.length} sent
              </span>
            </div>
          </div>
          <Badge tone={toneForStage(customer.status)}>{customer.status}</Badge>
        </div>
      </header>

      {/* Biodata */}
      <div className="mt-8">
        <BiodataSections person={customer} />
      </div>

      {/* Partner preferences */}
      <div className="mt-8">
        <PreferencesSection preferences={customer.preferences} />
      </div>

      {/* Notes */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-faint">
          Notes
        </h2>
        <NotesPanel clientId={customer.id} notes={notes} />
      </section>

      {/* How matching works */}
      <section className="mt-12">
        <div className="text-center">
          <h2 className="display text-3xl font-bold tracking-tight sm:text-4xl">
            How matching works
          </h2>
          <p className="mt-2 text-ink-soft">
            A four-step path to {customer.firstName}&apos;s introduction.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          {/* Left column */}
          <div className="space-y-9">
            <Step
              n={1}
              tone="pink"
              title="Read biodata"
              body={`Get to know ${customer.firstName}'s background, education, family, and values.`}
              align="right"
            />
            <Step
              n={2}
              tone="purple"
              title="Check preferences"
              body="See exactly what they're looking for — age, lifestyle, and intent."
              align="right"
            />
          </div>

          {/* Center — the customer + heart visual */}
          <div className="relative mx-auto hidden lg:block">
            <div className="relative grid h-[320px] w-[260px] place-items-center">
              <div
                aria-hidden
                className="absolute inset-x-4 inset-y-6 rounded-[40%] bg-tint-mint"
              />
              <div className="relative flex flex-col items-center gap-4">
                <div className="rounded-full bg-white p-1.5 shadow-md ring-1 ring-black/5">
                  <Avatar person={customer} size={92} />
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-full bg-brand text-white shadow-lg shadow-brand/30">
                  <HeartSend className="h-5 w-5" />
                </div>
                <div className="grid h-[92px] w-[92px] place-items-center rounded-full border-2 border-dashed border-line-strong bg-white/70 text-ink-faint">
                  <Search className="h-7 w-7" />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-9">
            <Step
              n={3}
              tone="pink"
              title="Review ranked matches"
              body={`Top candidates scored on values, lifestyle, and ${customer.gender.toLowerCase()}-specific compatibility.`}
            />
            <Step
              n={4}
              tone="purple"
              title="Send introduction"
              body="One click sends a curated profile and a personalised email — done."
            />
          </div>
        </div>
      </section>

      {/* Matches */}
      <section className="mt-16">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand">
              Suggested matches
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Top {matches.length} for {customer.firstName}
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-ink-faint sm:block">
            Ranked by a {customer.gender.toLowerCase()}-specific compatibility
            score.
          </p>
        </div>
        <MatchList matches={matches} clientId={customer.id} sentIds={sentIds} />
      </section>
    </div>
  );
}

/* ----------------------------- Pieces ------------------------------ */

function Step({
  n,
  tone,
  title,
  body,
  align = "left",
}: {
  n: number;
  tone: "pink" | "purple";
  title: string;
  body: string;
  align?: "left" | "right";
}) {
  const pill =
    tone === "pink"
      ? "bg-brand text-white"
      : "bg-[#7c3aed] text-white";
  return (
    <div className={align === "right" ? "lg:text-right" : ""}>
      <span
        className={`inline-flex h-6 min-w-6 items-center justify-center rounded-pill px-2 text-xs font-bold ${pill}`}
      >
        {n}
      </span>
      <h3 className="mt-3 text-xl font-bold tracking-tight">{title}</h3>
      <p
        className={`mt-2 text-sm leading-relaxed text-ink-soft ${
          align === "right" ? "lg:ml-auto" : ""
        } max-w-xs`}
      >
        {body}
      </p>
    </div>
  );
}

function FloralCornerLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <path
        d="M10 100 C 20 70, 50 60, 80 70"
        stroke="#7a4a3a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="35" cy="70" rx="14" ry="7" fill="#9bd3c8" transform="rotate(-25 35 70)" />
      <g transform="translate(22 96)">
        <circle r="9" fill="#f29ab0" />
        <circle r="9" cx="-12" cy="-1" fill="#f6b8c5" />
        <circle r="9" cx="9" cy="-7" fill="#e87890" />
        <circle r="4" fill="#fff5e8" />
      </g>
    </svg>
  );
}

function FloralCornerRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <path
        d="M110 20 C 95 45, 65 55, 40 50"
        stroke="#7a4a3a"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="80" cy="48" rx="14" ry="7" fill="#9bd3c8" transform="rotate(15 80 48)" />
      <g transform="translate(98 22)">
        <circle r="9" fill="#b89ad6" />
        <circle r="9" cx="12" cy="-1" fill="#cdb6e3" />
        <circle r="9" cx="-9" cy="-7" fill="#9c7cc4" />
        <circle r="4" fill="#fff5e8" />
      </g>
    </svg>
  );
}
