"use server";

import { headers } from "next/headers";
import { auth } from "@solar-sales/auth";

export default async function DashboardPage() {
  const hdrs = await headers();

  // Get server-side session from Better Auth
  // Assumes the shape is `{ user, session } | null`
  const session = await auth.api.getSession({ headers: hdrs });

  console.log(session);

  // At this point, user is authenticated AND has an active org
  const userName = session?.user.name ?? "User";
  const activeOrgId = session?.session.activeOrganizationId;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-4">
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
              This dashboard is protected by server-side authentication and
              organization checks. Only users with an active organization can
              view this page.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
