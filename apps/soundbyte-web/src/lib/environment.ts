// import { z } from "zod";

// const Env = z.object({
//   NEXT_PUBLIC_FRONTEND_BASE_URL: z.string(),
//   DATABASE_URL: z.string(),
//   BETTER_AUTH_SECRET: z.string(),
//   BETTER_AUTH_URL: z.string(),
//   GOOGLE_OAUTH_CLIENT_ID: z.string(),
//   GOOGLE_OAUTH_SECRET: z.string(),
//   NEXT_PUBLIC_STREAMING_API: z.string(),
// });
// type Env = z.infer<typeof Env>;

export type Env = {
  NEXT_PUBLIC_FRONTEND_BASE_URL: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_OAUTH_CLIENT_ID: string;
  GOOGLE_OAUTH_SECRET: string;
  NEXT_PUBLIC_STREAMING_API: string;
};

export const env: Env = {
  NEXT_PUBLIC_FRONTEND_BASE_URL: process.env.NEXT_PUBLIC_FRONTEND_BASE_URL!,
  DATABASE_URL: process.env.DATABASE_URL!,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL!,
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
  GOOGLE_OAUTH_SECRET: process.env.GOOGLE_OAUTH_SECRET!,
  NEXT_PUBLIC_STREAMING_API: process.env.NEXT_PUBLIC_STREAMING_API!,
};
