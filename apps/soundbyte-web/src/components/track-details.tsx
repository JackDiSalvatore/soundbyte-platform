"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  Heart,
  Repeat,
  MessageSquareText,
  Download,
  Share2,
  MoreHorizontal,
  Clock,
  Calendar,
  Music,
  User,
  Tag,
  ExternalLink,
} from "lucide-react";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { usePlayer } from "@/context/PlayerProvider";

function formatTime(totalSeconds: number): string {
  if (!totalSeconds || isNaN(totalSeconds)) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCount(count: number | undefined): string {
  if (!count) return "0";
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}

export default function SongComponent({ track }: { track: SoundCloudTrack }) {
  const { playTrack, playingTrack } = usePlayer();
  const [isLiked, setIsLiked] = useState(track.user_favorite || false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isCurrentlyPlaying = playingTrack?.id === track.id;

  function handlePlay() {
    playTrack(track);
  }

  function handleLike() {
    setIsLiked(!isLiked);
  }

  const tags = track.tag_list
    ? track.tag_list.split(" ").filter((tag) => tag.length > 0)
    : [];

  return (
    <div className="max-w-7xl mx-auto bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Section */}
      <div className="relative">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent z-10" />

        {/* Artwork Background */}
        {track.artwork_url && (
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110 opacity-30"
            style={{
              backgroundImage: `url(${track.artwork_url.replace("-large", "-t500x500")})`,
            }}
          />
        )}

        <div className="relative z-20 p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Artwork */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={
                    track.artwork_url?.replace("-large", "-t300x300") ??
                    track.user.avatar_url?.replace("-large", "-t300x300") ??
                    "/placeholder-artwork.jpg"
                  }
                  alt={track.title}
                  className="w-64 h-64 rounded-xl object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105"
                />

                {/* Play button overlay */}
                <button
                  onClick={handlePlay}
                  className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-16 h-16 text-white" />
                  ) : (
                    <Play className="w-16 h-16 text-white ml-2" />
                  )}
                </button>
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 text-gray-900">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-orange-500/20 text-orange-700 text-sm rounded-full mb-3">
                  {track.genre || "Music"}
                </span>

                <h1 className="text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                  {track.title}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={
                      track.user.avatar_url?.replace("-large", "-t50x50") ||
                      "/placeholder-avatar.jpg"
                    }
                    alt={track.user.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-xl text-gray-600">
                    {track.user.username ||
                      track.user.full_name ||
                      track.user.username}
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Play className="w-4 h-4" fill="currentColor" />
                  <span>{formatCount(track.playback_count)} plays</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Heart
                    className="w-4 h-4"
                    fill={isLiked ? "#ff6b35" : "none"}
                    stroke={isLiked ? "#ff6b35" : "currentColor"}
                  />
                  <span>{formatCount(track.favoritings_count)} likes</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Repeat className="w-4 h-4" />
                  <span>{formatCount(track.reposts_count)} reposts</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <MessageSquareText className="w-4 h-4" />
                  <span>{formatCount(track.comment_count)} comments</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(Math.ceil(track.duration / 1000))}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handlePlay}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-full text-white font-semibold transition-colors duration-200"
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  {isCurrentlyPlaying ? "Pause" : "Play"}
                </button>

                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors duration-200 ${
                    isLiked
                      ? "bg-red-500/20 text-red-600 border border-red-500/30"
                      : "bg-gray-200 text-gray-700 border border-gray-300 hover:bg-gray-300"
                  }`}
                >
                  <Heart
                    className="w-5 h-5"
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  Like
                </button>

                <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-full text-gray-700 font-semibold transition-colors duration-200 border border-gray-300">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>

                {track.downloadable && (
                  <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-full text-gray-700 font-semibold transition-colors duration-200 border border-gray-300">
                    <Download className="w-5 h-5" />
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 bg-gray-50/50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Description */}
          <div className="lg:col-span-2">
            {track.description && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  About this track
                </h3>
                <div className="text-gray-700 leading-relaxed">
                  <p
                    className={`whitespace-pre-wrap ${!showFullDescription && track.description.length > 200 ? "line-clamp-3" : ""}`}
                  >
                    {track.description}
                  </p>
                  {track.description.length > 200 && (
                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="text-orange-400 hover:text-orange-300 mt-2 text-sm"
                    >
                      {showFullDescription ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 8).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full border border-gray-300"
                    >
                      {tag.replace(/"/g, "")}
                    </span>
                  ))}
                  {tags.length > 8 && (
                    <span className="px-3 py-1 text-gray-500 text-sm">
                      +{tags.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Track Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Track Details
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Released
                </span>
                <span className="text-gray-900">
                  {formatDate(track.created_at)}
                </span>
              </div>

              {track.bpm && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    BPM
                  </span>
                  <span className="text-gray-900">{track.bpm}</span>
                </div>
              )}

              {track.key_signature && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Key</span>
                  <span className="text-gray-900">{track.key_signature}</span>
                </div>
              )}

              {track.label_name && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Label</span>
                  <span className="text-gray-900">{track.label_name}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-gray-600">License</span>
                <span className="text-gray-900 text-xs">
                  {track.license.split("-")[0]}
                </span>
              </div>

              {track.permalink_url && (
                <div className="pt-2">
                  <a
                    href={track.permalink_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on SoundCloud
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
