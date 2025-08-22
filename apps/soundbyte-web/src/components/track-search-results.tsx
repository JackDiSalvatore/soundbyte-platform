export default function TrackSearchResult({
  track,
  chooseTrack,
}: {
  track: { artist: string; title: string; uri: string; albumUrl: string };
  chooseTrack: (track: {
    artist: string;
    title: string;
    uri: string;
    albumUrl: string;
  }) => void;
}) {
  function handlePlay() {
    chooseTrack(track);
  }

  return (
    <div
      className="flex m-2 align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handlePlay}
    >
      <img
        src={track.albumUrl}
        alt={`${track.title} album cover`}
        style={{ width: 50, height: 50 }}
      />
      <div className="ml-2">
        <div>{track.title}</div>
        <div>{track.artist}</div>
      </div>
    </div>
  );
}
