"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { SessionProvider, useSession } from "./session";

type Session = typeof authClient.$Infer.Session;

function SessionGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const result = await authClient.getSession();
        if (cancelled) return;

        if (result.error || !result.data?.user) {
          // Not authenticated, redirect to login
          router.replace("/login");
          return;
        }

        setSession(result.data);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span
          className="loading loading-spinner"
          aria-label="Loading session"
        />
      </div>
    );
  }

  if (!session) {
    // Redirect is in progress, render nothing to avoid flicker
    return null;
  }

  return <SessionProvider value={session}>{children}</SessionProvider>;
}

function DashboardContent() {
  const session = useSession();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-4">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="mb-4">Welcome {session.user?.name ?? "User"}</p>

      {/* Add your dashboard content/components here */}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SessionGate>
      <DashboardContent />
    </SessionGate>
  );
}
