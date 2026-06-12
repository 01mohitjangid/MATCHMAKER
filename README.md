# TDC Matchmaker

An internal tool for **The Date Crew** matchmakers — manage clients, read verified
biodata, get AI-assisted, gender-specific match suggestions, and send curated
introductions.

- **Live demo:** _add your Vercel URL here after deploying_
- **Sample login:** `priya` / `tdc1234`

---

## What it does

| Area | Details |
|------|---------|
| **Login** | Username/password, HMAC-signed session cookie, route protection via middleware. |
| **Dashboard** | All assigned clients with Name, Age, City, Marital Status, Status Tag — plus search and status filters. |
| **Client detail** | Full verified biodata (incl. India-specific fields: caste, religion, manglik, diet, family values…), partner preferences, and meeting notes. |
| **Matching** | Gender-specific weighted compatibility engine over a 260-profile pool, with explainable scores and tiers. |
| **AI** | Personalised email intros generated per match (Groq / OpenAI-compatible) with a template fallback. |
| **Send match** | "Send match" → modal with the AI intro (editable) → mock email + persisted "Sent" state. |

---

## Write-up

**Tech choices.** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4,
deployed on Vercel. Data lives in **Firebase Firestore**, read through a thin
**repository layer** that falls back to a deterministic in-memory seed when no
keys are present — so the app always runs, and the demo never breaks. The matching
engine and AI layer are pure/server-only modules, keeping secrets off the client.
A pre-push gate (`typecheck + eslint + knip`) keeps the codebase free of dead code.

**Matching logic.** Each client is scored against the opposite-gender pool in
three stages: hard filters (marital status, religion if specified, an age-sanity
window), a **weighted score (0–100)** across nine dimensions, then a tier
(High Potential / Strong / Worth Exploring / Long Shot). Weights are
**gender-specific**: for male clients the brief's directional traits lead —
younger, earns-less, shorter, and shared views on children. For female clients the
logic is "thoughtful" — family **values**, **profession/education**, **relocation**
compatibility, and children carry the most weight. The three directional traits are
applied as *weighted preferences* (they boost the score) rather than hard filters,
so a great fit elsewhere still surfaces. Every score is decomposed into
human-readable reasons (e.g. "12 yrs younger", "Same community", "Open to
relocating").

**How AI is used.** Those match reasons feed an LLM (Groq's free Llama 3.3 70B by
default, via the OpenAI-compatible API) to write a short, warm, personalised email
introduction the matchmaker can edit and send. It runs server-side only, with a
12s timeout and a clean templated fallback if no key is configured or the call
fails — so the feature degrades gracefully and the live demo always works.

**Assumptions.** Single demo matchmaker with all clients pre-assigned; the
"database" is seeded with fictional profiles. Auth is intentionally lightweight
(one signed-cookie session, not a full identity provider). The "Send match" email
is mocked (recorded, not actually delivered). Firestore runs in test mode for the
demo; rules should be locked down for production.

---

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (design tokens via `@theme`)
- **Data:** Firebase Firestore (with in-memory fallback)
- **AI:** Groq (Llama 3.3 70B) — any OpenAI-compatible endpoint works
- **Tooling:** ESLint, Knip (dead-code), Husky (pre-push gate), tsx

---

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in the values below (all optional for a basic run)
npm run dev                  # http://localhost:3000
```

With **no** env vars set, the app runs on in-memory seed data with templated
intros — fully functional for evaluation.

### Optional: Firebase (persistence)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
   → add a Web app → copy the config.
2. **Build → Firestore Database → Create database** (test mode).
3. Put the `NEXT_PUBLIC_FIREBASE_*` values in `.env.local`, then seed:
   ```bash
   npm run seed
   ```

### Optional: AI intros (Groq, free)

1. Get a free key at [console.groq.com](https://console.groq.com) → API Keys.
2. Add to `.env.local`:
   ```
   GROQ_API_KEY=gsk_...
   ```
   (Override `OPENAI_BASE_URL` / `OPENAI_MODEL` to use OpenAI/OpenRouter/Gemini.)

### Production secret

Set a strong `SESSION_SECRET` (e.g. `openssl rand -base64 32`) in production.

---

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build / serve |
| `npm run seed` | Upload seed data to Firestore |
| `npm run check` | Gate: typecheck + lint + knip |
| `npm run lint:fix` / `npm run knip:fix` | Auto-fix lint / remove dead code |

---

## Project structure

```
src/
  app/
    page.tsx              landing (public)
    login/                login screen + auth actions
    (app)/                authenticated shell (guarded)
      dashboard/          client list
      clients/[id]/       detail: biodata, matches, notes + actions
  components/             UI primitives + app components
  lib/
    matching.ts           gender-specific scoring engine
    ai.ts                 AI intro generation (+ fallback)
    session.ts / auth.ts  signed-cookie sessions
    firebase.ts / utils.ts
  data/
    generate.ts / seed.ts deterministic profile generation
    repository.ts          cached reads (Firestore or fallback)
    activity.ts            notes + sent matches (writes)
  middleware.ts            route protection
```
