export type SoundByteSocialLink = {
  id: number;
  profile_id: number;
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
