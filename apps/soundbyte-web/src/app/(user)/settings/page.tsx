"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { env } from "@/lib/environment";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import crypto from "crypto";

const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const spotifyRedirectUrl = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL!;

const soundcloudConfig = {
  clientId: process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID,
  redirectUrl: process.env.NEXT_PUBLIC_SOUNDCLOUD_REDIRECT_URL,
  codeChallenge: crypto.randomBytes(32).toString("base64url"), // PKCE https://example-app.com/pkce
  state: crypto.randomBytes(32).toString("base64url"), // csrf protection
};

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [isSoundCloudConnected, setIsSoundCloudConnected] = useState(false);

  const [currentProvider, setCurrentProvider] = useState<string | null>(null);

  const { session, streamingCredentials, isPending } = useAuth();
  const userId = session?.user.id;

  useEffect(() => {
    if (!streamingCredentials) return;

    console.log("Your exisitng credentials are:");
    console.log(JSON.stringify(streamingCredentials));

    for (let cred of streamingCredentials) {
      if (cred.provider === "spotify") setIsSpotifyConnected(true);
      if (cred.provider === "soundcloud") setIsSoundCloudConnected(true);
    }
  }, [streamingCredentials]);

  // React to change in `code` to fetch users credentials
  useEffect(() => {
    if (!userId) return;
    if (!code) return;

    const provider = currentProvider;

    console.log(`You are about to connect:`, provider);

    axios
      .post(`${env.NEXT_PUBLIC_STREAMING_API}/connect`, {
        userId,
        provider,
        code,
      })
      .then((res) => {
        console.log(`res.data:`, res.data);

        // Don't do this ??

        setCurrentProvider(null);
        if (provider === "spotify") setIsSpotifyConnected(true);
        if (provider === "soundcloud") setIsSoundCloudConnected(true);

        // Remove 'code' from URL search params after successful login
        // if (typeof window !== "undefined" && code) {
        //   const url = new URL(window.location.href);
        //   url.searchParams.delete("code");
        //   window.history.replaceState({}, document.title, url.toString());
        // }
      });
  }, [code]);

  const spotifyAuthLink =
    `https://accounts.spotify.com/authorize` +
    `?client_id=${spotifyClientId}` +
    `&response_type=code` +
    `&redirect_uri=${spotifyRedirectUrl}` +
    `&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

  const soundcloudAuthLink =
    `https://secure.soundcloud.com/authorize` +
    `?client_id=${soundcloudConfig.clientId}` +
    `&redirect_uri=${soundcloudConfig.redirectUrl}` +
    `&response_type=code` +
    `&code_challenge=${soundcloudConfig.codeChallenge}` +
    `&code_challenge_method=S256` +
    `&state=${soundcloudConfig.state}`; // CSRF Protection

  async function disconnectStreamingProvider(provider: string) {
    const res = await axios.post(`${env.NEXT_PUBLIC_STREAMING_API}/logout`, {
      provider: "spotify",
      userId: session?.user.id,
    });

    if (provider === "spotify") setIsSpotifyConnected(false);
    else if (provider === "soundcloud") setIsSoundCloudConnected(false);
  }

  return (
    <main className="flex flex-col m-2">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      <div className="flex flex-col justify-between gap-2">
        {!isSpotifyConnected && (
          <div>
            <Button
              className="w-1/2 bg-green-500 hover:bg-green-300 text-black py-2 px-4 rounded"
              onClick={() => setCurrentProvider("spotify")}
            >
              <a href={spotifyAuthLink}>Connect Spotify</a>
            </Button>
          </div>
        )}
        {isSpotifyConnected && (
          <Button
            className="w-1/2 bg-gray-500 text-green-500 hover:bg-gray-300 hover:text-black py-2 px-4 rounded"
            onClick={() => disconnectStreamingProvider("spotify")}
          >
            Disconnect Spotify
          </Button>
        )}

        {!isSoundCloudConnected && (
          <div>
            <Button
              className="w-1/2 bg-amber-500 hover:bg-amber-300 text-black py-2 px-4 rounded"
              onClick={() => setCurrentProvider("soundcloud")}
            >
              <a href={soundcloudAuthLink}>Connect SoundCloud</a>
            </Button>
          </div>
        )}
        {isSoundCloudConnected && (
          <Button
            className="w-1/2 bg-gray-500 text-green-500 hover:bg-gray-300 hover:text-black py-2 px-4 rounded"
            onClick={() => disconnectStreamingProvider("soundcloud")}
          >
            Disconnect SoundCloud
          </Button>
        )}
      </div>
    </main>
  );
}
