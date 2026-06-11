/**
 * Domain types for the TDC Matchmaker platform.
 *
 * The data model is intentionally split into three layers:
 *   1. `Biodata`      — the verified profile fields shared by everyone
 *                       (both paying clients and the candidate pool).
 *   2. `Candidate`    — a profile in the matchmaking pool (Biodata + a few
 *                       pool-only signals like `activeOnApp`).
 *   3. `Customer`     — a TDC client assigned to a matchmaker. Extends Biodata
 *                       with CRM/journey fields (status, notes, preferences).
 *
 * Keeping a single shared `Biodata` shape means the matching engine can compare
 * a Customer against a Candidate field-for-field without any mapping glue.
 */

export type Gender = "Male" | "Female";

export type YesNoMaybe = "Yes" | "No" | "Maybe";

export type MaritalStatus =
  | "Never Married"
  | "Divorced"
  | "Widowed"
  | "Awaiting Divorce";

/** Dietary preference — a high-signal field in Indian matchmaking. */
export type Diet =
  | "Vegetarian"
  | "Non-Vegetarian"
  | "Eggetarian"
  | "Vegan"
  | "Jain";

/** Lifestyle habit frequency, used for smoking & drinking. */
export type Habit = "Never" | "Occasionally" | "Regularly";

export type FamilyType = "Nuclear" | "Joint";

export type FamilyValues = "Traditional" | "Moderate" | "Liberal";

/** Astrological compatibility flag — culturally relevant, optional in logic. */
export type Manglik = "Yes" | "No" | "Doesn't Matter";

/**
 * Where a client sits in the matchmaking journey. Doubles as the dashboard
 * "Status Tag". Ordered loosely from intake → success.
 */
export type JourneyStage =
  | "New Lead"
  | "Profile Review"
  | "Verified"
  | "Active Matching"
  | "Dates in Progress"
  | "On Hold"
  | "Matched";

/**
 * The verified biodata shared by clients and the candidate pool.
 * `dateOfBirth` is stored as an ISO date string; age is always derived
 * (never stored) so it stays correct over time.
 */
export interface Biodata {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  /** ISO date string, e.g. "1994-08-21". */
  dateOfBirth: string;

  country: string;
  city: string;
  /** Height in centimetres (canonical unit; formatted to ft/in in the UI). */
  heightCm: number;

  email: string;
  phone: string;

  undergraduateCollege: string;
  degree: string;

  /** Annual income in INR lakhs per annum (LPA) — the Indian convention. */
  incomeLPA: number;
  currentCompany: string;
  designation: string;

  maritalStatus: MaritalStatus;
  languagesKnown: string[];
  /** Number of siblings. */
  siblings: number;

  religion: string;
  caste: string;
  motherTongue: string;

  // ---- India-specific lifestyle & family signals (from research) ----
  diet: Diet;
  drinking: Habit;
  smoking: Habit;
  manglik: Manglik;
  familyType: FamilyType;
  familyValues: FamilyValues;

  wantKids: YesNoMaybe;
  openToRelocate: YesNoMaybe;
  openToPets: YesNoMaybe;

  /** Short self-introduction shown on the profile. */
  about: string;
  /** Deterministic avatar seed (we render initials/illustrations, not photos). */
  avatarSeed: string;
}

/** A profile in the opposite-gender matching pool. */
export interface Candidate extends Biodata {
  /** Recency signal used as a small tie-breaker in ranking. */
  activeOnApp: boolean;
}

/**
 * What a client is looking for in a partner. Drives the matching engine,
 * especially the more nuanced female-customer logic.
 */
export interface PartnerPreferences {
  ageRange: [min: number, max: number];
  heightRangeCm?: [min: number, max: number];
  acceptableMaritalStatuses: MaritalStatus[];
  /** Empty array = open to all religions. */
  religions: string[];
  /** Minimum acceptable partner income in LPA. */
  minIncomeLPA?: number;
  wantKids: YesNoMaybe;
  relocationExpectation: YesNoMaybe;
  preferredFamilyValues: FamilyValues[];
  /** Free-text "what matters most" note from intake. */
  dealBreakers: string;
}

/** A timestamped note recorded by the matchmaker after a call or meeting. */
export interface MatchmakerNote {
  id: string;
  /** ISO datetime string. */
  createdAt: string;
  author: string;
  body: string;
}

/** A TDC client assigned to a matchmaker. */
export interface Customer extends Biodata {
  matchmakerId: string;
  status: JourneyStage;
  verified: boolean;
  /** ISO date the client joined TDC. */
  joinedAt: string;
  preferences: PartnerPreferences;
  notes: MatchmakerNote[];
}

/** The logged-in matchmaker (also used for the demo login). */
export interface Matchmaker {
  id: string;
  name: string;
  username: string;
  /** Demo-only — never do this in production. */
  password: string;
  email: string;
  avatarSeed: string;
}

// ---- Matching engine output (consumed in Steps 3 & 4) ----

/** A single human-readable reason contributing to a match score. */
export interface MatchReason {
  label: string;
  /** Signed contribution to the score, for transparency. */
  weight: number;
  positive: boolean;
}

export type MatchTier =
  | "High Potential Match"
  | "Strong Match"
  | "Worth Exploring"
  | "Long Shot";

/** A scored candidate for a given customer. */
export interface MatchResult {
  candidate: Candidate;
  /** 0–100 normalised compatibility score. */
  score: number;
  tier: MatchTier;
  reasons: MatchReason[];
  /** Optional AI-generated narrative (filled in Step 4). */
  aiExplanation?: string;
}
