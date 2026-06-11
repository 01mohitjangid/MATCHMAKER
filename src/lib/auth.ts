/**
 * Server-side auth helpers (use `next/headers`, so server-only).
 * Components read the current matchmaker through `getSession()`.
 */

import { cookies } from "next/headers";

import { DEMO_MATCHMAKER } from "@/config/matchmaker";
import { SESSION_COOKIE, isValidSession } from "@/lib/session";
import type { SafeMatchmaker } from "@/types";

// Strip the password once — UI/session code never needs it.
const { password: _password, ...SAFE_MATCHMAKER } = DEMO_MATCHMAKER;

/** The logged-in matchmaker (without password), or null if not authenticated. */
export async function getSession(): Promise<SafeMatchmaker | null> {
  const store = await cookies();
  const ok = await isValidSession(store.get(SESSION_COOKIE)?.value);
  return ok ? SAFE_MATCHMAKER : null;
}
