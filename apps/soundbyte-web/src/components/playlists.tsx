"use client";

import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SoundCloudPlaylist } from "@/types/soundcloud-playlist";
import Track from "@/components/track";

type Props = {
  playlists?: SoundCloudPlaylist[] | null;
  title?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
};

export default function Playlists({
  playlists,
  title,
  onLoadMore,
  hasMore,
  isLoading,
}: Props) {
  if (!playlists || playlists.length === 0) {
    return (
      <section className="max-w-7xl mx-auto mt-6">
        <div className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">No playlists found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto mt-6">
      <h3 className="text-lg font-semibold mb-4">{title ?? "Playlists"}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((pl) => (
          <article
            key={pl.id ?? pl.permalink_url}
            className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-4 shadow"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {/* Use Avatar primitive for cover artwork if available */}
                <Avatar className="size-16">
                  {pl.artwork_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <AvatarImage
                      alt={pl.title ?? "playlist"}
                      src={pl.artwork_url}
                    />
                  ) : (
                    <AvatarFallback>
                      {pl.title?.charAt(0) ?? "P"}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">
                      {pl.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {pl.description ?? "No description"}
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {pl.tracks?.length ?? 0} tracks
                  </div>
                </div>

                {/* Tracks list */}
                {/* <div className="mt-3 space-y-1">
                  {(pl.tracks ?? []).slice(0, 8).map((t) => (
                    <Track key={t.id ?? t.uri} track={t} />
                  ))}

                  {pl.tracks && pl.tracks.length > 8 && (
                    <div className="text-xs text-primary mt-1">
                      Show all {pl.tracks.length} tracks
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </article>
        ))}
      </div>
      {/* {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      )} */}
    </section>
  );
}
