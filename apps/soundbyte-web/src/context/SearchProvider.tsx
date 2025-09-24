"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthProvider";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";

type SearchContextType = {
  search: string;
  setSearch: (value: string) => void;
  searchResults: SoundCloudTrack[];
  isLoadingSearch: boolean;
  resetSearch: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [search, setSearch] = useState("");

  const {
    data: searchResults,
    nextHref,
    isLoading: isLoadingSearch,
    fetchPage,
    reset: resetSearch,
  } = usePaginatedFetch<SoundCloudTrack>(
    (opts): Promise<SoundCloudPaginatedResponse<SoundCloudTrack[]>> => {
      if (!search.trim()) {
        return Promise.resolve({
          collection: [],
          next_href: undefined,
        });
      }

      return StreamingProviderClient.searchTracks({
        provider: "soundcloud",
        userId: session?.user.id ?? "",
        searchTerm: search,
        limit: 25,
        nextHref: opts?.next ? nextHref : undefined,
      });
    },
    [search]
  );

  const handleSetSearch = useCallback(
    (value: string) => {
      setSearch(value);
      if (value.trim() === "") resetSearch();
    },
    [resetSearch]
  );

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch: handleSetSearch,
        searchResults,
        isLoadingSearch,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used inside SearchProvider");
  return ctx;
}
