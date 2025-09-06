"use client";

import { Button } from "@/components/ui/button";
import useStreamingProvider from "@/hooks/use-streaming-provider";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/environment";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const spotifyClientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const spotifyRedirectUrl = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL!;

const soundcloudConfig = {
  clientId: process.env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID,
  redirectUrl: process.env.NEXT_PUBLIC_SOUNDCLOUD_REDIRECT_URL,
  codeChallenge: "QlWSrk2E-UzBkTySNXX6oFSIuk8qun-EfSqil-5ix0A", // PKCE
  state: "randomstatestring", // random string
};

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const userId = session?.user.id;

  const token = useStreamingProvider({ code, userId }); // TODO: maybe make this a direct call
  useEffect(() => {
    if (!token) return;

    setAccessToken(token);
  }, [token]);

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

  async function disconnectSpotify() {
    const res = await axios.post(`${env.NEXT_PUBLIC_STREAMING_API}/logout`, {
      provider: "spotify",
      userId: session?.user.id,
    });

    setAccessToken(undefined);
  }

  return (
    <main className="flex flex-col m-2">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      <div className="flex flex-col justify-between gap-2">
        {!accessToken && (
          <div>
            <Button className="w-1/2 bg-green-500 hover:bg-green-300 text-black py-2 px-4 rounded">
              <a href={spotifyAuthLink}>Connect Spotify</a>
            </Button>
          </div>
        )}
        {accessToken && (
          <Button
            className="w-1/2 bg-gray-500 text-green-500 hover:bg-gray-300 hover:text-black py-2 px-4 rounded"
            onClick={disconnectSpotify}
          >
            Disconnect Spotify
          </Button>
        )}

        <Button className="w-1/2 bg-amber-500 hover:bg-amber-300 text-black py-2 px-4 rounded">
          <a href={soundcloudAuthLink}>Connect SoundCloud</a>
        </Button>
      </div>
    </main>
  );
}
