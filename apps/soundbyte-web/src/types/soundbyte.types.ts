export type SoundByteGenre = {
  id: number;
  name: string;
};

export type SoundByteProfile = {
  id?: number;
  user_id: string;
  provider_id: string;
  email: string;
  verified: boolean;
  public: boolean;
  created_at?: Date;
  updated_at?: Date;
};

export type SoundByteSocialLink = {
  id?: number;
  profile_id?: number;
  platform:
    | "instagram"
    | "twitter"
    | "facebook"
    | "tiktok"
    | "spotify"
    | "bandcamp"
    | "youtube";
  url: string;
};

export type SoundByteSubscription = {
  id: number;
  profile_id: number; // FK
  plan: "free" | "pro";
  started_at?: Date;
  expires_at?: Date;
};
