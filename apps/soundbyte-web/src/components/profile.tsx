"use client";

import React from "react";
import Link from "next/link";

type SoundCloudProfile = {
  avatar_url?: string;
  id?: number;
  urn?: string;
  kind?: string;
  permalink_url?: string;
  uri?: string;
  username?: string;
  permalink?: string;
  created_at?: string;
  last_modified?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  city?: string;
  description?: string;
  country?: string;
  track_count?: number;
  public_favorites_count?: number;
  reposts_count?: number;
  followers_count?: number;
  followings_count?: number;
  plan?: string;
  myspace_name?: string | null;
  discogs_name?: string | null;
  website_title?: string | null;
  website?: string | null;
  comments_count?: number;
  online?: boolean;
  likes_count?: number;
  playlist_count?: number;
  subscriptions?: [
    {
      product: {
        id: string;
        name: string;
      };
      recurring: boolean;
    },
  ];
  quota?: {
    unlimited_upload_quota?: boolean;
    upload_seconds_used?: number;
    upload_seconds_left?: number | string | null;
  };
  private_tracks_count?: number;
  private_playlists_count?: number;
  primary_email_confirmed?: boolean;
  locale?: string;
  upload_seconds_left?: string | number | null;
};

type Props = {
  profile: SoundCloudProfile | undefined | null;
};

export default function Profile({ profile }: Props) {
  if (!profile)
    return (
      <div className="max-w-3xl mx-auto p-6 text-sm text-muted-foreground">
        No profile found.
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto w-full">
      <div className="bg-card/60 backdrop-blur-md border border-border rounded-xl p-6 flex items-start gap-6 shadow-lg">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {/* Using native <img> for avatars to avoid requiring next.config image domains in all environments */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar_url ?? "/file.svg"}
            alt={profile.username ?? "avatar"}
            className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/30"
          />
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-tight truncate">
                {profile.full_name ?? profile.username}
              </h2>
              <p className="text-sm text-muted-foreground truncate">
                @{profile.username}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={profile.permalink_url ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500 text-primary-foreground text-sm font-medium hover:brightness-9"
              >
                View on SoundCloud
              </Link>
            </div>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            {(profile.city || profile.country) && (
              <div className="mb-2">
                {profile.city && <span>{profile.city}</span>}
                {profile.city && profile.country && (
                  <span className="mx-2">•</span>
                )}
                {profile.country && <span>{profile.country}</span>}
              </div>
            )}

            {profile.description ? (
              <p className="line-clamp-3 break-words text-sm">
                {profile.description}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No bio provided.</p>
            )}

            <div className="mt-4 grid grid-cols-4 gap-3 text-center">
              <Stat label="Followers" value={profile.followers_count ?? 0} />
              <Stat label="Tracks" value={profile.track_count ?? 0} />
              <Stat label="Likes" value={profile.public_favorites_count ?? 0} />
              <Stat label="Reposts" value={profile.reposts_count ?? 0} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-background/40 p-3">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
