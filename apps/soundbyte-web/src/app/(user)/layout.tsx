"use client";

import Header from "@/components/header";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import SearchInput from "@/components/search-input";
import { PlayerProvider } from "@/context/PlayerProvider";
import PlayerOverlay from "@/components/player-overlay";
import { SearchProvider } from "@/context/SearchProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, streamingCredentials, isPending } = useAuth();

  const [soundCloudAccessToken, setSoundCloudAccessToken] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!streamingCredentials) return;

    console.log("Your existing credentials are:");
    console.log(JSON.stringify(streamingCredentials));

    setSoundCloudAccessToken(streamingCredentials.accessToken);
  }, [streamingCredentials]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    // parent is relative so fixed overlays are positioned relative to viewport as expected
    <PlayerProvider>
      <SearchProvider>
        <div className="relative min-h-screen">
          {/* Header overlay */}
          <Header className="fixed inset-x-0 top-0 z-50 flex items-baseline justify-between border-b-2 p-2 bg-background/90 backdrop-blur">
            <SearchInput />
          </Header>

          {/* Content area with top + bottom padding equal to header/footer heights to avoid overlap */}
          <main className="pt-[64px] pb-[120px]">{children}</main>

          {/* Player/Footer overlay */}
          <PlayerOverlay accessToken={soundCloudAccessToken} />
        </div>
      </SearchProvider>
    </PlayerProvider>
  );
}
