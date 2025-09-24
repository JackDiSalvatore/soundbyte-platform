import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
} from "lucide-react";

interface SoundCloudPlayerProps {
  streamUrl: string;
  accessToken: string;
  trackTitle?: string;
  artistName?: string;
  artworkUrl?: string | null;
  soundcloudUrl?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onError?: (error: string) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
}

export default function SoundCloudPlayer({
  streamUrl,
  accessToken,
  trackTitle = "Unknown Track",
  artistName = "Unknown Artist",
  artworkUrl = null,
  soundcloudUrl = "#",
  autoPlay = false,
  onPlay = () => {},
  onPause = () => {},
  onEnded = () => {},
  onTimeUpdate = () => {},
  onError = () => {},
  onLoadStart = () => {},
  onLoadEnd = () => {},
}: SoundCloudPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualStreamUrl, setActualStreamUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const prevStreamUrl = useRef<string | null>(null);

  // Memoize callback functions to prevent infinite useEffect loops
  const memoizedOnPlay = useCallback(onPlay, []);
  const memoizedOnError = useCallback(onError, []);
  const memoizedOnLoadStart = useCallback(onLoadStart, []);
  const memoizedOnLoadEnd = useCallback(onLoadEnd, []);

  // Fetch actual stream URL from SoundCloud API
  useEffect(() => {
    const fetchStreamUrl = async (): Promise<void> => {
      if (!streamUrl || !accessToken) return;

      setLoading(true);
      setError(null);
      memoizedOnLoadStart();

      try {
        const response = await fetch(streamUrl, {
          headers: {
            Authorization: `OAuth ${accessToken}`,
            Accept: "application/json; charset=utf-8",
          },
          redirect: "follow",
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch stream: ${response.status}`);
        }

        if (response.status === 200) {
          // Pull full streaming url out of the response
          const realRedirectUrl = response.url;
          setActualStreamUrl(realRedirectUrl);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        memoizedOnError(errorMessage);
        console.error("Stream fetch error:", err);
      } finally {
        setLoading(false);
        memoizedOnLoadEnd();
      }
    };

    fetchStreamUrl();
  }, [
    streamUrl,
    accessToken,
    memoizedOnLoadStart,
    memoizedOnLoadEnd,
    memoizedOnError,
  ]);

  // Auto-play when a new URL is ready
  useEffect(() => {
    if (!autoPlay || !actualStreamUrl || !audioRef.current) return;
    if (prevStreamUrl.current === actualStreamUrl) return;

    prevStreamUrl.current = actualStreamUrl;

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        memoizedOnPlay();
      })
      .catch((err: Error) => {
        const errorMessage = "Autoplay failed: " + err.message;
        setError(errorMessage);
        memoizedOnError(errorMessage);
      });
  }, [autoPlay, actualStreamUrl, memoizedOnPlay, memoizedOnError]);

  const togglePlay = (): void => {
    if (!audioRef.current || !actualStreamUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onPause();
    } else {
      audioRef.current.play().catch((err: Error) => {
        const errorMessage = "Failed to play audio: " + err.message;
        setError(errorMessage);
        onError(errorMessage);
      });
      setIsPlaying(true);
      onPlay();
    }
  };

  const handleTimeUpdate = (): void => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      onTimeUpdate(current);
    }
  };

  const handleLoadedMetadata = (): void => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = (): void => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const skipForward = (): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(currentTime + 10, duration);
    }
  };

  const skipBackward = (): void => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(currentTime - 10, 0);
    }
  };

  const formatTime = (time: number): string => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <main>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-2 w-full max-w-7xl mx-auto">
        {/* Audio Element */}
        {actualStreamUrl && (
          <audio
            ref={audioRef}
            src={actualStreamUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              onEnded();
            }}
            onError={() => {
              const errorMessage = "Audio playback error";
              setError(errorMessage);
              onError(errorMessage);
            }}
          />
        )}

        {/* Artwork + Track Info */}
        <div className="flex items-center w-full md:w-auto">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
            {artworkUrl ? (
              <img
                src={artworkUrl}
                alt="Track artwork"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 bg-orange-500 rounded"></div>
              </div>
            )}
          </div>

          <div className="ml-4 flex-1 min-w-0">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 truncate">
              {trackTitle.slice(0, 20)}
            </h3>
            <p className="text-sm text-gray-600 truncate">
              {artistName.slice(0, 20)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 w-full md:mx-6">
          <div
            ref={progressRef}
            className="w-full h-2 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-100"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={skipBackward}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={loading || !!error}
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlay}
            disabled={loading || !!error || !actualStreamUrl}
            className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} className="ml-0.5" />
            )}
          </button>

          <button
            onClick={skipForward}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            disabled={loading || !!error}
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 w-full md:w-40">
          <button onClick={toggleMute} className="p-1">
            {isMuted || volume === 0 ? (
              <VolumeX size={16} />
            ) : (
              <Volume2 size={16} />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {/* Attribution */}
      <div className="flex justify-between text-center pt-1 px-3 max-w-7xl mx-auto">
        <p className="text-xs text-gray-500">
          Powered by{" "}
          <a
            href="https://soundcloud.com"
            className="text-orange-500 hover:underline"
          >
            SoundCloud
          </a>
        </p>
        <a
          href={soundcloudUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-orange-500 hover:underline"
        >
          View on SoundCloud
        </a>
      </div>
    </main>
  );
}
