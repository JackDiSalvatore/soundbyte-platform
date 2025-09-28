"use client";

import React from "react";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { usePlayer } from "@/context/PlayerProvider";
import {
  Play,
  Pause,
  Heart,
  MessageSquareText,
  Headphones,
  Repeat,
} from "lucide-react";
import Link from "next/link";

export default function Track({ track }: { track: SoundCloudTrack }) {
  const { playTrack, playingTrack, isPlaying, setPlaybackState } = usePlayer();

  const isCurrentlyPlaying = playingTrack?.id === track.id;
  const showPlayingState = isCurrentlyPlaying && isPlaying;

  function handlePlay() {
    if (isCurrentlyPlaying) {
      setPlaybackState(!isPlaying);
    } else {
      playTrack(track);
    }
  }

  const formatCount = (count: number | undefined): string => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toLocaleString();
  };

  return (
    <article className="group bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-gray-300/70 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Artwork Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={
              track.artwork_url?.replace("-large", "-t300x300") ??
              track.user.avatar_url?.replace("-large", "-t300x300") ??
              "/file.svg"
            }
            alt={track.title}
            className="w-full h-full object-cover cursor-pointer transition-all duration-700 group-hover:scale-110"
            onClick={handlePlay}
          />
        </div>

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Central Play Button */}
        <button
          onClick={handlePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 hover:bg-white hover:scale-105"
        >
          {showPlayingState ? (
            <Pause className="w-7 h-7 text-gray-900" />
          ) : (
            <Play className="w-7 h-7 text-gray-900 ml-1" />
          )}
        </button>

        {/* Top Stats Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Headphones className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium">
              {formatCount(track.playback_count)}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-red-500/90 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Heart className="w-3 h-3 text-white" fill="currentColor" />
            <span className="text-xs text-white font-medium">
              {formatCount(track.favoritings_count)}
            </span>
          </div>
        </div>

        {/* Bottom Stats Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Repeat className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium">
              {formatCount(track.reposts_count)}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-blue-500/90 backdrop-blur-sm rounded-full px-3 py-1.5">
            <MessageSquareText className="w-3 h-3 text-white" />
            <span className="text-xs text-white font-medium">
              {formatCount(track.comment_count)}
            </span>
          </div>
        </div>

        {/* Playing Status Indicator */}
        {showPlayingState && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg animate-pulse">
            ♪ Now Playing
          </div>
        )}

        {isCurrentlyPlaying && !isPlaying && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-500 text-white text-xs px-4 py-2 rounded-full font-semibold shadow-lg">
            ⏸ Paused
          </div>
        )}
      </div>

      {/* Content Below Image */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <Link
          href={`/tracks/${track.id}`}
          className={`block text-base font-semibold leading-tight transition-colors duration-200 ${
            showPlayingState
              ? "text-orange-600"
              : "text-gray-900 hover:text-orange-500"
          }`}
        >
          <span className="line-clamp-2">{track.title}</span>
        </Link>

        {/* Artist */}
        <Link
          href={`/users/${track.user.id}`}
          className="block text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          {track.user?.username ?? track.user?.full_name}
        </Link>

        {/* Clean Stats Bar */}
        <div className="pt-2 border-t border-gray-100 space-y-2">
          {/* First Row: Plays and Likes */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Play className="w-3 h-3 text-gray-300" fill="currentColor" />
              <span className="font-medium">
                {formatCount(track.playback_count)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
              <span className="font-medium">
                {formatCount(track.favoritings_count)}
              </span>
            </div>
          </div>

          {/* Second Row: Reposts and Comments */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Repeat className="w-3 h-3 text-green-500" />
              <span className="font-medium">
                {formatCount(track.reposts_count)}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MessageSquareText className="w-3 h-3 text-blue-400" />
              <span className="font-medium">
                {formatCount(track.comment_count)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
