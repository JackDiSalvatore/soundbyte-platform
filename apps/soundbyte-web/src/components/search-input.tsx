import { Input } from "@/components/ui/input";
import React from "react";
import TrackSearchResult from "./track-search-results";
import { useRef } from "react";

type SearchInputProps = {
  searchResults: {
    artist: string;
    title: string;
    uri: string;
    albumUrl: string;
  }[];
  searchSongs: (value: string) => void;
  chooseTrack: (track: {
    artist: string;
    title: string;
    uri: string;
    albumUrl: string;
  }) => void;
};

export default function SearchInput({
  searchResults,
  searchSongs,
  chooseTrack,
}: SearchInputProps) {
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? "";
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      searchSongs(value);
    }, 300); // 300ms debounce
  };

  return (
    <div className="w-1/2 m-auto my-2 relative">
      <Input onChange={handleChange} placeholder="Search Songs/Artists" />
      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded z-10 max-h-80 overflow-y-auto border">
          {searchResults.map((track) => (
            <TrackSearchResult
              track={track}
              key={track.uri}
              chooseTrack={chooseTrack}
            />
          ))}
        </div>
      )}
    </div>
  );
}
