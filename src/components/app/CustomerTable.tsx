"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge, toneForStage } from "@/components/ui/Badge";
import { ChevronRight, Search } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { Gender, JourneyStage, MaritalStatus } from "@/types";

/** Lean row DTO — age is computed on the server to avoid hydration drift. */
export interface CustomerRow {
  id: string;
  firstName: string;
  lastName: string;
  avatarSeed: string;
  gender: Gender;
  age: number;
  city: string;
  country: string;
  maritalStatus: MaritalStatus;
  status: JourneyStage;
}

const STATUS_FILTERS: (JourneyStage | "All")[] = [
  "All",
  "New Lead",
  "Profile Review",
  "Verified",
  "Active Matching",
  "Dates in Progress",
  "On Hold",
  "Matched",
];

export function CustomerTable({ customers }: { customers: CustomerRow[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JourneyStage | "All">("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesStatus = status === "All" || c.status === status;
      const matchesQuery =
        !q ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [customers, query, status]);

  return (
    <div>
      {/* Search + filter controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or city…"
            className="w-full rounded-pill border border-line-strong bg-surface py-2.5 pl-9 pr-3.5 text-sm outline-none transition-colors focus:border-brand"
          />
        </div>
        <p className="text-sm text-ink-faint">
          {filtered.length} of {customers.length} clients
        </p>
      </div>

      {/* Status filter chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-pill px-3 py-1.5 text-xs font-medium transition-colors",
              status === s
                ? "bg-ink text-white"
                : "bg-surface-muted text-ink-soft hover:bg-line",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-card border border-line bg-surface">
        {/* Column headers (desktop only) */}
        <div className="hidden grid-cols-[2.2fr_0.6fr_1.1fr_1.2fr_1fr_auto] items-center gap-4 border-b border-line px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-faint sm:grid">
          <span>Name</span>
          <span>Age</span>
          <span>City</span>
          <span>Marital status</span>
          <span>Status</span>
          <span />
        </div>

        {filtered.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-ink-faint">
            No clients match your search.
          </p>
        ) : (
          filtered.map((c, i) => (
            <Link
              key={c.id}
              href={`/clients/${c.id}`}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface-muted sm:grid sm:grid-cols-[2.2fr_0.6fr_1.1fr_1.2fr_1fr_auto]",
                i > 0 && "border-t border-line",
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar person={c} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {c.firstName} {c.lastName}
                  </p>
                  {/* Mobile meta line */}
                  <p className="truncate text-sm text-ink-soft sm:hidden">
                    {c.age} · {c.city} · {c.maritalStatus}
                  </p>
                </div>
              </div>

              <span className="hidden text-sm text-ink-soft sm:block">
                {c.age}
              </span>
              <span className="hidden truncate text-sm text-ink-soft sm:block">
                {c.city}
              </span>
              <span className="hidden truncate text-sm text-ink-soft sm:block">
                {c.maritalStatus}
              </span>
              <span className="hidden sm:block">
                <Badge tone={toneForStage(c.status)}>{c.status}</Badge>
              </span>

              <span className="ml-auto flex items-center gap-2 sm:ml-0 sm:justify-end">
                {/* Status badge shows here on mobile */}
                <span className="sm:hidden">
                  <Badge tone={toneForStage(c.status)}>{c.status}</Badge>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-faint" />
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
