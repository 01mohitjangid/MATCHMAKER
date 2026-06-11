import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/ui/Avatar";
import { Badge, toneForStage } from "@/components/ui/Badge";
import { ShieldCheck, Sparkles } from "@/components/ui/Icons";
import { getCustomerById } from "@/data/repository";
import {
  ageFromDob,
  formatHeight,
  formatIncome,
  fullName,
} from "@/lib/utils";

/**
 * Client detail view (Step 2: header + quick info + routing).
 * The full biodata layout and AI-ranked matches land in Step 3.
 */
export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerById(id);
  if (!customer) notFound();

  const quickInfo: { label: string; value: string }[] = [
    { label: "Gender", value: customer.gender },
    { label: "City", value: `${customer.city}, ${customer.country}` },
    { label: "Marital status", value: customer.maritalStatus },
    { label: "Height", value: formatHeight(customer.heightCm) },
    { label: "Income", value: formatIncome(customer.incomeLPA) },
    {
      label: "Works as",
      value: `${customer.designation} · ${customer.currentCompany}`,
    },
    { label: "Religion", value: `${customer.religion} · ${customer.caste}` },
    { label: "Email", value: customer.email },
    { label: "Phone", value: customer.phone },
  ];

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
            {ageFromDob(customer.dateOfBirth)} yrs · {customer.city}
          </p>
        </div>
        <Badge tone={toneForStage(customer.status)}>{customer.status}</Badge>
      </header>

      {/* Quick info */}
      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-faint">
          Quick info
        </h2>
        <dl className="grid gap-x-6 gap-y-4 rounded-card border border-line bg-surface p-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickInfo.map((item) => (
            <div key={item.label}>
              <dt className="text-xs uppercase tracking-wide text-ink-faint">
                {item.label}
              </dt>
              <dd className="mt-0.5 font-medium wrap-break-word">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Step 3 placeholder */}
      <section className="mt-6 flex items-start gap-4 rounded-card border border-dashed border-line-strong bg-tint-lilac/40 p-6">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/70 text-[#7c3aed]">
          <Sparkles className="h-6 w-6" />
        </span>
        <div>
          <h2 className="font-semibold">Full biodata &amp; AI-ranked matches</h2>
          <p className="mt-1 text-sm text-ink-soft">
            The complete profile and the gender-specific matching engine with
            scored, explainable suggestions arrive in Step 3.
          </p>
        </div>
      </section>
    </div>
  );
}
