import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env } from "@/env";
import { db } from "@/server/db";
import { admin, oAuthProxy } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  plugins: [
    admin(),
    oAuthProxy({
      productionURL: `${env.BETTER_AUTH_URL}`
    }),
    nextCookies()
  ],
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(db, {
    provider: "postgresql", // or "sqlite" or "mysql"
  }),
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Transform role from lowercase string to enum value
          if (user.role && typeof user.role === "string") {
            const roleUpper = user.role.toUpperCase();
            // Only transform if it's a valid enum value
            if (roleUpper === "USER" || roleUpper === "ADMIN") {
              return {
                data: {
                  ...user,
                  role: roleUpper,
                },
              };
            }
            // If invalid, remove role and let Prisma default handle it
            const { role, ...rest } = user;
            return { data: rest };
          }
          return { data: user };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GITHUB_CLIENT_SECRET,
      redirectURI: "http://localhost:3000/api/auth/callback/github",
    },
    google: {
      prompt: 'select_account',
      clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GOOGLE_CLIENT_SECRET,
      redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
    }
  },
});

export type Session = typeof auth.$Infer.Session;
