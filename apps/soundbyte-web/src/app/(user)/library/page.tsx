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

  // Profile
  const [profile, setProfile] = useState<SoundCloudProfile>();
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  const fetchProfile = async () => {
    if (!userId) return;
    setIsLoadingProfile(true);

    try {
      const res = await StreamingProviderOAuthClient.profile({
        provider: "soundcloud",
        userId,
      });

      setProfile(res as SoundCloudProfile);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Playlists
  const [playlists, setPlaylists] = useState<SoundCloudPlaylistResponse | null>(
    null
  );
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState<boolean>(false);
  const [playlistNextHref, setPlaylistNextHref] = useState<string | undefined>(
    undefined
  );

  const fetchPlaylists = async (options?: { next?: boolean }) => {
    if (!userId) return;
    setIsLoadingPlaylists(true);
    const limit = 25;

    try {
      const res = await StreamingProviderOAuthClient.playlists({
        provider: "soundcloud",
        userId,
        limit,
        nextHref: options?.next ? playlistNextHref : undefined,
      });

      const data =
        res as SoundCloudPaginatedResponse<SoundCloudPlaylistResponse>;
      setPlaylists(data.collection);

      setPlaylistNextHref(data.next_href);
    } catch (err) {
      console.error("Failed to load playlists:", err);
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  // User Tracks
  const [tracks, setTracks] = useState<SoundCloudTrack[] | null>(null);
  const [isLoadingTracks, setIsLoadingTracks] = useState<boolean>(false);
  const [tracksNextHref, setTracksNextHref] = useState<string | undefined>(
    undefined
  );

  const fetchTracks = async (options?: { next?: boolean }) => {
    if (!userId) return;
    setIsLoadingTracks(true);

    const limit = 10;

    try {
      const res = await StreamingProviderOAuthClient.tracks({
        provider: "soundcloud",
        userId,
        limit,
        nextHref: options?.next ? tracksNextHref : undefined,
      });

      const data = res as SoundCloudPaginatedResponse<SoundCloudTrack[]>;
      setTracks((prev) =>
        options?.next && prev ? [...prev, ...data.collection] : data.collection
      );
      setTracksNextHref(data.next_href);
    } catch (err) {
      console.error("Failed to load tracks:", err);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  // Liked Tracks
  const [likedTracks, setLikedTracks] = useState<SoundCloudTrack[] | null>(
    null
  );
  const [isLoadingLikes, setIsLoadingLikes] = useState<boolean>(false);
  const [likedTracksNextHref, setLikedTracksNextHref] = useState<
    string | undefined
  >(undefined);

  const fetchLikedTracks = async (options?: { next?: boolean }) => {
    if (!userId) return;
    setIsLoadingLikes(true);

    try {
      const limit = 25;

      const res = await StreamingProviderOAuthClient.likedTracks({
        provider: "soundcloud",
        userId,
        limit,
        nextHref: options?.next ? likedTracksNextHref : undefined,
      });

      const data = res as SoundCloudPaginatedResponse<SoundCloudTrack[]>;
      setLikedTracks(data.collection);
      setLikedTracksNextHref(data.next_href);
    } catch (err) {
      console.error("Failed to load liked tracks:", err);
    } finally {
      setIsLoadingLikes(false);
    }
  };

  // Fetch profile on mount or when userId changes
  useEffect(() => {
    if (!userId) return;

    fetchProfile();
  }, [userId]);

  // Fetch playlists
  useEffect(() => {
    if (!userId) return;

    fetchPlaylists();
  }, [userId]);

  // Fetch user tracks
  useEffect(() => {
    if (!userId) return;

    fetchTracks();
  }, [userId]);

  // Fetch liked tracks
  useEffect(() => {
    if (!userId) return;

    fetchLikedTracks();
  }, [userId]);

  const anyLoading =
    isLoadingProfile || isLoadingPlaylists || isLoadingTracks || isLoadingLikes;
  if (anyLoading) {
    return <>Loading...</>;
  }

  return (
    <main className="m-8">
      <Profile profile={profile} />

      <Tracks
        tracks={tracks}
        title="Tracks"
        hasMore={!!tracksNextHref}
        isLoading={isLoadingTracks}
        onLoadMore={() => fetchTracks({ next: true })}
      />

      <Tracks
        tracks={likedTracks}
        title="Likes"
        hasMore={!!likedTracksNextHref}
        isLoading={isLoadingLikes}
        onLoadMore={() => fetchLikedTracks({ next: true })}
      />

      <Playlists playlists={playlists ?? undefined} />
    </main>
  );
}
