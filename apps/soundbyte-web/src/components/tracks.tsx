import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import Track from "./track";

type Props = {
  tracks?: SoundCloudTrack[] | null;
  title?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
};

export default function Tracks({
  tracks,
  title,
  onLoadMore,
  hasMore,
  isLoading,
}: Props) {
  if (!tracks || tracks.length === 0) {
    return (
      <section className="max-w-7xl mx-auto mt-6">
        <div className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">No Tracks found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4">{title ?? "Tracks"}: </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {tracks.map((t: SoundCloudTrack) => (
          <Track key={t.id ?? t.uri} track={t} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}
