/**
 * Data-access layer (repository pattern).
 *
 * The rest of the app reads data ONLY through these functions, never from
 * Firestore or the seed module directly. That keeps the storage backend
 * swappable and the call sites clean.
 *
 * Behaviour:
 *   • Firebase configured  → reads from Firestore.
 *   • Not configured       → falls back to the in-memory generated seed, with
 *                            a one-time warning, so the app boots during local
 *                            dev before any keys are added.
 *
 * Each read is wrapped in React's `cache()` so multiple calls within a single
 * server render are de-duplicated (e.g. the page and `getStats()` both needing
 * the customer list hit Firestore once, not twice). Results are sorted by id so
 * ordering is stable whether they come from Firestore (unordered) or the
 * in-memory seed.
 *
 * To populate Firestore, add `.env.local` and run `npm run seed`.
 */

import { cache } from "react";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

import { COLLECTIONS, getDb, isFirebaseConfigured } from "@/lib/firebase";
import type { Candidate, Customer, Gender } from "@/types";
import {
  customers as seedCustomers,
  femaleCandidates,
  maleCandidates,
} from "@/data/seed";

let warned = false;
function warnFallback() {
  if (!warned) {
    console.warn(
      "[data] Firebase not configured — serving in-memory seed data. " +
        "Add .env.local and run `npm run seed` to use Firestore.",
    );
    warned = true;
  }
}

/** Stable ascending sort by id (e.g. C-001, F-0001, M-0001). */
function byId<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.id.localeCompare(b.id));
}

/** All clients assigned to the matchmaker. */
export const getCustomers = cache(async (): Promise<Customer[]> => {
  if (!isFirebaseConfigured) {
    warnFallback();
    return byId(seedCustomers);
  }
  const snap = await getDocs(collection(getDb(), COLLECTIONS.customers));
  return byId(snap.docs.map((d) => d.data() as Customer));
});

/** A single client by id, or undefined if not found. */
export const getCustomerById = cache(
  async (id: string): Promise<Customer | undefined> => {
    if (!isFirebaseConfigured) {
      warnFallback();
      return seedCustomers.find((c) => c.id === id);
    }
    const snap = await getDoc(doc(getDb(), COLLECTIONS.customers, id));
    return snap.exists() ? (snap.data() as Customer) : undefined;
  },
);

/** Every candidate in the pool (both genders). */
export const getAllCandidates = cache(async (): Promise<Candidate[]> => {
  if (!isFirebaseConfigured) {
    warnFallback();
    return byId([...maleCandidates, ...femaleCandidates]);
  }
  const snap = await getDocs(collection(getDb(), COLLECTIONS.candidates));
  return byId(snap.docs.map((d) => d.data() as Candidate));
});

/**
 * The matching pool for a client: the opposite-gender candidates.
 * Pass the *client's* gender.
 */
export const getCandidatePoolFor = cache(
  async (gender: Gender): Promise<Candidate[]> => {
    const opposite: Gender = gender === "Male" ? "Female" : "Male";
    if (!isFirebaseConfigured) {
      warnFallback();
      return byId(gender === "Male" ? femaleCandidates : maleCandidates);
    }
    const q = query(
      collection(getDb(), COLLECTIONS.candidates),
      where("gender", "==", opposite),
    );
    const snap = await getDocs(q);
    return byId(snap.docs.map((d) => d.data() as Candidate));
  },
);

/** Headline counts for status/overview surfaces. */
export const getStats = cache(async () => {
  // Reuses the cached reads above — no extra Firestore round-trips.
  const [allCustomers, allCandidates] = await Promise.all([
    getCustomers(),
    getAllCandidates(),
  ]);
  return {
    customers: allCustomers.length,
    totalCandidates: allCandidates.length,
    femaleCandidates: allCandidates.filter((c) => c.gender === "Female").length,
    maleCandidates: allCandidates.filter((c) => c.gender === "Male").length,
    source: isFirebaseConfigured ? ("firestore" as const) : ("memory" as const),
  };
});
