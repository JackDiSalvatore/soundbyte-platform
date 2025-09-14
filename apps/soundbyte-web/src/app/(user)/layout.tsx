"use client";

// import Footer from "@/components/footer";
import Header from "@/components/header";

import { useEffect, useState } from "react";
import { env } from "@/lib/environment";
import Player from "@/components/player";
import { useAuth } from "@/context/AuthProvider";
import SearchInput from "@/components/search-input";
import { SpotifySearchResult, SpotifyTrack } from "@/types/types";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, streamingCredentials, isPending } = useAuth();

  const [spotifyAccessToken, setSpotifyAccessToken] = useState<string | null>(
    null
  );
  const [soundCloudAccessToken, setSoundCloudAccessToken] = useState<
    string | null
  >(null);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifySearchResult[]>([]);
  const [playingTrack, setPlayingTrack] = useState<SpotifyTrack | undefined>(
    undefined
  );

  useEffect(() => {
    if (!streamingCredentials) return;

    console.log("Your exisitng credentials are:");
    console.log(JSON.stringify(streamingCredentials));

    for (let cred of streamingCredentials) {
      if (cred.provider === "spotify") setSpotifyAccessToken(cred.accessToken);
      if (cred.provider === "soundcloud")
        setSoundCloudAccessToken(cred.accessToken);
    }
  }, [streamingCredentials]);

  // Set Search
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!streamingCredentials) return;

    let cancel = false;

    const fetchSearchResults = async () => {
      const credentials = new Map();

      if (spotifyAccessToken) credentials.set("spotify", spotifyAccessToken);
      if (soundCloudAccessToken)
        credentials.set("soundcloud", soundCloudAccessToken);

      // TODO: make this a backend call!

      // const searchRes: SpotifySearchResult[] = (await streamingProvider.search({
      //   credentials,
      //   query: { searchTerm: search },
      // })) as any; // TODO: typing

      const searchRes: SpotifySearchResult[] = [];

      if (!cancel) {
        setSearchResults(searchRes);
      }
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

  if (!streamingCredentials) {
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
        accessToken={spotifyAccessToken ?? ""}
        trackUri={playingTrack?.uri ?? ""}
      />
    </div>
  );
}
