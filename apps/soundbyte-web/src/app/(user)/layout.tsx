"use client";

// import Footer from "@/components/footer";
import Header from "@/components/header";

import useStreamingProvider from "@/hooks/use-streaming-provider";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import SpotifyWebApi from "spotify-web-api-node";
import { useEffect, useState } from "react";
import { env } from "@/lib/environment";
import TrackSearchResult from "@/components/track-search-results";
import Player from "@/components/player";

const spotifyApi = new SpotifyWebApi({
  clientId: env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const userId = session?.user.id;

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<
    { artist: string; title: string; uri: string; albumUrl: string }[]
  >([]);
  const [playingTrack, setPlayingTrack] = useState<{
    artist: string;
    title: string;
    uri: string;
    albumUrl: string;
  }>();
  const [lyrics, setLyrics] = useState("");

  const accessToken = useStreamingProvider({ code: "", userId });

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

    setLyrics("now playing...");
  }, [playingTrack]);

  // Handle Search Songs Input Event
  const searchSongs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? "";
    setSearch(value);
  };

  function chooseTrack(track: {
    artist: string;
    title: string;
    uri: string;
    albumUrl: string;
  }) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!accessToken) {
    return (
      <div>
        <Header
          user={session?.user ?? null}
          className="sticky top-0 z-50 flex items-baseline justify-between border-b-2 p-2"
        />
        Please connect a streaming provider in the Settings page.
        <div className="flex-1">{children}</div>
      </div>
    );
  } else if (userId !== undefined) {
    // Debug Log
    console.log("Welcome to the library page!");
    console.log(`You are: ${session?.user.name}`);
    console.log(`User Id: ${userId}`);
    console.log(`accessToken: ${accessToken}`);

    return (
      <div className="flex flex-col min-h-screen">
        <Header
          user={session?.user ?? null}
          className="sticky top-0 z-50 flex items-baseline justify-between border-b-2 p-2"
        />
        <Input
          className="w-1/2 m-auto my-2"
          onChange={searchSongs}
          placeholder="Search Songs/Artists"
        />

        <div className="flex-grow-1 my-2">
          Songs:
          {searchResults.map((track) => (
            <TrackSearchResult
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
            />
          ))}
          {searchResults.length === 0 && (
            <div className="text-center" style={{ whiteSpace: "pre" }}>
              {lyrics}
            </div>
          )}
        </div>

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
}
