import { CustomerTable, type CustomerRow } from "@/components/app/CustomerTable";
import { getCustomers } from "@/data/repository";
import { getSession } from "@/lib/auth";
import { ageFromDob } from "@/lib/utils";

/**
 * Dashboard — the matchmaker's assigned client roster.
 * Age is computed server-side so the client table has no date dependency.
 */
export default async function DashboardPage() {
  const [matchmaker, customers] = await Promise.all([
    getSession(),
    getCustomers(),
  ]);

  const rows: CustomerRow[] = customers.map((c) => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    avatarSeed: c.avatarSeed,
    gender: c.gender,
    age: ageFromDob(c.dateOfBirth),
    city: c.city,
    country: c.country,
    maritalStatus: c.maritalStatus,
    status: c.status,
  }));

  const activeMatching = customers.filter(
    (c) => c.status === "Active Matching" || c.status === "Dates in Progress",
  ).length;
  const matched = customers.filter((c) => c.status === "Matched").length;
  const firstName = matchmaker?.name.split(" ")[0] ?? "there";

  return (
    <div>
      <header className="mb-7">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          Dashboard
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Welcome back, {firstName}.
        </h1>
        <p className="mt-1.5 text-ink-soft">
          Here are the clients assigned to you. Click any client to open their
          profile.
        </p>
      </header>

      <section className="mb-8 grid grid-cols-3 gap-4">
        <Stat value={customers.length} label="Total clients" />
        <Stat value={activeMatching} label="Active matching" />
        <Stat value={matched} label="Matched" />
      </section>

      <CustomerTable customers={rows} />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-tile border border-line bg-surface p-4 sm:p-5">
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-ink-soft sm:text-sm">{label}</p>
    </div>
  );
}
