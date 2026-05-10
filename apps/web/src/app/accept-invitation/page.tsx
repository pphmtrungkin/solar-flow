"use client";

import { authClient } from "@/lib/auth-client";
import { AcceptButton } from "./accept-button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";

function AcceptInvitationContent() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const searchParams = useSearchParams();
  const invitationId = searchParams.get("id");
  const email = searchParams.get("email");

  // Handle redirects if not logged in
  useEffect(() => {
    if (!isSessionLoading && !session && invitationId) {
      const qs = new URLSearchParams();
      qs.set("invitationId", invitationId);
      if (email) qs.set("email", email);
      router.replace(`/auth/signup?${qs.toString()}` as any);
    }
  }, [session, isSessionLoading, invitationId, email, router]);

  if (isSessionLoading || !invitationId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // If not logged in, the useEffect will handle the redirect.
  // We only show the UI if there is a session.
  if (!session) return null;

  return (
    <div className="mx-auto my-auto w-full max-w-md p-6">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold">Join Organization</h2>
          <p className="mt-2">
            You have been invited to join an organization. Click the button
            below to accept the invitation and join the team.
          </p>
          <div className="card-actions justify-end mt-6">
            <AcceptButton invitationId={invitationId} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
