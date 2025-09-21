export type SoundCloudPaginatedResponse<T> = {
  collection: T;
  next_href?: string; // optional cursor URL from SoundCloud
};
