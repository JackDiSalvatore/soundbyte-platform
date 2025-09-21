export type SoundCloudPaginatedResponse<T> = {
  collection: T;
  next_href: string; //https://api.soundcloud.com/me/likes/tracks?cursor=2024-06-01T16%3A23%3A38.001Z%2Cuser-track-likes%2C000-00000000000147753238-00000000000213040837&linked_partitioning=true&page_size=10
};
