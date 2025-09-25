"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { SoundCloudTrack } from "@/types/soundcloud-playlist";
import { useEffect, useState } from "react";
import TrackDetails from "@/components/track-details";

export default function Page() {
  const params = useParams();
  const providerTrackId = params.providerTrackId?.toString();
  const { session } = useAuth();
  const userId = session?.user.id;

  const [providerTrack, setProviderTrack] = useState<SoundCloudTrack | null>(
    null
  );

  // User
  useEffect(() => {
    console.log("loading track to frontend");
    console.log("uesrId: ", userId);
    console.log("providerTrackId: ", providerTrackId);
    if (!userId || !providerTrackId) return;

    StreamingProviderClient.track({
      provider: "soundcloud",
      providerTrackId,
      userId,
    }).then((res) => {
      console.log(res);
      setProviderTrack(res);
    });
  }, []);

  if (!providerTrack) {
    return <>Loading...</>;
  }

  return (
    <section className="m-8">
      <TrackDetails track={providerTrack}></TrackDetails>
    </section>
  );
}
