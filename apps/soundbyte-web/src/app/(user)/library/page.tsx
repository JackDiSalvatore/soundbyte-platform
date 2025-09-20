"use client";

import { useAuth } from "@/context/AuthProvider";
import { StreamingProviderOAuthClient } from "@/lib/streaming-provider-oauth-client";
import { useEffect, useState } from "react";
import { SoundCloudProfile } from "@/types/soundcloud-profile";
import { SoundCloudPlaylistResponse } from "@/types/soundcloud-playlist";
import Profile from "@/components/profile";
import Playlists from "@/components/playlists";

export default function Page() {
  const { session, streamingCredentials, isPending } = useAuth();
  const userId = session?.user.id;

  const [profile, setProfile] = useState<SoundCloudProfile>();
  const [playlists, setPlaylists] = useState<SoundCloudPlaylistResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle OAuth return on component mount
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);

    // Get Profile
    StreamingProviderOAuthClient.profile({
      provider: "soundcloud",
      userId,
    }).then((res) => {
      const data: SoundCloudProfile = res;

      setProfile(data);
    });

    // Get Playlists
    StreamingProviderOAuthClient.playlists({
      provider: "soundcloud",
      userId,
    }).then((res) => {
      const data = res as SoundCloudPlaylistResponse;
      console.log("Playlists:");
      console.log(data);

      setPlaylists(data);
    });

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <main className="m-4">
      {profile ? (
        <Profile profile={profile} />
      ) : (
        <div className="max-w-3xl mx-auto p-6 text-sm text-muted-foreground">
          No profile found.
        </div>
      )}

      <Playlists playlists={playlists ?? undefined} />
    </main>
  );
}
