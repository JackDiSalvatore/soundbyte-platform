"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { env } from "@/lib/environment";

type CreateProviderCredentialsDto = {
  userId: string;
  provider: string; // ex: 'spotify', 'soundcloud'
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
};

export default function useStreamingProvider({
  userId,
}: {
  userId?: string;
}): { provider: string; accessToken: string } | null {
  const [accessCred, setAccessCred] = useState<{
    provider: string;
    accessToken: string;
  } | null>(null);

  console.log(`userId: ${userId}`);

  // React to change in `userId` to fetch users credentials
  useEffect(() => {
    if (!userId) return;

    const provider = "soundcloud";

    axios
      .get(
        `${env.NEXT_PUBLIC_STREAMING_API}/auth/${provider}/userId/${userId}/accessToken`
      )
      .then((res) => {
        console.log(`res:`, res);
        const data = res as unknown as CreateProviderCredentialsDto;

        const access = {
          provider,
          accessToken: data.accessToken,
        };

        setAccessCred(access);
      });
  }, [userId]);

  return accessCred;
}
