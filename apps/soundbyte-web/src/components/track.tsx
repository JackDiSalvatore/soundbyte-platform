"use client";

import React from "react";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { usePlayer } from "@/context/PlayerProvider";
import { Play, Heart, Repeat, MessageSquareText } from "lucide-react";

function formatTime(totalSeconds: number): string {
  if (!totalSeconds || isNaN(totalSeconds)) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function Track({ track }: { track: SoundCloudTrack }) {
  const { playTrack } = usePlayer();

  function handlePlay() {
    playTrack(track);
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-accent/20 cursor-pointer">
      {/* Artwork */}
      <img
        src={track.artwork_url ?? "/file.svg"}
        alt={track.title}
        className="w-12 h-12 rounded-md object-cover"
        onClick={handlePlay}
      />

      {/* Title + Artist */}
      <div className="min-w-0" onClick={handlePlay}>
        <div className="text-sm font-medium truncate">{track.title}</div>
        <div className="text-xs text-muted-foreground truncate">
          {track.user?.username ?? track.user?.full_name}
        </div>
      </div>

      {/* Stats container */}
      <div className="ml-auto flex flex-col items-end gap-2 text-xs text-muted-foreground">
        {/* Reposts + Likes row */}
        <div className="flex gap-4 items-center">
          {/* Reposts */}
          <div className="flex gap-1 items-center">
            <div>{track.reposts_count}</div>
            <button className="text-gray-400 hover:text-orange-500 transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Likes */}
          <div className="flex gap-1 items-center">
            <div>{track.favoritings_count?.toLocaleString("en-US")}</div>
            <button className="text-gray-400 hover:text-red-600 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Play & Comment count below */}
        <div className="ml-auto flex items-end gap-2 text-xs text-muted-foreground">
          <div className="flex gap-1 items-center">
            <Play className="w-4 h-4 text-gray-400" />
            <div>{track.playback_count?.toLocaleString("en-US")}</div>
          </div>

          <div className="flex gap-1 items-center">
            <MessageSquareText className="w-4 h-4 text-gray-400" />
            <div>{track.comment_count?.toLocaleString("en-US")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /* <div className="ml-auto text-xs text-muted-foreground">
  {formatTime(Math.ceil((track.duration ?? 0) / 1000))}
</div> */
}
