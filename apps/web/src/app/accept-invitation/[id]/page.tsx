import { headers } from "next/headers";
import { auth } from "@solar-sales/auth";

function SuccessPage() {
  return (
    <div>
      <h1>Invitation Accepted</h1>
      <p>You have successfully accepted the invitation.</p>
    </div>
  );
}

export default async function AcceptInvitationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const data = await auth.api.acceptInvitation({
    body: {
      invitationId: id,
    },
    headers: await headers(),
  });

  if (!data.invitation) {
    alert("Invitation not found");
    return null;
  }

  return <SuccessPage />;
}
