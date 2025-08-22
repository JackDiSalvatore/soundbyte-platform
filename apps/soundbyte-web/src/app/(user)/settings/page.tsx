"use client";

import { Button } from "@/components/ui/button";

export default function Page() {
  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL!;

  console.log(`SPOTIFY_CLIENT_ID: ${clientId}`);

  const authLink = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

  return (
    <main className="flex flex-col m-2">
      <h1 className="text-xl font-semibold mb-4">Settings</h1>

      <div className="flex flex-col justify-between gap-2">
        <Button className="w-1/2 bg-green-500 hover:bg-green-300 text-black py-2 px-4 rounded">
          <a href={authLink}>Connect Spotify</a>
        </Button>

        {/* <Button className="w-1/2 bg-amber-500 hover:bg-amber-300 text-black py-2 px-4 rounded">
          Connect SoundCloud (coming soon...)
        </Button> */}
      </div>
    </main>
  );
}
