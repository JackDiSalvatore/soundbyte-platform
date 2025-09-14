"use client";

import React, { createContext, useContext } from "react";
import { authClient } from "@/lib/auth-client";
import useStreamingProvider from "@/hooks/use-streaming-provider";

type AuthContextType = {
  session: ReturnType<typeof authClient.useSession>["data"] | null;
  streamingCredentials: { provider: string; accessToken: string }[] | null;
  isPending: boolean;
  error: unknown;
  refetch: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending, error, refetch } = authClient.useSession();

  const userId = session?.user.id;
  const streamingCredentials = useStreamingProvider({ userId });

  return (
    <AuthContext.Provider
      value={{ session, streamingCredentials, isPending, error, refetch }}
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
