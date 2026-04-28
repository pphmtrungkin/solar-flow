import prisma from "@solar-sales/db";
import { env } from "@solar-sales/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, organization, admin, emailOTP } from "better-auth/plugins";
import { ac, admin as adminRole, owner, member } from "./permissions";
import OrgInvitationEmail from "./templates/OrgInvitation";
import { render } from "@react-email/render";
import React from "react";
import { sendEmail } from "./email";
// Link-based verification template no longer needed when using OTP-only verification
import OTPVerify from "./templates/OTPVerify";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }) => {
      alert(`Someone tried to sign up with ${user.email}`);
    },
  },
  // OTP-only workflows are handled by the `emailOTP` plugin below.
  // We intentionally remove the default link-based verification sender.
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
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        const html = await render(
          React.createElement(OTPVerify, { email, otp, type }),
        );

        const subject =
          type === "forget-password"
            ? "Reset your password"
            : type === "email-verification"
              ? "Confirm your email"
              : "Sending OTP";
        await sendEmail(
          email,
          subject,
          html,
          `"SolarFlow" <${env.GMAIL_USER}>`,
        );
      },
    }),
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
