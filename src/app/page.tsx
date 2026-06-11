import type { ReactNode } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge, toneForStage } from "@/components/ui/Badge";
import {
  ArrowRight,
  HeartSend,
  Mail,
  NoteIcon,
  Route,
  ShieldCheck,
  Sparkles,
} from "@/components/ui/Icons";
import { DEMO_MATCHMAKER } from "@/config/matchmaker";
import { getCandidatePoolFor, getCustomers, getStats } from "@/data/repository";
import { ageFromDob, formatHeight, formatIncome, fullName } from "@/lib/utils";

/**
 * Step 1 checkpoint page.
 *
 * Premium, Google-Store-inspired status page: white canvas, large soft-rounded
 * pastel tiles, bold type, lots of whitespace. It proves the foundation works
 * (design system + seeded data layer) and previews the product. Replaced by the
 * login → dashboard flow in Step 2.
 */

const FEATURES = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    iconColor: "text-positive",
    tint: "bg-tint-mint",
    title: "Verified profiles",
    body: "Every biodata is checked and confirmed before it reaches your dashboard.",
    step: "Step 1",
  },
  {
    icon: <Route className="h-6 w-6" />,
    iconColor: "text-accent",
    tint: "bg-tint-sky",
    title: "Track the journey",
    body: "See exactly where each client stands, from new lead to matched.",
    step: "Step 2",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    iconColor: "text-[#7c3aed]",
    tint: "bg-tint-lilac",
    title: "Smart matching",
    body: "Gender-aware compatibility scoring surfaces the strongest fits first.",
    step: "Step 3",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    iconColor: "text-warning",
    tint: "bg-tint-peach",
    title: "AI-written intros",
    body: "Personalised introductions drafted in seconds, ready to send.",
    step: "Step 4",
  },
  {
    icon: <NoteIcon className="h-6 w-6" />,
    iconColor: "text-brand",
    tint: "bg-tint-blush",
    title: "Quick notes",
    body: "Capture call and meeting notes against each client in one place.",
    step: "Step 2",
  },
  {
    icon: <HeartSend className="h-6 w-6" />,
    iconColor: "text-[#5b54d6]",
    tint: "bg-tint-lavender",
    title: "One-click match",
    body: "Send a curated match with a single button and a personalised email.",
    step: "Step 4",
  },
] as const;

export default async function Home() {
  const [allCustomers, stats, candidatePool] = await Promise.all([
    getCustomers(),
    getStats(),
    // The pool for a male client is the women's profiles.
    getCandidatePoolFor("Male"),
  ]);
  const sampleCustomers = allCustomers.slice(0, 4);
  const sampleCandidates = candidatePool.slice(0, 3);

  return (
    <div className="min-h-full bg-canvas">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <SiteNav />

        {/* ---- Hero ------------------------------------------------- */}
        <section className="py-14 sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-pill border border-line bg-surface-muted px-3.5 py-1.5 text-sm font-medium text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Internal matchmaking tool · The Date Crew
          </span>

          <h1 className="display mt-6 max-w-3xl text-5xl font-bold sm:text-6xl">
            Make every introduction count.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            One calm workspace to manage your clients, read verified profiles,
            and assign matches that actually fit — backed by smart scoring and AI.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#clients"
              className="inline-flex items-center gap-2 rounded-pill bg-brand px-6 py-3 font-medium text-white transition-colors hover:bg-brand-strong"
            >
              Explore the workspace
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#profiles"
              className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-surface px-6 py-3 font-medium text-ink transition-colors hover:bg-surface-muted"
            >
              View sample profiles
            </a>
          </div>
        </section>

        {/* ---- Stats ------------------------------------------------ */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value={stats.customers} label="Assigned clients" />
          <Stat value={stats.totalCandidates} label="Candidate pool" />
          <Stat value={stats.femaleCandidates} label="Women profiles" />
          <Stat value={stats.maleCandidates} label="Men profiles" />
        </section>

        {/* ---- Feature grid (Google-store style pastel tiles) ------- */}
        <section className="mt-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="display text-3xl font-bold sm:text-4xl">
              Everything a matchmaker needs, in one place.
            </h2>
            <p className="mt-3 text-ink-soft">
              The foundation is live. Each capability lands across the next steps.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className={`flex flex-col rounded-card ${f.tint} p-7`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-white/70 ${f.iconColor}`}
                >
                  {f.icon}
                </span>
                <h3 className="mt-5 text-xl font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                  {f.body}
                </p>
                <span className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  {f.step}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* ---- Sample clients --------------------------------------- */}
        <section id="clients" className="mt-20 scroll-mt-24">
          <SectionHeader
            eyebrow="Your roster"
            title="Sample clients"
            note={`${stats.customers} clients assigned to you`}
          />
          <div className="overflow-hidden rounded-card border border-line bg-surface">
            {sampleCustomers.map((c, i) => (
              <div
                key={c.id}
                className={`flex items-center gap-4 px-6 py-4 transition-colors hover:bg-surface-muted ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <Avatar person={c} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{fullName(c)}</p>
                  <p className="truncate text-sm text-ink-soft">
                    {ageFromDob(c.dateOfBirth)} · {c.city} · {c.maritalStatus}
                  </p>
                </div>
                <Badge tone={toneForStage(c.status)}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </section>

        {/* ---- Sample candidate profiles ---------------------------- */}
        <section id="profiles" className="mt-16 scroll-mt-24">
          <SectionHeader
            eyebrow="The pool"
            title="Sample candidate profiles"
            note={`${stats.totalCandidates} verified candidates`}
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {sampleCandidates.map((p) => (
              <article
                key={p.id}
                className="rounded-card border border-line bg-surface p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <Avatar person={p} size={44} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{fullName(p)}</p>
                    <p className="text-sm text-ink-soft">
                      {ageFromDob(p.dateOfBirth)} yrs
                    </p>
                  </div>
                </div>
                <dl className="mt-5 space-y-2 text-sm">
                  <Row k="City" v={`${p.city}, ${p.country}`} />
                  <Row k="Height" v={formatHeight(p.heightCm)} />
                  <Row k="Income" v={formatIncome(p.incomeLPA)} />
                  <Row k="Works as" v={p.designation} />
                </dl>
                <p className="mt-5 border-t border-line pt-4 text-sm italic text-ink-soft">
                  “{p.about}”
                </p>
              </article>
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}

/* ----------------------------- Pieces ------------------------------ */

function SiteNav() {
  // Derive name parts from the single source of truth instead of hardcoding.
  const [firstName = "", ...rest] = DEMO_MATCHMAKER.name.split(" ");
  const lastName = rest.join(" ");
  return (
    <nav className="mt-6 flex items-center justify-between rounded-pill border border-line bg-surface px-5 py-3 shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-base font-bold text-white">
          ♥
        </span>
        <span className="text-[15px] font-semibold tracking-tight">
          TDC Matchmaker
        </span>
      </div>
      <div className="hidden items-center gap-7 text-sm font-medium text-ink-soft sm:flex">
        <span className="text-ink">Overview</span>
        <span className="cursor-not-allowed opacity-50">Dashboard</span>
        <span className="cursor-not-allowed opacity-50">Matches</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="hidden text-right text-sm sm:block">
          <span className="block font-medium leading-tight">
            {DEMO_MATCHMAKER.name}
          </span>
          <span className="block text-xs leading-tight text-ink-faint">
            Matchmaker
          </span>
        </span>
        <Avatar
          person={{ firstName, lastName, avatarSeed: DEMO_MATCHMAKER.avatarSeed }}
          size={36}
        />
      </div>
    </nav>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-tile border border-line bg-surface p-5">
      <p className="display text-4xl font-bold">{value}</p>
      <p className="mt-1.5 text-sm text-ink-soft">{label}</p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      <p className="hidden whitespace-nowrap text-sm text-ink-faint sm:block">
        {note}
      </p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-faint">{k}</dt>
      <dd className="truncate text-right font-medium">{v}</dd>
    </div>
  );
}

function Footer(): ReactNode {
  return (
    <footer className="mt-20 border-t border-line py-10 text-sm text-ink-faint">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>TDC Matchmaker · Internal MVP</p>
        <p>
          Demo login —{" "}
          <span className="font-medium text-ink-soft">priya / tdc1234</span>
        </p>
      </div>
    </footer>
  );
}
