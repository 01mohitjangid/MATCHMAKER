/**
 * Deterministic generators that turn the raw pools into rich, internally
 * consistent profiles. Everything is seeded (see `lib/rng`) so the demo data
 * is stable across reloads and SSR.
 */

import {
  createRng,
  type Rng,
  randInt,
  pick,
  pickMany,
  chance,
  weightedPick,
} from "@/lib/rng";
import type {
  Biodata,
  Candidate,
  Customer,
  Gender,
  JourneyStage,
  MaritalStatus,
  PartnerPreferences,
  YesNoMaybe,
} from "@/types";
import { ageFromDob } from "@/lib/utils";
import {
  ABOUT_HOBBIES,
  ABOUT_OPENERS,
  CASTES_BY_RELIGION,
  CITIES,
  COLLEGES,
  COMPANIES,
  DEGREES,
  DESIGNATIONS,
  FIRST_NAMES_FEMALE,
  FIRST_NAMES_MALE,
  LANGUAGES,
  LAST_NAMES,
  MOTHER_TONGUES,
  RELIGIONS,
} from "./pools";

const DIETS = ["Vegetarian", "Non-Vegetarian", "Eggetarian", "Vegan", "Jain"] as const;
const HABITS = ["Never", "Occasionally", "Regularly"] as const;
const FAMILY_TYPES = ["Nuclear", "Joint"] as const;
const FAMILY_VALUES = ["Traditional", "Moderate", "Liberal"] as const;
const MANGLIK = ["Yes", "No", "Doesn't Matter"] as const;
const YES_NO_MAYBE: YesNoMaybe[] = ["Yes", "No", "Maybe"];

/** Reference "today" — fixed so generated ages stay deterministic. */
const REFERENCE_YEAR = 2026;

/** A random ISO date (YYYY-MM-DD) within the given year. Day capped at 28. */
function isoDateInYear(rng: Rng, year: number): string {
  const month = randInt(rng, 1, 12);
  const day = randInt(rng, 1, 28);
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Build an ISO DOB string for someone who is `age` years old (approx). */
function dobForAge(rng: Rng, age: number): string {
  return isoDateInYear(rng, REFERENCE_YEAR - age);
}

function makeEmail(first: string, last: string, n: number): string {
  return `${first}.${last}${n}`.toLowerCase() + "@example.com";
}

function makePhone(rng: Rng): string {
  return "+91 " + String(randInt(rng, 70000, 99999)) + String(randInt(rng, 10000, 99999));
}

/** Core biodata generator shared by candidates and customers. */
function makeBiodata(rng: Rng, gender: Gender, index: number): Biodata {
  const firstName = pick(rng, gender === "Male" ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE);
  const lastName = pick(rng, LAST_NAMES);
  const { city, country } = pick(rng, CITIES);

  // Height distributions differ by gender (cm).
  const heightCm =
    gender === "Male" ? randInt(rng, 165, 188) : randInt(rng, 150, 173);

  const age = randInt(rng, 24, 38);
  const religion = pick(rng, RELIGIONS);
  const caste = pick(rng, CASTES_BY_RELIGION[religion] ?? ["—"]);
  const motherTongue = pick(rng, MOTHER_TONGUES);

  // Income broadly rises with a noisy seniority factor.
  const incomeLPA = randInt(rng, 6, 60);

  const languages = Array.from(
    new Set(["English", motherTongue, ...pickMany(rng, LANGUAGES, randInt(rng, 0, 2))]),
  );

  const maritalStatus = weightedPick<MaritalStatus>(rng, [
    ["Never Married", 8],
    ["Divorced", 2],
    ["Widowed", 1],
    ["Awaiting Divorce", 1],
  ]);

  return {
    id: `${gender === "Male" ? "M" : "F"}-${String(index).padStart(4, "0")}`,
    firstName,
    lastName,
    gender,
    dateOfBirth: dobForAge(rng, age),
    country,
    city,
    heightCm,
    email: makeEmail(firstName, lastName, index),
    phone: makePhone(rng),
    undergraduateCollege: pick(rng, COLLEGES),
    degree: pick(rng, DEGREES),
    incomeLPA,
    currentCompany: pick(rng, COMPANIES),
    designation: pick(rng, DESIGNATIONS),
    maritalStatus,
    languagesKnown: languages,
    siblings: randInt(rng, 0, 3),
    religion,
    caste,
    motherTongue,
    diet: pick(rng, DIETS),
    drinking: pick(rng, HABITS),
    smoking: weightedPick(rng, [["Never", 7], ["Occasionally", 2], ["Regularly", 1]]),
    manglik: pick(rng, MANGLIK),
    familyType: pick(rng, FAMILY_TYPES),
    familyValues: pick(rng, FAMILY_VALUES),
    wantKids: weightedPick(rng, [["Yes", 6], ["Maybe", 3], ["No", 1]]),
    openToRelocate: pick(rng, YES_NO_MAYBE),
    openToPets: pick(rng, YES_NO_MAYBE),
    about: `${pick(rng, ABOUT_OPENERS)}, ${pick(rng, ABOUT_HOBBIES)}.`,
    avatarSeed: `${firstName}-${lastName}-${index}`,
  };
}

/** Generate the opposite-gender matching pool. */
export function generateCandidates(gender: Gender, count: number, seed: number): Candidate[] {
  const rng = createRng(seed);
  const out: Candidate[] = [];
  for (let i = 1; i <= count; i++) {
    out.push({ ...makeBiodata(rng, gender, i), activeOnApp: chance(rng, 0.7) });
  }
  return out;
}

/**
 * Derive sensible partner preferences from a customer's own profile.
 * These encode realistic (if traditional) Indian-matchmaking expectations,
 * which the matching engine then applies in a gender-aware way (Step 3).
 */
function derivePreferences(rng: Rng, self: Biodata): PartnerPreferences {
  const selfAge = ageFromDob(self.dateOfBirth);

  // Age window skews slightly by gender, reflecting common stated preferences.
  const ageRange: [number, number] =
    self.gender === "Male"
      ? [Math.max(22, selfAge - 6), selfAge + 1]
      : [selfAge - 1, selfAge + 7];

  const heightRangeCm: [number, number] =
    self.gender === "Male"
      ? [150, self.heightCm - 2]
      : [self.heightCm + 2, 195];

  return {
    ageRange,
    heightRangeCm,
    acceptableMaritalStatuses:
      self.maritalStatus === "Never Married"
        ? ["Never Married"]
        : ["Never Married", "Divorced", "Widowed"],
    religions: chance(rng, 0.6) ? [self.religion] : [],
    minIncomeLPA: self.gender === "Female" ? Math.round(self.incomeLPA * 0.8) : undefined,
    wantKids: self.wantKids,
    relocationExpectation: pick(rng, YES_NO_MAYBE),
    preferredFamilyValues:
      self.familyValues === "Liberal"
        ? ["Liberal", "Moderate"]
        : self.familyValues === "Traditional"
          ? ["Traditional", "Moderate"]
          : ["Moderate", "Liberal", "Traditional"],
    dealBreakers: pick(rng, [
      "Smoking is a hard no.",
      "Must be okay relocating within 2 years.",
      "Looking for someone family-oriented.",
      "Shared values matter more than career.",
      "Wants a partner who travels.",
    ]),
  };
}

const JOURNEY_STAGES: JourneyStage[] = [
  "New Lead",
  "Profile Review",
  "Verified",
  "Active Matching",
  "Dates in Progress",
  "On Hold",
  "Matched",
];

/** Generate the matchmaker's assigned client roster. */
export function generateCustomers(
  matchmakerId: string,
  count: number,
  seed: number,
): Customer[] {
  const rng = createRng(seed);
  const out: Customer[] = [];
  for (let i = 1; i <= count; i++) {
    // Roughly balanced gender split among clients.
    const gender: Gender = chance(rng, 0.5) ? "Male" : "Female";
    const bio = makeBiodata(rng, gender, 9000 + i);
    const status = pick(rng, JOURNEY_STAGES);
    out.push({
      ...bio,
      id: `C-${String(i).padStart(3, "0")}`,
      matchmakerId,
      status,
      verified: status !== "New Lead" && status !== "Profile Review",
      joinedAt: isoDateInYear(rng, REFERENCE_YEAR - 1),
      preferences: derivePreferences(rng, bio),
      notes: [],
    });
  }
  return out;
}
