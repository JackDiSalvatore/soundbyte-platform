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

export default function TrackDetails({ track }: { track: SoundCloudTrack }) {
  const { playTrack } = usePlayer();

  function handlePlay() {
    playTrack(track);
  }

  return (
    <article className="max-w-7xl mx-auto">
      {/* Artwork */}
      <div className="aspect-square bg-gray-100 rounded-xl">
        <img
          src={
            track.artwork_url?.replace("-large", "-t200x200") ??
            track.user.avatar_url?.replace("-large", "-t200x200") ??
            "/file.svg"
          }
          alt={track.title}
          className="w-full h-full rounded-xl object-cover"
          onClick={handlePlay}
        />
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2">
        {/* Title */}
        <div
          className="text-sm font-semibold text-gray-900 truncate"
          onClick={handlePlay}
        >
          {track.title}
        </div>

        {/* Username */}
        <div className="text-xs text-gray-600 truncate">
          {track.user?.username ?? track.user?.full_name}
        </div>

        {/* Stats */}
        <div className="mt-2 flex flex-col gap-2 text-xs text-gray-700">
          {/* Reposts + Likes row */}
          <div className="flex gap-1 items-center">
            <Repeat className="w-4 h-4 text-gray-400" />
            <span>{track.reposts_count}</span>
          </div>
          <div className="flex gap-1 items-center">
            <Heart className="w-4 h-4" fill="#99a1af" strokeWidth={0} />
            <span>{track.favoritings_count?.toLocaleString("en-US")}</span>
          </div>
          {/* Plays + Comments row */}
          <div className="flex gap-1 items-center">
            <Play
              className="w-4 h-4 text-gray-400"
              fill="#99a1af"
              strokeWidth={0}
            />
            <span>{track.playback_count?.toLocaleString("en-US")}</span>
          </div>
          <div className="flex gap-1 items-center">
            <MessageSquareText className="w-4 h-4 text-gray-400" />
            <span>{track.comment_count?.toLocaleString("en-US")}</span>
          </div>
          {/* Time */}
          <div className="flex gap-1 items-center">
            {formatTime(Math.ceil((track.duration ?? 0) / 1000))}
          </div>{" "}
        </div>
      </div>
    </article>
  );
}
