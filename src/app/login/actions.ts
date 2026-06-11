"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DEMO_MATCHMAKER } from "@/config/matchmaker";
import {
  SESSION_COOKIE,
  signSession,
  sessionCookieOptions,
} from "@/lib/session";

export interface LoginState {
  error?: string;
}

/**
 * Validate credentials against the demo matchmaker and start a session.
 * Wired to the login form via `useActionState`.
 */
export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const ok =
    username === DEMO_MATCHMAKER.username &&
    password === DEMO_MATCHMAKER.password;

  if (!ok) {
    return { error: "Invalid username or password." };
  }

  const store = await cookies();
  const token = await signSession({
    id: DEMO_MATCHMAKER.id,
    username: DEMO_MATCHMAKER.username,
  });
  store.set(SESSION_COOKIE, token, sessionCookieOptions);

  // redirect() throws, so nothing runs after it on success.
  redirect("/dashboard");
}

/** Clear the session and return to the login screen. */
export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}
