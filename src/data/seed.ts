/**
 * The single source of truth for the demo dataset.
 *
 * Everything is generated once (module-level, memoized) from fixed seeds, so
 * the same customers and candidate pool are served on every request. Other
 * modules should import from here rather than calling the generators directly.
 *
 * Pool sizing: we generate 130 male + 130 female candidates. Since matching is
 * always against the *opposite* gender, every customer sees a pool of 130
 * candidates — comfortably above the "at least 100" requirement.
 */

import { DEMO_MATCHMAKER } from "@/config/matchmaker";
import type { Candidate, Customer } from "@/types";
import { generateCandidates, generateCustomers } from "./generate";

// Distinct seeds keep the three datasets independent yet reproducible.
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

// Note: reads (pool lookups, stats, single-customer fetch) go through the
// repository layer in `src/data/repository.ts`, not this module. This file
// only owns generating and exposing the raw seed arrays.
