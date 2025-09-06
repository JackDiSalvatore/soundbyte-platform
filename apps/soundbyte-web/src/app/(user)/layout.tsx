"use client";

// import Footer from "@/components/footer";
import Header from "@/components/header";

import { useEffect, useState } from "react";
import { env } from "@/lib/environment";
import Player from "@/components/player";
import { useAuth } from "@/context/AuthProvider";
import SearchInput from "@/components/search-input";
import { SpotifySearchResult, SpotifyTrack } from "@/types/types";
import { createStreamingProvider } from "@soundbyte/streaming-provider";

const streamingProviderConfig = {
  providers: new Map(),
};

streamingProviderConfig.providers.set("spotify", {
  clientId: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
  redirectUri: env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URL,
  clientSecret: env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
});

// streamingProviderConfig.providers.set("soundcloud", {
//   clientId: env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_ID,
//   redirectUri: env.NEXT_PUBLIC_SOUNDCLOUD_REDIRECT_URL,
//   clientSecret: env.NEXT_PUBLIC_SOUNDCLOUD_CLIENT_SECRET,
// });

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, accessToken, isPending } = useAuth();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifySearchResult[]>([]);
  const [playingTrack, setPlayingTrack] = useState<SpotifyTrack | undefined>(
    undefined
  );

  const streamingProvider = createStreamingProvider(streamingProviderConfig);

  // Set Search
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;
    if (!streamingProvider) return;

    let cancel = false;

    const fetchSearchResults = async () => {
      const credentials = new Map();
      credentials.set("spotify", accessToken);
      credentials.set("soundcloud", "TODO");

      const searchRes: SpotifySearchResult[] = (await streamingProvider.search({
        credentials,
        query: { searchTerm: search },
      })) as any; // TODO: typing

      if (!cancel) {
        setSearchResults(searchRes);
      }
    };

    fetchSearchResults();

    return () => {
      cancel = true;
    };
  }, [search, accessToken]);

  // Handle playTrack changes
  useEffect(() => {
    if (!playingTrack) return;

    // No playing
  }, [playingTrack]);

  // Handle Search Songs Input Event
  const searchSongs = (value: string) => {
    setSearch(value);
  };

  function chooseTrack(track: {
    artist: string;
    title: string;
    uri: string;
    albumUrl: string;
  }): void {
    setPlayingTrack(track);
    setSearch("");
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!accessToken) {
    return (
      <div>
        <Header className="sticky top-0 z-50 flex items-baseline justify-between border-b-2 p-2" />
        Please connect a streaming provider in the Settings page.
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header className="sticky top-0 z-50 flex items-baseline justify-between border-b-2 p-2">
        <SearchInput
          searchSongs={searchSongs}
          searchResults={searchResults}
          chooseTrack={chooseTrack}
        />
      </Header>

      <main className="flex-1">{children}</main>

      {/* <Footer className="sticky bottom-0 z-50 flex items-baseline justify-between border-t-2 p-2" /> */}
      <Player
        className="sticky bottom-0 z-50 flex items-baseline justify-between py-2"
        accessToken={accessToken ?? ""}
        trackUri={playingTrack?.uri ?? ""}
      />
    </div>
  );
}
