import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

export default function Player({
  accessToken,
  trackUri,
}: {
  accessToken: string;
  trackUri: string;
}) {
  const [play, setPlay] = useState(false);

  // Set play to `true` when `trackUri` changes
  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null;

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setPlay(false);
      }}
      play={play}
      uris={trackUri ? [trackUri] : []}
    />
  );
}
