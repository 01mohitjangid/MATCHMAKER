
import { cookies } from "next/headers";

import { DEMO_MATCHMAKER } from "@/config/matchmaker";
import { SESSION_COOKIE, isValidSession } from "@/lib/session";
import type { SafeMatchmaker } from "@/types";

const SAFE_MATCHMAKER: SafeMatchmaker = {
  id: DEMO_MATCHMAKER.id,
  name: DEMO_MATCHMAKER.name,
  username: DEMO_MATCHMAKER.username,
  email: DEMO_MATCHMAKER.email,
  avatarSeed: DEMO_MATCHMAKER.avatarSeed,
};

export async function getSession(): Promise<SafeMatchmaker | null> {
  const store = await cookies();
  const ok = await isValidSession(store.get(SESSION_COOKIE)?.value);
  return ok ? SAFE_MATCHMAKER : null;
}
