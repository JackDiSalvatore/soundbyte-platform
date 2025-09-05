"use client";

// import Footer from "@/components/footer";
import Header from "@/components/header";

import { Input } from "@/components/ui/input";
import SpotifyWebApi from "spotify-web-api-node";
import { useEffect, useState } from "react";
import { env } from "@/lib/environment";
import Player from "@/components/player";
import { useAuth } from "@/context/AuthProvider";
import SearchInput from "@/components/search-input";
import { SpotifySearchResult, SpotifyTrack } from "@/types/types";

const spotifyApi = new SpotifyWebApi({
  clientId: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, accessToken, isPending } = useAuth();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<SpotifySearchResult[]>([]);
  const [playingTrack, setPlayingTrack] = useState<SpotifyTrack | undefined>(
    undefined
  );

  // Set Access Token
  useEffect(() => {
    if (!accessToken) return;

    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  // Set Search
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;

    console.log(`using accessToken:`, accessToken);

    spotifyApi.searchTracks(search).then((res) => {
      console.log(res.body?.tracks?.items);

      if (cancel) return;

      if (res.body?.tracks?.items) {
        const searchRes = res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (
                typeof smallest.height === "undefined" ||
                (typeof image.height !== "undefined" &&
                  image.height < smallest.height)
              ) {
                return image;
              }

              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        });

        setSearchResults(searchRes);
      }
    });

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
