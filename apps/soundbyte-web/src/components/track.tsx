"use client";

import React from "react";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { usePlayer } from "@/context/PlayerProvider";

export default function Track({ track }: { track: SoundCloudTrack }) {
  const { playTrack } = usePlayer();

  function handlePlay() {
    playTrack(track);
  }

  return (
    <div
      className="flex items-center gap-3 p-2 rounded hover:bg-accent/20 cursor-pointer"
      onClick={handlePlay}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={track.artwork_url ?? "/file.svg"}
        alt={track.title}
        className="w-12 h-12 rounded-md object-cover"
      />

      <div className="min-w-0">
        <div className="text-sm font-medium truncate">{track.title}</div>
        <div className="text-xs text-muted-foreground truncate">
          {track.user?.username ?? track.user?.full_name}
        </div>
      </div>

      <div className="ml-auto text-xs text-muted-foreground">
        {Math.ceil((track.duration ?? 0) / 1000)}s
      </div>
    </div>
  );
}
