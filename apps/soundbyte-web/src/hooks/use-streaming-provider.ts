"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function useStreamingProvider({
  userId,
}: {
  userId?: string;
}): { provider: string; accessToken: string }[] | null {
  const [accessCred, setAccessCred] = useState<
    { provider: string; accessToken: string }[] | null
  >(null);

  console.log(`userId: ${userId}`);

  // React to change in `userId` to fetch users credentials
  useEffect(() => {
    if (!userId) return;

    // TODO: add this back in
    // axios
    //   .post(`${env.NEXT_PUBLIC_STREAMING_API}/get-access-token`, {
    //     userId,
    //     providers: ["spotify"],
    //   })
    //   .then((res) => {
    //     console.log(`res.data:`, res.data);
    //     const access: { provider: string; accessToken: string }[] = res.data;

    //     setAccessCred(access);
    //   });
  }, [userId]);

  return accessCred;
}
