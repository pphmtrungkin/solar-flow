import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@solar-sales/auth";

export default async function AcceptInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id: invitationId } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  // Where to come back after login/signup.
  const nextUrl = `/accept-invitation/${encodeURIComponent(invitationId)}`;

  // Check session first (do not mutate/accept until authenticated).
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const qs = new URLSearchParams();
    qs.set("next", nextUrl);

    // Optional: if you ever pass invited email in query (?email=...),
    // preserve it to prefill login/signup.
    const emailParam = resolvedSearchParams.email;
    const invitedEmail = Array.isArray(emailParam) ? emailParam[0] : emailParam;
    if (invitedEmail) qs.set("email", invitedEmail);

    redirect(`/auth/signup?${qs.toString()}`);
  }

  // User is authenticated: now attempt to accept the invitation.
  const result = await auth.api.acceptInvitation({
    body: { invitationId },
    headers: await headers(),
  });

  if (!result?.invitation) {
    return (
      <div className="mx-auto my-auto w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-2">Invitation not found</h1>
        <p className="opacity-70">
          This invitation link may be invalid, expired, or already accepted.
        </p>
        <div className="mt-4">
          <a className="link" href="/dashboard">
            Go to dashboard
          </a>
        </div>
      </div>
    );
  }

  // Success: send them somewhere useful.
  redirect("/dashboard");
}
