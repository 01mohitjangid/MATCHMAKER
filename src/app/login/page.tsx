"use client";

import { useActionState } from "react";

import { ArrowRight } from "@/components/ui/Icons";
import { DEMO_MATCHMAKER } from "@/config/matchmaker";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

/**
 * Matchmaker login screen. Credentials are validated by the `login` server
 * action, which sets the session cookie and redirects to the dashboard.
 *
 * The demo credentials are pre-filled so the app is easy to evaluate.
 */
export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-5 py-10">
      {/* soft brand glow behind the card */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-brand-soft to-transparent" />

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-xl font-bold text-white">
            ♥
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            TDC Matchmaker
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Sign in to your matchmaking workspace
          </p>
        </div>

        <form
          action={formAction}
          className="rounded-card border border-line bg-surface p-7 shadow-sm"
        >
          <label className="block text-sm font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            defaultValue={DEMO_MATCHMAKER.username}
            required
            className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand"
          />

          <label
            className="mt-4 block text-sm font-medium"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue={DEMO_MATCHMAKER.password}
            required
            className="mt-1.5 w-full rounded-xl border border-line-strong bg-surface px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand"
          />

          {state.error && (
            <p
              role="alert"
              className="mt-4 rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm text-danger"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill bg-brand py-3 font-medium text-white transition-colors hover:bg-brand-strong disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
            {!pending && <ArrowRight className="h-4 w-4" />}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-ink-faint">
          Demo credentials pre-filled —{" "}
          <span className="font-medium text-ink-soft">
            {DEMO_MATCHMAKER.username} / {DEMO_MATCHMAKER.password}
          </span>
        </p>
      </div>
    </main>
  );
}
