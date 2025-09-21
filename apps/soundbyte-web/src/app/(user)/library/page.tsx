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
import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";

export default function Page() {
  const { session, streamingCredentials, isPending } = useAuth();
  const userId = session?.user.id;

  const [profile, setProfile] = useState<SoundCloudProfile>();
  const [playlists, setPlaylists] = useState<SoundCloudPlaylistResponse | null>(
    null
  );
  const [tracks, setTracks] = useState<SoundCloudTrack[] | null>(null);
  const [likedTracks, setLikedTracks] = useState<SoundCloudTrack[] | null>(
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
      const data =
        res as SoundCloudPaginatedResponse<SoundCloudPlaylistResponse>;
      // console.log("Playlists:");
      // console.log(data);

      setPlaylists(data.collection);
    });

    // Get Tracks
    StreamingProviderOAuthClient.tracks({
      provider: "soundcloud",
      userId,
    }).then((res) => {
      const data = res as SoundCloudPaginatedResponse<SoundCloudTrack[]>;
      // console.log("Tracks:");
      // console.log(data);

      setTracks(data.collection);
    });

    // Get Liked Tracks
    StreamingProviderOAuthClient.likedTracks({
      provider: "soundcloud",
      userId,
    }).then((res) => {
      const data = res as SoundCloudPaginatedResponse<SoundCloudTrack[]>;
      // console.log("Liked Tracks:");
      // console.log(data);

      setLikedTracks(data.collection);
    });

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <main className="m-8">
      <Profile profile={profile} />

      <Tracks tracks={tracks ?? undefined} title="Tracks" />
      <Tracks tracks={likedTracks ?? undefined} title="Likes" />

      <Playlists playlists={playlists ?? undefined} />
    </main>
  );
}
