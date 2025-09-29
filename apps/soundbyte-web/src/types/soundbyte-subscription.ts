export type SoundByteSubscription = {
  id: number;
  profile_id: number; // FK
  plan: "free" | "pro";
  started_at?: Date;
  expires_at?: Date;
};
