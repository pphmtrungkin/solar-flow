import prisma from "@solar-sales/db";
import { env } from "@solar-sales/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, organization, admin } from "better-auth/plugins";
import { ac, admin as adminRole, owner, member } from "./permissions";
import { OrgInvitationEmail } from "./templates/OrgInvitation";
import { render } from "@react-email/render";
import React from "react";
import { sendEmail } from "./email";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  schema: {
    session: {
      fields: {
        activeOrganizationId: {
          type: "string",
          required: false,
          defaultValue: () => undefined,
        },
      },
    },
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    database: {
      generateId: "uuid",
    },
  },
  plugins: [
    openAPI(),
    admin(),
    organization({
      allowUserToCreateOrganization: async (user) => {
        if (!user?.role) return false;
        return user.role === "admin";
      },
      async sendInvitationEmail(data) {
        const inviteUrl = `${env.CORS_ORIGIN}/accept-invitation/${data.id}`;
        console.log(data.id);
        const html = await render(
          React.createElement(OrgInvitationEmail, {
            teamName: data.organization.name,
            invitedByUsername: data.inviter.user.name,
            invitedByEmail: data.inviter.user.email,
            inviteLink: inviteUrl,
          }),
        );
        await sendEmail(
          data.email,
          "Invitation to join organization",
          html,
          `"${data.organization.name}" <${env.GMAIL_USER}>`,
        );
      },
      requireEmailVerificationOnInvitation: true,
      creatorRole: "admin",
      teams: {
        enabled: false,
      },
      organizationLimit: 5,
      accessControl: ac,
      roles: {
        adminRole,
        owner,
        member,
      },
    }),
  ],
});
