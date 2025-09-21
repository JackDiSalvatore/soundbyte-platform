"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";

import { useEffect, useState } from "react";
// import Player from "@/components/player";
import { useAuth } from "@/context/AuthProvider";
import SearchInput from "@/components/search-input";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, streamingCredentials, isPending } = useAuth();

  // const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(
  //   null
  // );
  const [soundCloudAccessToken, setSoundCloudAccessToken] = useState<
    string | null
  >(null);

  const [search, setSearch] = useState("");
  const [playingTrack, setPlayingTrack] = useState<SoundCloudTrack | undefined>(
    undefined
  );

  useEffect(() => {
    if (!streamingCredentials) return;

    console.log("Your exisitng credentials are:");
    console.log(JSON.stringify(streamingCredentials));

    setSoundCloudAccessToken(streamingCredentials.accessToken);
  }, [streamingCredentials]);

  // Set Search Results
  const {
    data: searchResults,
    nextHref: searchNext,
    isLoading: isLoadingSearch,
    fetchPage: fetchSearch,
  } = usePaginatedFetch<SoundCloudTrack>(
    (opts): Promise<SoundCloudPaginatedResponse<SoundCloudTrack[]>> =>
      StreamingProviderClient.searchTracks({
        provider: "soundcloud",
        userId: session?.user.id ?? "",
        searchTerm: search,
        limit: 25,
        nextHref: opts?.next ? searchNext : undefined,
      }),
    [search]
  );

  // Handle playTrack changes
  useEffect(() => {
    if (!playingTrack) return;

    // No playing
  }, [playingTrack]);

  // Handle Search Songs Input Event
  const searchSongs = (value: string) => {
    setSearch(value);
  };

  function chooseTrack(track: SoundCloudTrack): void {
    setPlayingTrack(track);
    setSearch("");
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    // parent is relative so fixed overlays are positioned relative to viewport as expected
    <div className="relative min-h-screen">
      {/* Fixed header overlay */}
      <Header className="fixed inset-x-0 top-0 z-50 flex items-baseline justify-between border-b-2 p-2 bg-background/90 backdrop-blur">
        <SearchInput
          searchSongs={searchSongs}
          searchResults={searchResults}
          chooseTrack={chooseTrack}
        />
      </Header>

      {/* Content area with top + bottom padding equal to header/footer heights to avoid overlap */}
      <main className="pt-[64px] pb-[64px]">{children}</main>

      {/* Fixed footer overlay */}
      <Footer className="fixed inset-x-0 bottom-0 z-50 flex items-baseline justify-between border-t-2 p-2 bg-background/90 backdrop-blur" />

      {/* <Player
        className="fixed inset-x-0 bottom-0 z-50 flex items-baseline justify-between py-2"
        accessToken={spotifyAccessToken ?? ""}
        trackUri={playingTrack?.uri ?? ""}
      /> */}
    </div>
  );
}
