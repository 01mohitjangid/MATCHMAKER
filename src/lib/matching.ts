/**
 * Gender-specific matching engine.
 *
 * Pipeline:
 *   1. Hard filters — drop ineligible candidates (marital status, religion if
 *      the client specified one, and an absolute age-sanity window).
 *   2. Weighted scoring — each dimension scores 0..1; weights differ by the
 *      client's gender. Three dimensions are *directional* (age / income /
 *      height) and flip meaning by gender, per the brief:
 *        • Male clients  → younger, earns-less, shorter are rewarded.
 *        • Female clients → values, profession, and relocation lead; age leans
 *          similar/slightly-older, height leans taller.
 *      Per the product decision, directional rules are WEIGHTED (boost the
 *      score) rather than hard filters — a great fit elsewhere still surfaces.
 *   3. Tier + reasons — score maps to a tier and the top contributing factors
 *      become human-readable reasons (also the input for the Step 4 AI).
 *   4. Rank — sort by score, deterministic tie-breaks.
 *
 * Everything here is a pure function, so it's trivially testable and runs the
 * same on server or client.
 */

import { ageFromDob } from "@/lib/utils";
import type {
  Biodata,
  Candidate,
  Customer,
  Gender,
  MatchReason,
  MatchResult,
  MatchTier,
} from "@/types";

interface DimensionScore {
  /** 0..1 */
  score: number;
  /** Human-readable summary of this dimension for this pairing. */
  label: string;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Relative dimension weights per the client's gender (normalised at scoring). */
const WEIGHTS: Record<Gender, Record<string, number>> = {
  // Male → women: brief's directional traits + children lead.
  Male: {
    kids: 20,
    age: 18,
    income: 12,
    religion: 12,
    height: 10,
    lifestyle: 10,
    values: 8,
    location: 6,
    profession: 4,
  },
  // Female → men: "thoughtful" — values, profession, relocation lead.
  Female: {
    values: 20,
    profession: 18,
    kids: 16,
    location: 14,
    age: 12,
    income: 8,
    religion: 6,
    lifestyle: 4,
    height: 2,
  },
};

/** Institutes treated as a peer tier for the education dimension. */
const PREMIER_INSTITUTES = new Set([
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "IIT Kanpur",
  "BITS Pilani",
  "IIM Ahmedabad",
  "ISB Hyderabad",
  "AIIMS Delhi",
  "NLU Bangalore",
  "NIT Trichy",
]);

const yrs = (n: number) => `${n} yr${n === 1 ? "" : "s"}`;

// ---- dimension scorers ---------------------------------------------------

function scoreKids(a: Biodata, b: Biodata): DimensionScore {
  if (a.wantKids === b.wantKids) {
    const label =
      a.wantKids === "Yes"
        ? "Both want kids"
        : a.wantKids === "No"
          ? "Neither wants kids"
          : "Both open to kids";
    return { score: 1, label };
  }
  if (a.wantKids === "Maybe" || b.wantKids === "Maybe") {
    return { score: 0.6, label: "Flexible on kids" };
  }
  return { score: 0, label: "Different views on kids" };
}

function scoreAge(client: Biodata, c: Biodata, gender: Gender): DimensionScore {
  const clientAge = ageFromDob(client.dateOfBirth);
  const candAge = ageFromDob(c.dateOfBirth);

  if (gender === "Male") {
    const diff = clientAge - candAge; // positive = younger
    const label =
      diff > 0 ? `${yrs(diff)} younger` : diff < 0 ? `${yrs(-diff)} older` : "Same age";
    return { score: clamp01(0.7 + diff * 0.06), label };
  }
  const diff = candAge - clientAge; // positive = man older
  const label =
    diff > 0 ? `${yrs(diff)} older` : diff < 0 ? `${yrs(-diff)} younger` : "Same age";
  return { score: clamp01(1 - Math.abs(diff - 2) / 8), label };
}

function scoreIncome(client: Biodata, c: Biodata, gender: Gender): DimensionScore {
  const ratio = c.incomeLPA / client.incomeLPA;
  if (gender === "Male") {
    const score = ratio <= 1.05 ? 1 : ratio <= 1.3 ? 0.6 : 0.3;
    const label =
      ratio < 0.85 ? "Earns less" : ratio <= 1.15 ? "Comparable income" : "Earns more";
    return { score, label };
  }
  const score = ratio >= 1 ? 1 : ratio >= 0.7 ? 0.7 : 0.4;
  const label =
    ratio >= 1.15 ? "Strong earner" : ratio >= 0.85 ? "Comparable income" : "Earns less";
  return { score, label };
}

function scoreHeight(client: Biodata, c: Biodata, gender: Gender): DimensionScore {
  if (gender === "Male") {
    const diff = client.heightCm - c.heightCm; // positive = shorter
    const score = diff >= 2 ? 1 : diff >= -2 ? 0.6 : 0.2;
    return {
      score,
      label: diff >= 2 ? "Shorter" : diff >= -2 ? "Similar height" : "Taller",
    };
  }
  const diff = c.heightCm - client.heightCm; // positive = man taller
  const score = diff >= 5 ? 1 : diff >= 0 ? 0.7 : 0.3;
  return {
    score,
    label: diff >= 5 ? "Taller" : diff >= 0 ? "Slightly taller" : "Shorter",
  };
}

function scoreReligion(a: Biodata, b: Biodata): DimensionScore {
  if (a.religion === b.religion) {
    if (a.caste === b.caste) {
      return { score: 1, label: `Same community · ${a.religion}, ${a.caste}` };
    }
    return { score: 0.7, label: `Same religion · ${a.religion}` };
  }
  return { score: 0.2, label: "Different religion" };
}

const VEG_DIETS = new Set(["Vegetarian", "Jain", "Vegan"]);
const HABIT_ORDER = { Never: 0, Occasionally: 1, Regularly: 2 } as const;

function scoreLifestyle(a: Biodata, b: Biodata): DimensionScore {
  const diet =
    a.diet === b.diet
      ? 1
      : VEG_DIETS.has(a.diet) === VEG_DIETS.has(b.diet)
        ? 0.7
        : 0.3;
  const habit = (x: keyof typeof HABIT_ORDER, y: keyof typeof HABIT_ORDER) => {
    const d = Math.abs(HABIT_ORDER[x] - HABIT_ORDER[y]);
    return d === 0 ? 1 : d === 1 ? 0.55 : 0.15;
  };
  const score =
    diet * 0.4 + habit(a.drinking, b.drinking) * 0.3 + habit(a.smoking, b.smoking) * 0.3;
  return {
    score,
    label:
      score >= 0.75
        ? "Similar lifestyle"
        : score >= 0.5
          ? "Mostly compatible lifestyle"
          : "Different lifestyle",
  };
}

const VALUES_ORDER = { Traditional: 0, Moderate: 1, Liberal: 2 } as const;

function scoreValues(a: Biodata, b: Biodata): DimensionScore {
  const d = Math.abs(VALUES_ORDER[a.familyValues] - VALUES_ORDER[b.familyValues]);
  const proximity = d === 0 ? 1 : d === 1 ? 0.6 : 0.2;
  const family = a.familyType === b.familyType ? 1 : 0.5;
  const score = proximity * 0.8 + family * 0.2;
  return {
    score,
    label:
      d === 0
        ? `Shared values · ${a.familyValues}`
        : score >= 0.6
          ? "Compatible values"
          : "Differing values",
  };
}

function scoreLocation(a: Biodata, b: Biodata): DimensionScore {
  if (a.city === b.city) return { score: 1, label: `Both in ${a.city}` };
  const openness = (v: Biodata["openToRelocate"]) =>
    v === "Yes" ? 1 : v === "Maybe" ? 0.5 : 0;
  const o = Math.max(openness(a.openToRelocate), openness(b.openToRelocate));
  const score = o === 1 ? 0.7 : o === 0.5 ? 0.5 : 0.2;
  return {
    score,
    label:
      o === 1
        ? "Open to relocating"
        : o === 0.5
          ? "Maybe open to relocating"
          : "Different cities",
  };
}

function scoreProfession(a: Biodata, b: Biodata): DimensionScore {
  const pa = PREMIER_INSTITUTES.has(a.undergraduateCollege);
  const pb = PREMIER_INSTITUTES.has(b.undergraduateCollege);
  if (pa && pb) return { score: 1, label: "Both from premier institutes" };
  if (!pa && !pb) return { score: 0.7, label: "Similar academic background" };
  return { score: 0.55, label: "Differing academic background" };
}

// ---- assembly ------------------------------------------------------------

function tierForScore(score: number): MatchTier {
  if (score >= 80) return "High Potential Match";
  if (score >= 65) return "Strong Match";
  if (score >= 50) return "Worth Exploring";
  return "Long Shot";
}

function scoreCandidate(client: Customer, c: Candidate): MatchResult {
  const gender = client.gender;
  const w = WEIGHTS[gender];

  const dims: { key: string; ds: DimensionScore }[] = [
    { key: "kids", ds: scoreKids(client, c) },
    { key: "age", ds: scoreAge(client, c, gender) },
    { key: "income", ds: scoreIncome(client, c, gender) },
    { key: "height", ds: scoreHeight(client, c, gender) },
    { key: "religion", ds: scoreReligion(client, c) },
    { key: "lifestyle", ds: scoreLifestyle(client, c) },
    { key: "values", ds: scoreValues(client, c) },
    { key: "location", ds: scoreLocation(client, c) },
    { key: "profession", ds: scoreProfession(client, c) },
  ];

  let totalWeight = 0;
  let weighted = 0;
  const reasons: MatchReason[] = [];

  for (const { key, ds } of dims) {
    const weight = w[key];
    totalWeight += weight;
    weighted += weight * ds.score;
    reasons.push({
      label: ds.label,
      weight: Math.round(weight * ds.score),
      positive: ds.score >= 0.6,
    });
  }

  const score = Math.round((weighted / totalWeight) * 100);
  reasons.sort((a, b) => b.weight - a.weight);

  return { candidate: c, score, tier: tierForScore(score), reasons };
}

const AGE_SANITY_SPREAD = 12;

function isEligible(client: Customer, c: Candidate): boolean {
  const prefs = client.preferences;
  if (!prefs.acceptableMaritalStatuses.includes(c.maritalStatus)) return false;
  if (prefs.religions.length > 0 && !prefs.religions.includes(c.religion)) {
    return false;
  }
  const ageGap = Math.abs(
    ageFromDob(client.dateOfBirth) - ageFromDob(c.dateOfBirth),
  );
  if (ageGap > AGE_SANITY_SPREAD) return false;
  if (ageFromDob(c.dateOfBirth) < 21) return false;
  return true;
}

/**
 * Rank the opposite-gender pool for a client, best first.
 * @param pool candidates of the opposite gender (see `getCandidatePoolFor`).
 */
export function rankMatches(
  client: Customer,
  pool: Candidate[],
  limit = 12,
): MatchResult[] {
  return pool
    .filter((c) => isEligible(client, c))
    .map((c) => scoreCandidate(client, c))
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.candidate.activeOnApp) - Number(a.candidate.activeOnApp) ||
        a.candidate.id.localeCompare(b.candidate.id),
    )
    .slice(0, limit);
}
