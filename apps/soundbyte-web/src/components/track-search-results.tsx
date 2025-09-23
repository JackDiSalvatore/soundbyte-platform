import { usePlayer } from "@/context/PlayerContext";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";

export default function TrackSearchResult({
  track,
}: {
  track: SoundCloudTrack;
}) {
  const { playTrack } = usePlayer();

  function handlePlay() {
    playTrack(track);
  }

  return (
    <div
      className="flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img
        src={track.artwork_url ?? "/file.svg"}
        alt={`${track.title} album cover`}
        style={{ width: 50, height: 50 }}
      />
      <div className="ml-2">
        <div>{track.title}</div>
        <div>{track.user.username}</div>
      </div>
    </div>
  );
}
