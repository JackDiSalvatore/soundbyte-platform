"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";

import { useEffect, useState } from "react";
// import Player from "@/components/player";
import { useAuth } from "@/context/AuthProvider";
import SearchInput from "@/components/search-input";
import { StreamingProviderOAuthClient } from "@/lib/streaming-provider-oauth-client";
import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, streamingCredentials, isPending } = useAuth();

  // const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(
  //   null
  // );
  const [soundCloudAccessToken, setSoundCloudAccessToken] = useState<
    string | null
  >(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SoundCloudTrack[]>([]);
  const [playingTrack, setPlayingTrack] = useState<SoundCloudTrack | undefined>(
    undefined
  );

  const fetchSearchResults = async (options?: { next?: boolean }) => {
    if (!session) return;
    let cancel = false;

    try {
      const limit = 25;

      const res = await StreamingProviderOAuthClient.searchTracks({
        provider: "soundcloud",
        userId: session.user.id,
        limit,
        nextHref: undefined,
        searchTerm: search,
      });

      const data = res as SoundCloudPaginatedResponse<SoundCloudTrack[]>;
      // console.log("Search Result:");
      // console.log(data);

      if (!cancel) {
        setSearchResults(data.collection);
      }
    } catch (err) {
      console.error("Failed to search tracks:", err);
    } finally {
    }
  };

  useEffect(() => {
    if (!streamingCredentials) return;

    console.log("Your exisitng credentials are:");
    console.log(JSON.stringify(streamingCredentials));

    setSoundCloudAccessToken(streamingCredentials.accessToken);
  }, [streamingCredentials]);

  // Set Search
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!streamingCredentials) return;
    if (!session) return;

    let cancel = false;

    const fetchSearchResults = async () => {
      // TODO: call the backend
      StreamingProviderOAuthClient.searchTracks({
        provider: "soundcloud",
        userId: session.user.id,
        searchTerm: search,
      }).then((res) => {
        const data = res as SoundCloudPaginatedResponse<SoundCloudTrack[]>;
        // console.log("Search Result:");
        // console.log(data);

        if (!cancel) {
          setSearchResults(data.collection);
        }
      });
    };

    fetchSearchResults();

    return () => {
      cancel = true;
    };
  }, [search]);

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
