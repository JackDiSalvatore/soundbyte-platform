import { Input } from "@/components/ui/input";
import React from "react";

type SearchInputProps = {
  searchSongs: (value: string) => void;
};

export default function SearchInput({ searchSongs }: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ?? "";
    searchSongs(value);
  };

  return (
    <Input
      className="w-1/2 m-auto my-2"
      onChange={handleChange}
      placeholder="Search Songs/Artists"
    />
  );
}
