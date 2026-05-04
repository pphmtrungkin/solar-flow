"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AcceptButton({ invitationId }: { invitationId: string }) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAccept = async () => {
    setIsAccepting(true);
    setError(null);

    try {
      const { error: acceptError } = await authClient.organization.acceptInvitation({
        invitationId,
      });

      if (acceptError) {
        setError(acceptError.message || "Failed to accept invitation");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-2">
      {error && <p className="text-error text-sm">{error}</p>}
      <button
        className={`btn btn-primary w-full ${isAccepting ? "loading" : ""}`}
        onClick={handleAccept}
        disabled={isAccepting}
      >
        {isAccepting ? "Accepting..." : "Accept Invitation"}
      </button>
    </div>
  );
}
