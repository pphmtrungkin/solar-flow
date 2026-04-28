"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@solar-sales/auth";

/**
 * Root page: acts purely as a router based on authentication and organization state.
 *
 * Routing logic:
 * - No session / not authenticated     -> /login
 * - Authenticated, no active org      -> /select-org
 * - Authenticated, has active org     -> /dashboard
 *
 * No UI is rendered here; the user is always redirected.
 */
export default async function Page() {
  const hdrs = await headers();

  // Get server-side session from Better Auth.
  // Assumes shape: { user, session } | null
  const session = await auth.api.getSession({ headers: hdrs });

  // Not authenticated -> login
  if (!session?.user) {
    redirect("/auth/login");
  }

  const activeOrgId = session.session?.activeOrganizationId;

  if (session?.user?.role === "admin") {
    redirect("/admin");
  }

  // Authenticated but no active organization -> org selection/info
  if (!activeOrgId) {
    const noOrgPath = "/no-org" as string;
    redirect(noOrgPath as any);
  }

  // Authenticated and has active organization -> dashboard
  redirect("/dashboard");
}
