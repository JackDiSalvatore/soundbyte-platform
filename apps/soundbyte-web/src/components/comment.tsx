import React from "react";
import { MessageCircle, Clock, User } from "lucide-react";
import { SoundCloudComment } from "@/types/soundcloud-comment";

type CommentProps = {
  comment: SoundCloudComment;
  showTimestamp?: boolean;
  className?: string;
};

export default function Comment({
  comment,
  showTimestamp = true,
  className = "",
}: CommentProps) {
  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor(timestamp / 60000);
    const seconds = Math.floor((timestamp % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {/* Header with user info and timestamp */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {comment.user.avatar_url ? (
              <img
                src={comment.user.avatar_url}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const nextElement = e.currentTarget
                    .nextElementSibling as HTMLElement;
                  if (nextElement) {
                    nextElement.style.display = "flex";
                  }
                }}
              />
            ) : null}
            <div
              className={`w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center ${comment.user.avatar_url ? "hidden" : "flex"}`}
            >
              <User className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {comment.user.username || comment.user.full_name}
              </h4>
              {comment.user.username && (
                <span className="text-xs text-gray-500">
                  @{comment.user.username}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Created Date */}
        <div className="flex items-center text-xs text-gray-500 space-x-1">
          <Clock className="w-3 h-3" />
          <span>{formatDate(comment.created_at)}</span>
        </div>
      </div>

      {/* Comment Body */}
      <div className="mb-3">
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
          {comment.body}
        </p>
      </div>

      {/* Footer with track timestamp */}
      {showTimestamp && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <MessageCircle className="w-3 h-3" />
            <span>Comment at {formatTimestamp(comment.timestamp)}</span>
          </div>

          {/* Optional: Add interaction buttons */}
          <div className="flex items-center space-x-3">
            <button className="text-gray-400 hover:text-orange-500 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
