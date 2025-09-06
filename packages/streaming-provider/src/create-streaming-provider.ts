import SpotifyWebApi from "spotify-web-api-node";

type Provider = {
  clientId: string;
  redirectUri: string;
  clientSecret: string;
};

export type StreamingProviderConfig = {
  providers: Map<string, Provider>;
};

type SearchQuery = {
  credentials: Map<string, string>; // "spotify": "acces_token..."
  query: {
    searchTerm: string;
  };
};

export function createStreamingProvider(config: StreamingProviderConfig) {
  const providers = config.providers;

  console.log(
    `streamingProviderConfig: ${JSON.stringify({
      ...config.providers,
      providers: Object.fromEntries(config.providers),
    })}`
  );

  const streamingProvider = {
    search: async ({ credentials, query }: SearchQuery): Promise<unknown> => {
      let searchResults: unknown[] = [];

      console.log("Calling Streaming Search");
      console.log("query term:", query);

      if (providers.get("spotify") && credentials.get("spotify")) {
        console.log("search via spotify");

        const spotifyApi = new SpotifyWebApi({
          clientId: providers.get("spotify")?.clientId,
        });

        spotifyApi.setAccessToken(credentials.get("spotify") ?? "");

        const res = await spotifyApi.searchTracks(query.searchTerm);

        console.log(res.body?.tracks?.items);

        if (res.body?.tracks?.items) {
          const searchRes = res.body.tracks.items.map((track) => {
            const smallestAlbumImage = track.album.images.reduce(
              (smallest, image) => {
                if (
                  typeof smallest.height === "undefined" ||
                  (typeof image.height !== "undefined" &&
                    image.height < smallest.height)
                ) {
                  return image;
                }

                return smallest;
              },
              track.album.images[0]
            );

            searchResults.push({
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url,
            });
          });
        }
      }

      // search via soundcloud
      if (providers.get("soundcloud") && credentials.get("soundcloud")) {
        console.log("search via soundcloud");
      }

      console.log(`Search Results: `, searchResults);
      return searchResults;
    },
  };

  return streamingProvider;
}
