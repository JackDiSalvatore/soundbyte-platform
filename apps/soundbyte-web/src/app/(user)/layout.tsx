"use client";

import Header from "@/components/header";
import SoundCloudPlayer from "@/components/soundcloud-player"; // Import your SoundCloudPlayer component

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import SearchInput from "@/components/search-input";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { PlayerProvider, usePlayer } from "@/context/PlayerContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, streamingCredentials, isPending } = useAuth();

  const [soundCloudAccessToken, setSoundCloudAccessToken] = useState<
    string | null
  >(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!streamingCredentials) return;

    console.log("Your existing credentials are:");
    console.log(JSON.stringify(streamingCredentials));

    setSoundCloudAccessToken(streamingCredentials.accessToken);
  }, [streamingCredentials]);

  // Set Search Results
  const {
    data: searchResults,
    nextHref: searchNext,
    isLoading: isLoadingSearchResults,
    fetchPage: fetchSearch,
    reset: resetSearchResults,
  } = usePaginatedFetch<SoundCloudTrack>(
    (opts): Promise<SoundCloudPaginatedResponse<SoundCloudTrack[]>> => {
      // don't run empty search
      if (!search.trim()) {
        return Promise.resolve({
          collection: [],
          next_href: undefined,
        });
      }

      return StreamingProviderClient.searchTracks({
        provider: "soundcloud",
        userId: session?.user.id ?? "",
        searchTerm: search,
        limit: 25,
        nextHref: opts?.next ? searchNext : undefined,
      });
    },
    [search]
  );

  // Handle Search Songs Input Event
  const searchSongs = (value: string) => {
    console.log("searching for:", value);

    setSearch(value);
  };

  // Player event handlers
  const handlePlayerError = (error: string) => {
    console.error("SoundCloud Player Error:", error);
    // Optionally show user-friendly error message or reset playing track
  };

  const handleTrackEnd = () => {
    console.log("Track ended");
    // Optionally auto-play next track or reset player
  };

  function PlayerOverlay({ accessToken }: { accessToken: string | null }) {
    const { playingTrack, autoPlay, stop } = usePlayer();

    if (!playingTrack || !accessToken) return null;

    return (
      <div className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur border-t-2 p-4">
        <SoundCloudPlayer
          key={playingTrack.id}
          streamUrl={
            playingTrack.stream_url ||
            `https://api.soundcloud.com/tracks/${playingTrack.id}/stream`
          }
          accessToken={accessToken}
          trackTitle={playingTrack.title}
          artistName={playingTrack.user?.username || "Unknown Artist"}
          artworkUrl={playingTrack.artwork_url}
          soundcloudUrl={playingTrack.permalink_url}
          onError={handlePlayerError}
          onEnded={handleTrackEnd}
          onPlay={() => console.log(`Now playing: ${playingTrack.title}`)}
          onPause={() => console.log(`Paused: ${playingTrack.title}`)}
          onLoadStart={() => {}}
          onLoadEnd={() => {}}
          autoPlay={autoPlay}
        />
      </div>
    );
  }

  // Render page

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    // parent is relative so fixed overlays are positioned relative to viewport as expected
    <PlayerProvider>
      <div className="relative min-h-screen">
        {/* Header overlay */}
        <Header className="fixed inset-x-0 top-0 z-50 flex items-baseline justify-between border-b-2 p-2 bg-background/90 backdrop-blur">
          <SearchInput
            searchSongs={searchSongs}
            searchResults={searchResults}
          />
        </Header>

        {/* Content area with top + bottom padding equal to header/footer heights to avoid overlap */}
        <main className="pt-[64px] pb-[120px]">{children}</main>

        {/* Player/Footer overlay */}
        <PlayerOverlay accessToken={soundCloudAccessToken} />
      </div>
    </PlayerProvider>
  );
}
