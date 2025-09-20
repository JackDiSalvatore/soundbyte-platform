"use client";

import { useAuth } from "@/context/AuthProvider";
import { StreamingProviderOAuthClient } from "@/lib/streaming-provider-oauth-client";
import { useEffect, useState } from "react";
import Profile from "@/components/profile";

type SoundCloudProfile = {
  avatar_url: string;
  id: number;
  urn: string;
  kind: string;
  permalink_url: string;
  uri: string;
  username: string;
  permalink: string;
  created_at: string;
  last_modified: string;
  first_name: string;
  last_name: string;
  full_name: string;
  city: string;
  description: string;
  country: string;
  track_count: number;
  public_favorites_count: number;
  reposts_count: number;
  followers_count: number;
  followings_count: number;
  plan: string;
  myspace_name: null;
  discogs_name: null;
  website_title: null;
  website: null;
  comments_count: number;
  online: boolean;
  likes_count: number;
  playlist_count: number;
  subscriptions: [
    {
      product: {
        id: string;
        name: string;
      };
    },
  ];
  quota: {
    unlimited_upload_quota: boolean;
    upload_seconds_used: number;
    upload_seconds_left: number;
  };
  private_tracks_count: number;
  private_playlists_count: number;
  primary_email_confirmed: boolean;
  locale: string;
  upload_seconds_left: number;
};

export default function Page() {
  const { session, streamingCredentials, isPending } = useAuth();
  const userId = session?.user.id;

  const [profile, setProfile] = useState<SoundCloudProfile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle OAuth return on component mount
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);

    StreamingProviderOAuthClient.profile({
      provider: "soundcloud",
      userId,
    }).then((res) => {
      const data: SoundCloudProfile = res;

      setProfile(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <main className="m-4">
      {profile ? (
        <Profile profile={profile} />
      ) : (
        <div className="max-w-3xl mx-auto p-6 text-sm text-muted-foreground">
          No profile found.
        </div>
      )}
    </main>
  );
}
