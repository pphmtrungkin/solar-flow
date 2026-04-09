"use client";

import { authClient } from "@/lib/auth-client";

// Extend Better Auth session type locally to include activeOrganizationId
interface ExtendedSession {
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
  session: {
    id: string;
    activeOrganizationId?: string | null;
  };
}

export default function Page() {
  const { data, error, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span
          className="loading loading-spinner"
          aria-label="Loading dashboard"
        />
      </div>
    );
  }

  if (error || !data) {
    // Optionally redirect to /login using useRouter, but for now render nothing
    return null;
  }

  const extended = data as ExtendedSession;
  const userName = extended.user.name ?? "User";
  const activeOrgId = extended.session.activeOrganizationId ?? "none";

  return (
    <div className="container mx-auto max-w-4xl px-4 py-4">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="mb-4">
        Welcome {userName} (Org: {activeOrgId})
      </p>

      {/* Your protected dashboard content here */}
      <section className="grid gap-4">
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h2 className="card-title">Overview</h2>
            <p className="text-sm text-base-content/70">
              This dashboard is protected by authentication and organization
              checks. Only users with an active organization should see this
              page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
