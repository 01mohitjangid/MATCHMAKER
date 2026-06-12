import Link from "next/link";

import { Avatar } from "@/components/ui/Avatar";
import {
  ArrowRight,
  HeartSend,
  Mail,
  MapPin,
  NoteIcon,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
} from "@/components/ui/Icons";
import { getCandidatePoolFor, getStats } from "@/data/repository";
import { getSession } from "@/lib/auth";
import { ageFromDob, formatHeight, formatIncome, fullName } from "@/lib/utils";

/**
 * Public landing / overview page. Shows what the tool does and a few sample
 * profiles, then routes the matchmaker to sign in. Authenticated work lives
 * behind /dashboard.
 */

const FEATURES = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    iconColor: "text-positive",
    tint: "bg-tint-mint",
    title: "Verified profiles",
    body: "Every biodata is checked and confirmed before it reaches your dashboard.",
  },
  {
    icon: <Route className="h-6 w-6" />,
    iconColor: "text-accent",
    tint: "bg-tint-sky",
    title: "Track the journey",
    body: "See exactly where each client stands, from new lead to matched.",
  },
  {
    icon: <Sparkles className="h-6 w-6" />,
    iconColor: "text-[#7c3aed]",
    tint: "bg-tint-lilac",
    title: "Smart matching",
    body: "Gender-aware compatibility scoring surfaces the strongest fits first.",
  },
  {
    icon: <Mail className="h-6 w-6" />,
    iconColor: "text-warning",
    tint: "bg-tint-peach",
    title: "AI-written intros",
    body: "Personalised introductions drafted in seconds, ready to send.",
  },
  {
    icon: <NoteIcon className="h-6 w-6" />,
    iconColor: "text-brand",
    tint: "bg-tint-blush",
    title: "Quick notes",
    body: "Capture call and meeting notes against each client in one place.",
  },
  {
    icon: <HeartSend className="h-6 w-6" />,
    iconColor: "text-[#5b54d6]",
    tint: "bg-tint-lavender",
    title: "One-click match",
    body: "Send a curated match with a single button and a personalised email.",
  },
] as const;

export default async function Home() {
  const [session, stats, candidatePool] = await Promise.all([
    getSession(),
    getStats(),
    getCandidatePoolFor("Male"), // women's profiles, for the showcase
  ]);
  const sampleCandidates = candidatePool.slice(0, 3);
  const isAuthed = Boolean(session);

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Hero — full-bleed peach search experience */}
      <section className="relative isolate overflow-hidden">
        {/* Peach gradient background */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #ffeede 0%, #ffe2d2 45%, #fff4ea 100%)",
          }}
        />
        {/* Soft glow blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-10 -z-10 h-72 w-72 rounded-full bg-white/60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-40 -z-10 h-72 w-72 rounded-full bg-white/50 blur-3xl"
        />
        {/* Floral decorations */}
        <FloralLeft className="pointer-events-none absolute -left-4 top-32 hidden h-44 w-44 md:block lg:left-6 lg:h-56 lg:w-56" />
        <FloralRight className="pointer-events-none absolute -right-4 top-40 hidden h-44 w-44 md:block lg:right-6 lg:h-56 lg:w-56" />

        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <SiteNav isAuthed={isAuthed} />

          <div className="relative pb-20 pt-14 text-center sm:pb-28 sm:pt-20">
            <h1 className="display mx-auto max-w-3xl text-4xl font-bold text-ink sm:text-6xl">
              Find a partner of <br className="hidden sm:block" /> your choice
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg">
              We made it easy for you to get your life partner in your location.
            </p>

            {/* Search card */}
            <form
              action={isAuthed ? "/dashboard" : "/login"}
              className="mx-auto mt-10 max-w-4xl rounded-3xl bg-white p-3 text-left shadow-[0_25px_60px_-20px_rgba(226,62,107,0.25)] ring-1 ring-black/5"
            >
              <div className="grid grid-cols-1 items-stretch gap-2 sm:grid-cols-[1fr_1fr_1.1fr_auto]">
                <SearchSelect
                  label="I'm looking for"
                  name="lookingFor"
                  defaultValue="female"
                  options={[
                    { value: "female", label: "Female's Biodata" },
                    { value: "male", label: "Male's Biodata" },
                  ]}
                />
                <SearchSelect
                  label="Marital Status"
                  name="maritalStatus"
                  defaultValue="never"
                  options={[
                    { value: "never", label: "Never Married" },
                    { value: "divorced", label: "Divorced" },
                    { value: "widowed", label: "Widowed" },
                  ]}
                  withDivider
                />
                <SearchInput
                  label="Location"
                  name="location"
                  placeholder="Where are you looking for?"
                  withDivider
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-7 py-4 font-medium text-white transition-colors hover:bg-brand-strong sm:rounded-2xl"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={isAuthed ? "/dashboard" : "/login"}
                className="inline-flex items-center gap-2 rounded-pill bg-ink px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink/90"
              >
                {isAuthed ? "Go to dashboard" : "Sign in to continue"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#profiles"
                className="inline-flex items-center gap-2 rounded-pill border border-line-strong bg-white/70 px-5 py-2.5 text-sm font-medium text-ink backdrop-blur transition-colors hover:bg-white"
              >
                View sample profiles
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-5 pt-16 sm:px-8">
        {/* Stats */}
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat value={stats.customers} label="Assigned clients" />
          <Stat value={stats.totalCandidates} label="Candidate pool" />
          <Stat value={stats.femaleCandidates} label="Women profiles" />
          <Stat value={stats.maleCandidates} label="Men profiles" />
        </section>

        {/* Feature grid */}
        <section className="mt-16">
          <div className="mb-8 max-w-2xl">
            <h2 className="display text-3xl font-bold sm:text-4xl">
              Everything a matchmaker needs, in one place.
            </h2>
            <p className="mt-3 text-ink-soft">
              From verified biodata to AI-assisted matches and one-click intros.
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
              </article>
            ))}
          </div>
        </section>

        {/* Sample candidate profiles */}
        <section id="profiles" className="mt-20 scroll-mt-24">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                The pool
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight">
                Sample candidate profiles
              </h2>
            </div>
            <p className="hidden whitespace-nowrap text-sm text-ink-faint sm:block">
              {stats.totalCandidates} verified candidates
            </p>
          </div>

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
      </div>
    </div>
  );
}

/* ----------------------------- Pieces ------------------------------ */

function SiteNav({ isAuthed }: { isAuthed: boolean }) {
  return (
    <nav className="mt-6 flex items-center justify-between rounded-pill border border-line bg-surface px-5 py-2.5 shadow-sm">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-base font-bold text-white">
          ♥
        </span>
        <span className="text-[15px] font-semibold tracking-tight">
          TDC Matchmaker
        </span>
      </Link>
      <Link
        href={isAuthed ? "/dashboard" : "/login"}
        className="inline-flex items-center gap-1.5 rounded-pill bg-ink px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ink/90"
      >
        {isAuthed ? "Dashboard" : "Sign in"}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
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

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-faint">{k}</dt>
      <dd className="truncate text-right font-medium">{v}</dd>
    </div>
  );
}

/* ------------------------- Hero search bar ------------------------- */

type Option = { value: string; label: string };

function SearchSelect({
  label,
  name,
  defaultValue,
  options,
  withDivider = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: Option[];
  withDivider?: boolean;
}) {
  return (
    <label
      className={`relative flex flex-col justify-center px-5 py-3 sm:py-2 ${
        withDivider ? "sm:border-l sm:border-line" : ""
      }`}
    >
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <div className="relative mt-1">
        <select
          name={name}
          defaultValue={defaultValue}
          className="w-full appearance-none bg-transparent pr-6 text-sm text-ink-soft outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
      </div>
    </label>
  );
}

function SearchInput({
  label,
  name,
  placeholder,
  withDivider = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  withDivider?: boolean;
}) {
  return (
    <label
      className={`relative flex flex-col justify-center px-5 py-3 sm:py-2 ${
        withDivider ? "sm:border-l sm:border-line" : ""
      }`}
    >
      <span className="text-[13px] font-semibold text-ink">{label}</span>
      <div className="relative mt-1 flex items-center gap-2">
        <input
          name={name}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
        />
        <MapPin className="h-4 w-4 shrink-0 text-ink-faint" />
      </div>
    </label>
  );
}

function ChevronDown({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ----------------------- Decorative florals ------------------------ */

function FloralLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {/* leaves */}
      <path
        d="M30 110 C 50 70, 90 60, 120 80"
        stroke="#7a4a3a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="60" cy="78" rx="22" ry="11" fill="#9bd3c8" transform="rotate(-25 60 78)" />
      <ellipse cx="92" cy="70" rx="18" ry="9" fill="#7cc1b3" transform="rotate(-10 92 70)" />
      {/* pink flower */}
      <g transform="translate(40 120)">
        <circle r="14" fill="#f29ab0" />
        <circle r="14" cx="-18" cy="-2" fill="#f6b8c5" />
        <circle r="14" cx="14" cy="-10" fill="#e87890" />
        <circle r="14" cx="6" cy="14" fill="#f29ab0" />
        <circle r="6" fill="#fff5e8" />
      </g>
      {/* small daisy */}
      <g transform="translate(120 130)">
        {[0, 60, 120, 180, 240, 300].map((d) => (
          <ellipse
            key={d}
            cx="0"
            cy="-10"
            rx="5"
            ry="9"
            fill="#fff5e8"
            transform={`rotate(${d})`}
          />
        ))}
        <circle r="5" fill="#f0b541" />
      </g>
    </svg>
  );
}

function FloralRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <path
        d="M170 110 C 150 70, 110 60, 80 80"
        stroke="#7a4a3a"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="140" cy="78" rx="22" ry="11" fill="#9bd3c8" transform="rotate(25 140 78)" />
      <ellipse cx="108" cy="70" rx="18" ry="9" fill="#7cc1b3" transform="rotate(10 108 70)" />
      {/* purple flower */}
      <g transform="translate(160 120)">
        <circle r="14" fill="#b89ad6" />
        <circle r="14" cx="18" cy="-2" fill="#cdb6e3" />
        <circle r="14" cx="-14" cy="-10" fill="#9c7cc4" />
        <circle r="14" cx="-6" cy="14" fill="#b89ad6" />
        <circle r="6" fill="#fff5e8" />
      </g>
      {/* coral flower */}
      <g transform="translate(80 135)">
        <circle r="11" fill="#ef6f7a" />
        <circle r="11" cx="-14" cy="-2" fill="#f48b94" />
        <circle r="11" cx="11" cy="-10" fill="#e85966" />
        <circle r="5" fill="#fff5e8" />
      </g>
    </svg>
  );
}
