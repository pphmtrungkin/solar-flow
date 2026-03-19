import prisma from "@solar-sales/db";
import { env } from "@solar-sales/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, organization, admin } from "better-auth/plugins";
import { ac, admin as adminRole, owner, member } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
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
