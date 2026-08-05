"use server";

import { auth } from "@solar-sales/auth";
import prisma from "@solar-sales/db";
import { headers } from "next/headers";

/**
 * Server Action for Global Admins to invite members to any organization.
 * This bypasses the organization-level membership check because it uses the server API.
 */
export async function adminInviteMemberAction({
  email,
  organizationId,
  role,
}: {
  email: string;
  organizationId: string;
  role: string;
}) {
  const hdrs = await headers();
  const session = await auth.api.getSession({
    headers: hdrs,
  });

  // 1. Verify the user is a GLOBAL admin
  if (session?.user.role !== "admin") {
    throw new Error(
      "Unauthorized: Only global admins can perform this action.",
    );
  }

  // 2. Require an owner to exist before adding non-owner roles
  if (role !== "owner") {
    const owner = await prisma.members.findFirst({
      where: { organizationId, role: "owner" },
    });
    if (!owner) {
      return {
        error: {
          message:
            "An owner account must be added before adding admins or members.",
        },
      };
    }
  }

  // 3. Use the server API to create the invitation
  // This works even if the global admin is not a member of the target organization
  const result = await auth.api.createInvitation({
    body: {
      email,
      organizationId,
      role: role as any,
      resend: true,
    },
    headers: hdrs,
  });

  return result;
}
