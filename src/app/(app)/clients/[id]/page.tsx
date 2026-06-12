import Link from "next/link";
import { notFound } from "next/navigation";

import { MatchList } from "@/components/app/MatchList";
import {
  BiodataSections,
  PreferencesSection,
} from "@/components/app/ProfileSections";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, toneForStage } from "@/components/ui/Badge";
import { ShieldCheck } from "@/components/ui/Icons";
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

  // Opposite-gender pool → ranked, scored matches.
  const pool = await getCandidatePoolFor(customer.gender);
  const matches = rankMatches(customer, pool);

  return (
    <div>
      <Link
        href="/dashboard"
        className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
      >
        ← Back to dashboard
      </Link>

      {/* Header */}
      <header className="mt-4 flex flex-col gap-4 rounded-card border border-line bg-surface p-6 sm:flex-row sm:items-center">
        <Avatar person={customer} size={64} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              {fullName(customer)}
            </h1>
            {customer.verified && (
              <ShieldCheck
                role="img"
                aria-label="Verified profile"
                className="h-5 w-5 shrink-0 text-positive"
              />
            )}
          </div>
          <p className="mt-0.5 text-ink-soft">
            {ageFromDob(customer.dateOfBirth)} yrs · {customer.gender} ·{" "}
            {customer.city}
          </p>
        </div>
        <Badge tone={toneForStage(customer.status)}>{customer.status}</Badge>
      </header>

      {/* Biodata */}
      <div className="mt-8">
        <BiodataSections person={customer} />
      </div>

      {/* Partner preferences */}
      <div className="mt-8">
        <PreferencesSection preferences={customer.preferences} />
      </div>

      {/* Matches */}
      <section className="mt-10">
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
        <MatchList matches={matches} />
      </section>
    </div>
  );
}
