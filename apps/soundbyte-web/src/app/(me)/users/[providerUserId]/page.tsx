"use client";

import { useParams } from "next/navigation";
import Profile from "@/components/profile";
import Tracks from "@/components/tracks";
import { useAuth } from "@/context/AuthProvider";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { SoundCloudProfile } from "@/types/soundcloud-profile";
import { useCallback, useEffect, useState } from "react";
import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";

export default function Page() {
  const params = useParams();
  const providerUserId = params.providerUserId?.toString();
  const { session } = useAuth();
  const userId = session?.user.id;

  const [providerUser, setProviderUser] = useState<SoundCloudProfile | null>(
    null
  );

  // User Tracks
  const {
    data: providerUserTracks,
    nextHref: providerUserTracksNext,
    isLoading: isLoadingProviderUserTracks,
    fetchPage: fetchProviderUserTracks,
  } = usePaginatedFetch<SoundCloudTrack>(
    (opts?: {
      next?: boolean;
      nextHref?: string;
    }): Promise<SoundCloudPaginatedResponse<SoundCloudTrack[]>> =>
      StreamingProviderClient.userTracks({
        provider: "soundcloud",
        providerUserId: providerUserId || "",
        userId: userId || "",
        limit: 25,
        nextHref: opts?.next ? providerUserTracksNext : undefined,
      }),
    [providerUserId, userId]
  );

  // User
  useEffect(() => {
    if (!session || !providerUserId) return;

    StreamingProviderClient.user({
      provider: "soundcloud",
      providerUserId: providerUserId,
      userId: userId || "",
    }).then((res) => {
      setProviderUser(res);
    });
  }, [session, providerUserId, userId]);

  if (!userId) return null;
  if (!providerUserId) return null;

  return (
    <section className="m-8">
      <Profile profile={providerUser} />

      <Tracks
        tracks={providerUserTracks}
        title="Tracks"
        hasMore={!!providerUserTracksNext}
        isLoading={isLoadingProviderUserTracks}
        onLoadMore={() => fetchProviderUserTracks({ next: true })}
      />
    </section>
  );
}
