import { SoundCloudUser } from "./soundcloud-playlist";

export type SoundCloudComment = {
  kind: string;
  id: number;
  urn: string;
  body: string;
  created_at: string;
  timestamp: number;
  track_id: number;
  track_urn: string;
  user_id: number;
  user_urn: string;
  user: SoundCloudUser;
  uri: string;
};
