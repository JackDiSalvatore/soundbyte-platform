import { SoundByteGenre } from "./soundbyte.types";

export type ProfileFormData = {
  email: string;
  public: boolean;
  verified: boolean;
  selectedGenres: SoundByteGenre[];
  socials: { platform: string; url: string }[];
  subscriptionPlan: "free" | "pro";
};
