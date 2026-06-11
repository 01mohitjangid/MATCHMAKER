/**
 * Firebase initialisation (modular Web SDK v9+).
 *
 * Config comes from `NEXT_PUBLIC_FIREBASE_*` env vars (see `.env.example`).
 * These keys are safe to expose to the client — Firebase security is enforced
 * by Firestore rules, not by hiding the config.
 *
 * `isFirebaseConfigured` lets the data layer fall back to in-memory seed data
 * when no project is wired up yet, so the app still boots during local dev.
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True when the minimum required config is present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
);

/** Lazily create (or reuse) the Firebase app + Firestore handle. */
export function getDb(): Firestore {
  if (!isFirebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Set NEXT_PUBLIC_FIREBASE_* in .env.local.",
    );
  }
  // First call initialises Firestore with `ignoreUndefinedProperties` so
  // optional fields (e.g. preferences.minIncomeLPA) don't break writes.
  if (!getApps().length) {
    const app = initializeApp(firebaseConfig);
    return initializeFirestore(app, { ignoreUndefinedProperties: true });
  }
  return getFirestore(getApp());
}

/** Firestore collection names — single source of truth. */
export const COLLECTIONS = {
  candidates: "candidates",
  customers: "customers",
  notes: "notes",
  sentMatches: "sentMatches",
} as const;
