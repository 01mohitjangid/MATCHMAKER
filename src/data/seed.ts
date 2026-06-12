
import { DEMO_MATCHMAKER } from "@/config/matchmaker";
import type { Candidate, Customer } from "@/types";
import { generateCandidates, generateCustomers } from "./generate";

const SEED_MALE_POOL = 0x5151;
const SEED_FEMALE_POOL = 0x9292;
const SEED_CUSTOMERS = 0x1234;

const CANDIDATES_PER_GENDER = 130;
const CUSTOMER_COUNT = 12;

export const maleCandidates: Candidate[] = generateCandidates(
  "Male",
  CANDIDATES_PER_GENDER,
  SEED_MALE_POOL,
);

export const femaleCandidates: Candidate[] = generateCandidates(
  "Female",
  CANDIDATES_PER_GENDER,
  SEED_FEMALE_POOL,
);

export const customers: Customer[] = generateCustomers(
  DEMO_MATCHMAKER.id,
  CUSTOMER_COUNT,
  SEED_CUSTOMERS,
);