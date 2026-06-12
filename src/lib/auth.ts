/**
 * Server-side auth helpers (use `next/headers`, so server-only).
 * Components read the current matchmaker through `getSession()`.
 */

import { cookies } from "next/headers";

import { DEMO_MATCHMAKER } from "@/config/matchmaker";
import { SESSION_COOKIE, isValidSession } from "@/lib/session";
import type { SafeMatchmaker } from "@/types";

// Build the password-free view once — UI/session code never needs the secret.
const SAFE_MATCHMAKER: SafeMatchmaker = {
  id: DEMO_MATCHMAKER.id,
  name: DEMO_MATCHMAKER.name,
  username: DEMO_MATCHMAKER.username,
  email: DEMO_MATCHMAKER.email,
  avatarSeed: DEMO_MATCHMAKER.avatarSeed,
};

/** The logged-in matchmaker (without password), or null if not authenticated. */
export async function getSession(): Promise<SafeMatchmaker | null> {
  const store = await cookies();
  const ok = await isValidSession(store.get(SESSION_COOKIE)?.value);
  return ok ? SAFE_MATCHMAKER : null;
}
