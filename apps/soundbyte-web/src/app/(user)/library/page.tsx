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

  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState<boolean>(false);
  const [isLoadingTracks, setIsLoadingTracks] = useState<boolean>(false);
  const [isLoadingLikes, setIsLoadingLikes] = useState<boolean>(false);

  // Fetch profile on mount or when userId changes
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    setIsLoadingProfile(true);

    (async () => {
      try {
        const res = await StreamingProviderOAuthClient.profile({
          provider: "soundcloud",
          userId,
        });

        if (!mounted) return;
        setProfile(res as SoundCloudProfile);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        if (mounted) setIsLoadingProfile(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Fetch playlists when userId, playlistsPage or playlistsLimit change
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    setIsLoadingPlaylists(true);

    (async () => {
      try {
        const res = await StreamingProviderOAuthClient.playlists({
          provider: "soundcloud",
          userId,
        });

        if (!mounted) return;
        const data =
          res as SoundCloudPaginatedResponse<SoundCloudPlaylistResponse>;
        setPlaylists(data.collection);
      } catch (err) {
        console.error("Failed to load playlists:", err);
      } finally {
        if (mounted) setIsLoadingPlaylists(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Fetch tracks when userId, tracksPage or tracksLimit change
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    setIsLoadingTracks(true);

    (async () => {
      try {
        const res = await StreamingProviderOAuthClient.tracks({
          provider: "soundcloud",
          userId,
        });

        if (!mounted) return;
        const data = res as SoundCloudPaginatedResponse<SoundCloudTrack[]>;
        setTracks(data.collection);
      } catch (err) {
        console.error("Failed to load tracks:", err);
      } finally {
        if (mounted) setIsLoadingTracks(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // Fetch liked tracks when userId, likedTracksPage or likedTracksLimit change
  useEffect(() => {
    if (!userId) return;
    let mounted = true;
    setIsLoadingLikes(true);

    (async () => {
      try {
        const res = await StreamingProviderOAuthClient.likedTracks({
          provider: "soundcloud",
          userId,
        });

        if (!mounted) return;
        const data = res as SoundCloudPaginatedResponse<SoundCloudTrack[]>;
        setLikedTracks(data.collection);
      } catch (err) {
        console.error("Failed to load liked tracks:", err);
      } finally {
        if (mounted) setIsLoadingLikes(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const anyLoading =
    isLoadingProfile || isLoadingPlaylists || isLoadingTracks || isLoadingLikes;
  if (anyLoading) {
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
