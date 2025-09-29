"use client";

import { useAuth } from "@/context/AuthProvider";
import { SoundByteProfileClient } from "@/lib/soundbyte-profile-client";
import { StreamingProviderClient } from "@/lib/streaming-provider-client";
import { SoundByteGenre } from "@/types/soundbyte-genre";
import { SoundByteProfile } from "@/types/soundbyte-profile";
import { SoundByteSocialLink } from "@/types/soundbyte-social-link";
import { SoundByteSubscription } from "@/types/soundbyte-subscription";
import { useState, useEffect } from "react";

const SOCIAL_PLATFORMS = [
  "instagram",
  "twitter",
  "facebook",
  "tiktok",
  "spotify",
  "bandcamp",
  "youtube",
] as const;

export default function ProfilePage() {
  const { session } = useAuth();
  // Streaming providers user id
  const [providerId, setProviderId] = useState();
  // Available platform genres to choose from
  const [genres, setGenres] = useState<
    | {
        id: number;
        name: string;
      }[]
    | null
  >(null);
  // Platform user profile
  const [profile, setProfile] = useState<SoundByteProfile | null>(null);
  const [usersGenres, setUsersGenres] = useState<SoundByteGenre[] | null>(null);
  const [usersSocialLinks, setUsersSocialLinks] = useState<
    SoundByteSocialLink[] | null
  >(null);
  const [usersSubscription, setUsersSubscription] =
    useState<SoundByteSubscription | null>(null);

  // Load providerId on mount
  useEffect(() => {
    if (!session) return;
    StreamingProviderClient.profile({
      provider: "soundcloud",
      userId: session?.user.id,
    }).then((res) => {
      console.log("Provider User Id: ", res.id);
      setProviderId(res.id);
    });
  }, [session]);

  // Load on mount
  useEffect(() => {
    if (!session) return;

    // Load available genres
    SoundByteProfileClient.getGenres()
      .then((res) => {
        console.log("Available genres:");
        console.log(res);
        setGenres(res);
      })
      .catch((error) => {
        console.error("Failed to load available genres:", error);
      })
      .finally(() => {});

    // Load users profile
    SoundByteProfileClient.getSoundByteProfileByUserId({
      userId: session.user.id,
    })
      .then((res) => {
        setProfile(res);
      })
      .catch((error) => {
        console.error("Failed to load users profile:", error);
      });

    // Load users genres
    SoundByteProfileClient.getSoundByteUsersGenres({
      userId: session.user.id,
    })
      .then((res) => {
        setUsersGenres(res);
      })
      .catch((error) => {
        console.error("Failed to load users genres:", error);
      })
      .finally(() => {});

    // Load users social links
    SoundByteProfileClient.getSoundByteUsersSocialLinks({
      userId: session.user.id,
    })
      .then((res) => {
        setUsersSocialLinks(res);
      })
      .catch((error) => {
        console.error("Failed to load users social links:", error);
      })
      .finally(() => {});

    // Load users subscription
    SoundByteProfileClient.getSoundByteUsersSubscription({
      userId: session.user.id,
    })
      .then((res) => {
        setUsersSubscription(res);
      })
      .catch((error) => {
        console.error("Failed to load users social links:", error);
      })
      .finally(() => {});
  }, [session]);

  return (
    <div className="flex flex-col">
      <div>{JSON.stringify(profile, null, 2)}</div>
      <div>{JSON.stringify(usersGenres, null, 2)}</div>
      <div>{JSON.stringify(usersSocialLinks, null, 2)}</div>
      <div>{JSON.stringify(usersSubscription, null, 2)}</div>
    </div>
  );
}
