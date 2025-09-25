import { usePlayer } from "@/context/PlayerProvider";
import SoundCloudPlayer from "./soundcloud-player";

export default function PlayerOverlay({
  accessToken,
}: {
  accessToken: string | null;
}) {
  const { playingTrack, stop } = usePlayer();

  if (!playingTrack || !accessToken) return null;

  // Player event handlers
  const handlePlayerError = (error: string) => {
    console.error("SoundCloud Player Error:", error);
  };

  const handleTrackEnd = () => {
    console.log("Track ended");
    // Optionally auto-play next track or reset player
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-background/95 backdrop-blur border-t-2 p-2">
      <SoundCloudPlayer
        streamUrl={
          playingTrack.stream_url ||
          `https://api.soundcloud.com/tracks/${playingTrack.id}/stream`
        }
        accessToken={accessToken}
        trackId={playingTrack.id}
        trackUserId={playingTrack.user.id}
        trackTitle={playingTrack.title}
        artistName={playingTrack.user?.username || "Unknown Artist"}
        artworkUrl={playingTrack.artwork_url}
        soundcloudUrl={playingTrack.permalink_url}
        autoPlay={true} // always play on new mount
        onEnded={stop}
      />
    </div>
  );
}
