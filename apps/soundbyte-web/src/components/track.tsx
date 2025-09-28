"use client";

import React from "react";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { usePlayer } from "@/context/PlayerProvider";
import { Play, Pause, Heart, Repeat, MessageSquareText } from "lucide-react";
import Link from "next/link";

export default function Track({ track }: { track: SoundCloudTrack }) {
  const { playTrack, playingTrack, isPlaying, setPlaybackState } = usePlayer();

  const isCurrentlyPlaying = playingTrack?.id === track.id;
  const showPlayingState = isCurrentlyPlaying && isPlaying;

  function handlePlay() {
    if (isCurrentlyPlaying) {
      // If this track is already loaded, just toggle play/pause
      setPlaybackState(!isPlaying);
    } else {
      // If this is a different track, load it
      playTrack(track);
    }
  }

  return (
    <article className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-2 shadow hover:shadow-lg transition-shadow overflow-hidden group">
      {/* Artwork with Play Overlay */}
      <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={
            track.artwork_url?.replace("-large", "-t200x200") ??
            track.user.avatar_url?.replace("-large", "-t200x200") ??
            "/file.svg"
          }
          alt={track.title}
          className="w-full h-full rounded-xl object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
          onClick={handlePlay}
        />

        {/* Play/Pause Overlay */}
        <div
          className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
          onClick={handlePlay}
        >
          <div className="bg-white/90 rounded-full p-3 transform transition-transform duration-200 hover:scale-110">
            {showPlayingState ? (
              <Pause className="w-6 h-6 text-gray-900" />
            ) : (
              <Play className="w-6 h-6 text-gray-900 ml-0.5" />
            )}
          </div>
        </div>

        {/* Playing Indicator */}
        {showPlayingState && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Playing
          </div>
        )}

        {/* Currently Selected Indicator (but paused) */}
        {isCurrentlyPlaying && !isPlaying && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Paused
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2">
        <div className="flex flex-col">
          {/* Title */}
          <Link
            className={`text-sm font-semibold truncate transition-colors ${
              showPlayingState
                ? "text-orange-600"
                : "text-gray-900 hover:text-orange-500"
            }`}
            href={`/tracks/${track.id}`}
          >
            {track.title}
          </Link>

          {/* Username */}
          <Link
            className="text-xs text-gray-600 truncate hover:text-gray-800 transition-colors"
            href={`/users/${track.user.id}`}
          >
            {track.user?.username ?? track.user?.full_name}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-2 flex flex-col gap-2 text-xs text-gray-700">
          {/* Reposts + Likes row */}
          <div className="flex justify-between">
            <div className="flex gap-1 items-center">
              <Repeat className="w-4 h-4 text-gray-400" />
              <span>{track.reposts_count?.toLocaleString("en-US")}</span>
            </div>

            <div className="flex gap-1 items-center">
              <Heart className="w-4 h-4" fill="#99a1af" strokeWidth={0} />
              <span>{track.favoritings_count?.toLocaleString("en-US")}</span>
            </div>
          </div>

          {/* Plays + Comments row */}
          <div className="flex justify-between">
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
          </div>
        </div>
      </div>
    </article>
  );
}
