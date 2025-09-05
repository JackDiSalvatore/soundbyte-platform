"use client";

// import { z } from "zod";

import React, { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";
import useStreamingProvider from "@/hooks/use-streaming-provider";

// export const SoundByteUserSession = z.object({
//   id: z.string(),
//   name: z.string(),
//   email: z.string(),
//   email_verified: z.boolean(),
//   image: z.string(),
//   // `session_token` is saved in cookies
// });
// export type SoundByteUserSession = z.infer<typeof SoundByteUserSession>;

// export const StreamingProviderCredentials = z.object({
//   user_id: z.string(),
//   provider: z.string(),
//   access_token: z.string(),
// });
// export type StreamingProviderCredentials = z.infer<
//   typeof StreamingProviderCredentials
// >;

type AuthContextType = {
  session: ReturnType<typeof authClient.useSession>["data"] | null;
  accessToken: string | null;
  isPending: boolean;
  error: unknown;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: {children: React.ReactNode }) {
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  const userId = session?.user.id;
  const accessToken = useStreamingProvider({code: "", userId});

  return (
    <AuthContext.Provider
      value={{ session, accessToken, isPending, error, refetch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}
