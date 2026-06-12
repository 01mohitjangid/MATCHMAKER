
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

function byId<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.id.localeCompare(b.id));
}

export const getCustomers = cache(async (): Promise<Customer[]> => {
  if (!isFirebaseConfigured) {
    warnFallback();
    return byId(seedCustomers);
  }
  const snap = await getDocs(collection(getDb(), COLLECTIONS.customers));
  return byId(snap.docs.map((d) => d.data() as Customer));
});

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

export const getAllCandidates = cache(async (): Promise<Candidate[]> => {
  if (!isFirebaseConfigured) {
    warnFallback();
    return byId([...maleCandidates, ...femaleCandidates]);
  }
  const snap = await getDocs(collection(getDb(), COLLECTIONS.candidates));
  return byId(snap.docs.map((d) => d.data() as Candidate));
});

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

export const getStats = cache(async () => {
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
