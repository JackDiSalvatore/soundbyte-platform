import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import Track from "./track";

type Props = {
  tracks?: SoundCloudTrack[] | null;
};

export default function Tracks({ tracks }: Props) {
  if (!tracks || tracks.length === 0) {
    return (
      <section className="max-w-3xl mx-auto mt-6">
        <div className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">No Tracks found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-5xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4">Tracks: </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(tracks ?? []).slice(0, 8).map((t: SoundCloudTrack) => (
          <article
            key={t.id ?? t.permalink_url}
            className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-4 shadow"
          >
            <Track key={t.id ?? t.uri} track={t} />
          </article>
        ))}

        {tracks && tracks.length > 8 && (
          <div className="text-xs text-primary mt-1">
            Show all {tracks.length} tracks (TODO)
          </div>
        )}
      </div>
    </section>
  );
}
