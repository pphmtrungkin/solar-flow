import prisma from "@solar-sales/db";
import { env } from "@solar-sales/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, organization } from "better-auth/plugins";
import { ac, admin, owner, member } from "./permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
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
    organization({
      allowUserToCreateOrganization: false,
      creatorRole: "admin",
      teams: {
        enabled: false,
      },
      accessControl: ac,
      roles: {
        admin,
        owner,
        member,
      },
    }),
  ],
});
