import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/environment";

export const authClient = createAuthClient({
  /** The base URL of your auth server (optional if you're using the same domain) */
  baseURL: env.BETTER_AUTH_URL,
  // fetch: (url, options) =>
  //   fetch(url, {
  //     ...options,
  //     credentials: "include", // 👈 critical fix
  //   })
});

// export const { signIn, signOut, signUp, useSession } = authClient;
