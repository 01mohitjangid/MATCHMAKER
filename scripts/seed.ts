/**
 * Seed Firestore with the generated demo dataset.
 *
 *   npm run seed
 *
 * Reads Firebase config from `.env.local`, then writes the 260-profile
 * candidate pool and the 12 assigned clients into Firestore. Safe to re-run —
 * documents are keyed by their stable ids, so a re-run overwrites in place.
 *
 * This uses the Firebase Web SDK (same config the app uses). For it to write,
 * your Firestore security rules must allow writes (test mode is fine for the
 * MVP). See README → "Database setup".
 */

import { config } from "dotenv";

// Load env BEFORE importing anything that reads process.env.
config({ path: ".env.local" });

async function main() {
  const { initializeApp } = await import("firebase/app");
  const { initializeFirestore, writeBatch, doc } = await import(
    "firebase/firestore"
  );

  // Imported dynamically so dotenv has already populated process.env.
  const { maleCandidates, femaleCandidates, customers } = await import(
    "@/data/seed"
  );
  const { COLLECTIONS } = await import("@/lib/firebase");

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error(
      "\n✗ Missing Firebase config. Create .env.local from .env.example and " +
        "fill in your NEXT_PUBLIC_FIREBASE_* values first.\n",
    );
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  // ignoreUndefinedProperties so optional fields (e.g. minIncomeLPA on male
  // clients) are simply omitted rather than throwing.
  const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

  const allCandidates = [...maleCandidates, ...femaleCandidates];
  console.log(
    `Seeding Firestore project "${firebaseConfig.projectId}":\n` +
      `  • ${allCandidates.length} candidates\n` +
      `  • ${customers.length} customers`,
  );

  // Firestore batches cap at 500 ops; we have ~272, so one batch is enough.
  const batch = writeBatch(db);
  for (const c of allCandidates) {
    batch.set(doc(db, COLLECTIONS.candidates, c.id), c);
  }
  for (const c of customers) {
    batch.set(doc(db, COLLECTIONS.customers, c.id), c);
  }

  await batch.commit();
  console.log("\n✓ Seed complete.\n");

  // The Web SDK keeps a connection open; exit explicitly.
  process.exit(0);
}

main().catch((err) => {
  console.error("\n✗ Seed failed:", err);
  process.exit(1);
});
