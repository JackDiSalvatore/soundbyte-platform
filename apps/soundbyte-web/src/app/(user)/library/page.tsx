"use client";

import { useAuth } from "@/context/AuthProvider";
import { StreamingProviderOAuthClient } from "@/lib/streaming-provider-oauth-client";
import { useEffect, useState } from "react";
import { SoundCloudProfile } from "@/types/soundcloud-profile";
import {
  SoundCloudPlaylistResponse,
  SoundCloudTrack,
} from "@/types/soundcloud-playlist";
import Profile from "@/components/profile";
import Playlists from "@/components/playlists";
import Tracks from "@/components/tracks";

export default function Page() {
  const { session, streamingCredentials, isPending } = useAuth();
  const userId = session?.user.id;

  const [profile, setProfile] = useState<SoundCloudProfile>();
  const [playlists, setPlaylists] = useState<SoundCloudPlaylistResponse | null>(
    null
  );
  const [tracks, setTracks] = useState<SoundCloudTrack[] | null>(null);
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
      // console.log("Playlists:");
      // console.log(data);

      setPlaylists(data);
    });

    // Get Tracks
    StreamingProviderOAuthClient.tracks({
      provider: "soundcloud",
      userId,
    }).then((res) => {
      const data = res as SoundCloudTrack[];
      console.log("Tracks:");
      console.log(data);

      setTracks(data);
    });

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <main className="m-8">
      <Profile profile={profile} />

      <Tracks tracks={tracks ?? undefined} />

      <Playlists playlists={playlists ?? undefined} />
    </main>
  );
}
