"use client";

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

export default function Page() {
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
    return <div>Please connect a streaming provider in the Settings page.</div>;
  } else if (userId !== undefined) {
    // Debug Log
    console.log("Welcome to the library page!");
    console.log(`You are: ${session?.user.name}`);
    console.log(`User Id: ${userId}`);
    console.log(`accessToken: ${accessToken}`);

    return (
      <main className="flex flex-col m-2" style={{ height: "100vh" }}>
        <Input onChange={searchSongs} placeholder="Search Songs/Artists" />

        <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
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

        <Player
          accessToken={accessToken ?? ""}
          trackUri={playingTrack?.uri ?? ""}
        />
      </main>
    );
  }
}
