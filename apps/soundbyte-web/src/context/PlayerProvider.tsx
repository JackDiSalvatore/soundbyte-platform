"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";

type PlayerContextType = {
  playingTrack?: SoundCloudTrack;
  playTrack: (track: SoundCloudTrack) => void;
  stop: () => void;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [playingTrack, setPlayingTrack] = useState<SoundCloudTrack>();

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const playTrack = useCallback((track: SoundCloudTrack) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      console.log("Now playing:", track);
      setPlayingTrack(track);
    }, 200); // adjust debounce time (ms) as needed
  }, []);

  const stop = useCallback(() => {
    setPlayingTrack(undefined);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        playingTrack,
        playTrack,
        stop,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);

  if (!ctx) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }

  return ctx;
}
