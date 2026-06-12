export type Gender = "Male" | "Female";

export type YesNoMaybe = "Yes" | "No" | "Maybe";

export type MaritalStatus =
  | "Never Married"
  | "Divorced"
  | "Widowed"
  | "Awaiting Divorce";

export type Diet =
  | "Vegetarian"
  | "Non-Vegetarian"
  | "Eggetarian"
  | "Vegan"
  | "Jain";

export type Habit = "Never" | "Occasionally" | "Regularly";

export type FamilyType = "Nuclear" | "Joint";

export type FamilyValues = "Traditional" | "Moderate" | "Liberal";

export type Manglik = "Yes" | "No" | "Doesn't Matter";


export type JourneyStage =
  | "New Lead"
  | "Profile Review"
  | "Verified"
  | "Active Matching"
  | "Dates in Progress"
  | "On Hold"
  | "Matched";

export interface Biodata {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string;

  country: string;
  city: string;
  heightCm: number;

  email: string;
  phone: string;

  undergraduateCollege: string;
  degree: string;

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

  diet: Diet;
  drinking: Habit;
  smoking: Habit;
  manglik: Manglik;
  familyType: FamilyType;
  familyValues: FamilyValues;

  wantKids: YesNoMaybe;
  openToRelocate: YesNoMaybe;
  openToPets: YesNoMaybe;

  about: string;
  avatarSeed: string;
}

export interface Candidate extends Biodata {
  activeOnApp: boolean;
}

export interface PartnerPreferences {
  ageRange: [min: number, max: number];
  heightRangeCm?: [min: number, max: number];
  acceptableMaritalStatuses: MaritalStatus[];
  religions: string[];
  minIncomeLPA?: number;
  wantKids: YesNoMaybe;
  relocationExpectation: YesNoMaybe;
  preferredFamilyValues: FamilyValues[];
  dealBreakers: string;
}

export interface MatchmakerNote {
  id: string;
  createdAt: string;
  author: string;
  body: string;
}

export interface Customer extends Biodata {
  matchmakerId: string;
  status: JourneyStage;
  verified: boolean;
  joinedAt: string;
  preferences: PartnerPreferences;
  notes: MatchmakerNote[];
}

export interface Matchmaker {
  id: string;
  name: string;
  username: string;
  password: string;
  email: string;
  avatarSeed: string;
}

export type SafeMatchmaker = Omit<Matchmaker, "password">;

export interface MatchReason {
  label: string;
  weight: number;
  positive: boolean;
}

export type MatchTier =
  | "High Potential Match"
  | "Strong Match"
  | "Worth Exploring"
  | "Long Shot";

export interface MatchResult {
  candidate: Candidate;
  score: number;
  tier: MatchTier;
  reasons: MatchReason[];
  aiExplanation?: string;
}
