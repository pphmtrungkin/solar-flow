import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@solar-sales/auth";
import { AcceptButton } from "./accept-button";

export default async function AcceptInvitationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id: invitationId } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};

  // Check session first.
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(`/auth/login?invitationId=${invitationId}` as any);
  }

  // Fetch invitation details.
  let invitation;
  try {
    invitation = await auth.api.getInvitation({
      query: { id: invitationId },
      headers: await headers(),
    });
  } catch (error: any) {
    if (error.message?.includes("not the recipient")) {
      return (
        <div className="mx-auto my-auto w-full max-w-md p-6">
          <h1 className="text-2xl font-bold mb-2">Wrong Account</h1>
          <p className="opacity-70">
            You are currently logged in as <strong>{session.user.email}</strong>
            , but this invitation was sent to a different email address.
          </p>
          <p className="opacity-70 mt-2">
            Please log out and use the link again with the correct account.
          </p>
          <div className="mt-6 flex gap-4">
            <a className="btn btn-primary" href="/dashboard">
              Go to Dashboard
            </a>
            <a className="btn btn-outline" href="/auth/login">
              Switch Account
            </a>
          </div>
        </div>
      );
    }
    throw error;
  }

  if (!invitation) {
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

  return (
    <div className="mx-auto my-auto w-full max-w-md p-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Join Organization</h2>
          <p className="mt-2">
            You have been invited to join{" "}
            <strong>{invitation.organizationName}</strong> as a{" "}
            <strong>{invitation.role}</strong>.
          </p>
          <div className="card-actions justify-end mt-6">
            <AcceptButton invitationId={invitationId} />
          </div>
        </div>
      </div>
    </div>
  );
}
