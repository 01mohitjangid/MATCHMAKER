import { redirect } from "next/navigation";

import { AppHeader } from "@/components/app/AppHeader";
import { getSession } from "@/lib/auth";

/**
 * Shell for all authenticated pages. Guards the session (defense-in-depth on
 * top of middleware) and renders the shared header.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const matchmaker = await getSession();
  if (!matchmaker) redirect("/login");

  return (
    <div className="min-h-dvh bg-canvas">
      <AppHeader matchmaker={matchmaker} />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-8 sm:px-8">
        {children}
      </main>
    </div>
  );
}
