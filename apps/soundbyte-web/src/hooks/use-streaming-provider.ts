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
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number>(0);

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
        setAccessToken(res.data.token.access_token);
        setRefreshToken(res.data.token.refresh_token);
        setExpiresIn(res.data.token.expires_in);

        // Remove 'code' from URL search params after successful login
        // if (typeof window !== "undefined" && code) {
        //   const url = new URL(window.location.href);
        //   url.searchParams.delete("code");
        //   window.history.replaceState({}, document.title, url.toString());
        // }
      });
  }, [code, userId]);

  // React to when a refresh token needs to be used
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;

    const refreshAccessToken = function () {
      axios
        .post(`${env.NEXT_PUBLIC_STREAMING_API}/refresh`, {
          refreshToken,
        })
        .then((res) => {
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);
        })
        .catch(() => {});
    };

    const interval = setInterval(refreshAccessToken, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  return accessToken;
}
