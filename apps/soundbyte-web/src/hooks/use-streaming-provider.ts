"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { env } from "@/lib/environment";

export default function useStreamingProvider({
  code,
  userId,
}: {
  code?: string;
  userId?: string;
}) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  console.log(`userId: ${userId}`);

  // React to change in `code` and `userId` to fetch users credentials
  useEffect(() => {
    if (!userId) return;

    axios
      .post(`${env.NEXT_PUBLIC_STREAMING_API}/login`, {
        code,
        provider: "spotify",
        userId,
      })
      .then((res) => {
        console.log(`res:`, res);
        setAccessToken(res.data.access_token);

        // Remove 'code' from URL search params after successful login
        // if (typeof window !== "undefined" && code) {
        //   const url = new URL(window.location.href);
        //   url.searchParams.delete("code");
        //   window.history.replaceState({}, document.title, url.toString());
        // }
      });
  }, [userId]);

  return accessToken;
}
