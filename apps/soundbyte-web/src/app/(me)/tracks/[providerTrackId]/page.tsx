"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { useEffect, useState } from "react";
import TrackDetails from "@/components/track-details";
import { usePaginatedFetch } from "@/hooks/use-paginated-fetch";
import { SoundCloudPaginatedResponse } from "@/types/soundcloud-paginated-response";
import { SoundCloudComment } from "@/types/soundcloud-comment";
import Comments from "@/components/comments";

export default function Page() {
  const params = useParams();
  const providerTrackId = params.providerTrackId?.toString();
  const { session } = useAuth();
  const userId = session?.user.id;

  const [providerTrack, setProviderTrack] = useState<SoundCloudTrack | null>(
    null
  );

  if (!providerTrackId) return;

  // Track
  useEffect(() => {
    if (!userId || !providerTrackId) return;

    StreamingProviderClient.track({
      provider: "soundcloud",
      providerTrackId,
      userId,
    }).then((res) => {
      setProviderTrack(res);
    });
  }, []);

  // Track Comments
  const {
    data: providerTrackComments,
    nextHref: providerTrackCommentsNext,
    isLoading: isLoadingProviderTrackComments,
    fetchPage: fetchProviderTrackComments,
  } = usePaginatedFetch<SoundCloudComment>(
    (opts?: {
      next?: boolean;
      nextHref?: string;
    }): Promise<SoundCloudPaginatedResponse<SoundCloudComment[]>> =>
      StreamingProviderClient.comments({
        provider: "soundcloud",
        providerTrackId,
        userId: userId || "",
        limit: 25,
        nextHref: opts?.next ? providerTrackCommentsNext : undefined,
      }),
    [providerTrackId, userId]
  );

  if (!providerTrack) {
    return <>Loading...</>;
  }

  return (
    <section className="m-8">
      <TrackDetails track={providerTrack}></TrackDetails>

      <Comments
        comments={providerTrackComments}
        hasMore={!!providerTrackCommentsNext}
        isLoading={isLoadingProviderTrackComments}
        onLoadMore={() => fetchProviderTrackComments({ next: true })}
      />
    </section>
  );
}
