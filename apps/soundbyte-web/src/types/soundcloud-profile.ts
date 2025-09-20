export type SoundCloudProfile = {
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
