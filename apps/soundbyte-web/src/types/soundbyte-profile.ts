export type SoundByteProfile = {
  id: number;
  user_id: string;
  provider_id: string;
  email: string;
  verified: boolean;
  public: boolean;
  created_at?: Date;
  updated_at?: Date;
};
