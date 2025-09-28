"use client";

import {
  Play,
  Pause,
  Heart,
  MessageSquareText,
  Headphones,
  Repeat,
} from "lucide-react";

const formatCount = (count: number | undefined): string => {
  if (!count) return "0";
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toLocaleString();
};

type Props = {
  className: string;
  playback_count: number | undefined;
  favoritings_count: number | undefined;
  reposts_count: number | undefined;
  comment_count: number | undefined;
};

export default function SongStatsBar({
  className,
  playback_count,
  favoritings_count,
  reposts_count,
  comment_count,
}: Props) {
  return (
    <div className={className}>
      {/* First Row: Plays and Likes */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Play className="w-3 h-3 text-gray-300" fill="currentColor" />
          <span className="font-medium">{formatCount(playback_count)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Heart className="w-3 h-3 text-red-400" fill="currentColor" />
          <span className="font-medium">{formatCount(favoritings_count)}</span>
        </div>
      </div>

      {/* Second Row: Reposts and Comments */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Repeat className="w-3 h-3 text-green-500" />
          <span className="font-medium">{formatCount(reposts_count)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <MessageSquareText className="w-3 h-3 text-blue-400" />
          <span className="font-medium">{formatCount(comment_count)}</span>
        </div>
      </div>
    </div>
  );
}
