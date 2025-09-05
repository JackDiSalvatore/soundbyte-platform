"use client";

import { Button } from "@/components/ui/button";
import useStreamingProvider from "@/hooks/use-streaming-provider";
import { authClient } from "@/lib/auth-client";
import { env } from "@/lib/environment";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL!;

export default function Page() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") ?? "";

  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  async function disconnectSpotify() {
    const res = await axios.post(`${env.NEXT_PUBLIC_STREAMING_API}/logout`, {
      provider: "spotify",
      userId,
    });

    setAccessToken(undefined);
  }

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

  console.log("SPOTIFY_CLIENT_ID:", clientId);
  console.log("accessToken:", accessToken);

  const authLink = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

  return (
    <main className="flex flex-col m-2">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      <div className="flex flex-col justify-between gap-2">
        {!accessToken && (
          <div>
            <Button className="w-1/2 bg-green-500 hover:bg-green-300 text-black py-2 px-4 rounded">
              <a href={authLink}>Connect Spotify</a>
            </Button>
          </div>
        )}
        {accessToken && (
          <Button
            className="w-1/2 bg-gray-500 hover:bg-gray-300 text-green-500 py-2 px-4 rounded"
            onClick={disconnectSpotify}
          >
            Disconnect Spotify
          </Button>
        )}

        {/* <Button className="w-1/2 bg-amber-500 hover:bg-amber-300 text-black py-2 px-4 rounded">
          Connect SoundCloud (coming soon...)
        </Button> */}
      </div>
    </main>
  );
}
