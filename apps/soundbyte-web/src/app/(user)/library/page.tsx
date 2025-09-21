"use client";

import { useAuth } from "@/context/AuthProvider";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { SoundCloudProfile } from "@/types/soundcloud-profile";
import {
  SoundCloudPlaylist,
  SoundCloudTrack,
} from "@/types/soundcloud-playlist";
import Profile from "@/components/profile";
import Playlists from "@/components/playlists";
import Tracks from "@/components/tracks";
import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { useFetch } from "@/hooks/use-fetch";

export default function Page() {
  const { session } = useAuth();
  const userId = session?.user.id;
  if (!userId) return null;

  // Profile
  const { data: profile, isLoading: isLoadingProfile } = useFetch(
    (): Promise<SoundCloudProfile> =>
      StreamingProviderClient.profile({
        provider: "soundcloud",
        userId,
      }),
    [userId]
  );

  // Playlists
  const {
    data: playlists,
    nextHref: playlistsNext,
    isLoading: isLoadingPlaylists,
    fetchPage: fetchPlaylists,
  } = usePaginatedFetch<SoundCloudPlaylist>(
    (opts): Promise<SoundCloudPaginatedResponse<SoundCloudPlaylist[]>> =>
      StreamingProviderClient.playlists({
        provider: "soundcloud",
        userId,
        limit: 25,
        nextHref: opts?.next ? playlistsNext : undefined,
      }),
    [userId]
  );

  // User tracks
  const {
    data: tracks,
    nextHref: tracksNext,
    isLoading: isLoadingTracks,
    fetchPage: fetchTracks,
  } = usePaginatedFetch<SoundCloudTrack>(
    (opts): Promise<SoundCloudPaginatedResponse<SoundCloudTrack[]>> =>
      StreamingProviderClient.tracks({
        provider: "soundcloud",
        userId,
        limit: 10,
        nextHref: opts?.next ? tracksNext : undefined,
      }),
    [userId]
  );

  // Liked tracks
  const {
    data: likedTracks,
    nextHref: likedNext,
    isLoading: isLoadingLikes,
    fetchPage: fetchLikedTracks,
  } = usePaginatedFetch<SoundCloudTrack>(
    (opts): Promise<SoundCloudPaginatedResponse<SoundCloudTrack[]>> =>
      StreamingProviderClient.likedTracks({
        provider: "soundcloud",
        userId,
        limit: 25,
        nextHref: opts?.next ? likedNext : undefined,
      }),
    [userId]
  );

  return (
    <main className="m-8">
      <Profile profile={profile ?? undefined} />

      <Tracks
        tracks={tracks}
        title="Tracks"
        hasMore={!!tracksNext}
        isLoading={isLoadingTracks}
        onLoadMore={() => fetchTracks({ next: true })}
      />

      <Tracks
        tracks={likedTracks}
        title="Likes"
        hasMore={!!likedNext}
        isLoading={isLoadingLikes}
        onLoadMore={() => fetchLikedTracks({ next: true })}
      />

      <Playlists
        playlists={playlists}
        title="Playlists"
        hasMore={!!playlistsNext}
        isLoading={isLoadingPlaylists}
        onLoadMore={() => fetchPlaylists({ next: true })}
      />
    </main>
  );
}
