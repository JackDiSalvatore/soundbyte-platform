import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { account, session, user, verification } from "@/db/schema/auth-schema";
import { db } from "@/db/db";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/lib/environment";

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_OAUTH_SECRET,
    },
  },
  emailAndPassword: {
    enabled: false,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  plugins: [nextCookies()],
  trustedOrigins: [
    env.NEXT_PUBLIC_FRONTEND_BASE_URL,
    `${env.NEXT_PUBLIC_FRONTEND_BASE_URL}/api/auth/callback/google`,
  ],
});
