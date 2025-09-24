import TrackSearchResult from "./track-search-result";
import { Input } from "@/components/ui/input";
import React from "react";
import { useRef } from "react";
import { useSearch } from "@/context/SearchProvider";

type SearchInputProps = {};

export default function SearchInput({}: SearchInputProps) {
  const { searchResults, setSearch, resetSearch } = useSearch();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? "";
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      setSearch(value);
      if (value.trim() === "") resetSearch();
    }, 300); // 300ms debounce
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearch("");
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLInputElement>) => {
    console.log("Seach bar clicked!");
  };

  return (
    <div className="w-1/2 m-auto my-2 relative">
      <Input
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onClick={handleClick}
        placeholder="Search Songs/Artists"
      />

      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white shadow-lg rounded z-10 max-h-80 overflow-y-auto border">
          {searchResults.map((track) => (
            <TrackSearchResult track={track} key={track.uri} />
          ))}
        </div>
      )}
    </div>
  );
}
