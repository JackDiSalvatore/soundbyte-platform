// import dotenv from "dotenv";
// import {
//   createStreamingProvider,
//   StreamingProviderConfig,
// } from "./create-streaming-provider";
// import { env } from "./environment";
// dotenv.config();

// const streamingProviderConfig: StreamingProviderConfig = {
//   providers: new Map(),
// };

// streamingProviderConfig.providers.set("spotify", {
//   clientId: env.SPOTIFY_CLIENT_ID,
//   redirectUri: env.SPOTIFY_REDIRECT_URL,
//   clientSecret: env.SPOTIFY_CLIENT_SECRET,
// });

// streamingProviderConfig.providers.set("soundcloud", {
//   clientId: env.SOUNDCLOUD_CLIENT_ID,
//   redirectUri: env.SOUNDCLOUD_REDIRECT_URL,
//   clientSecret: env.SOUNDCLOUD_CLIENT_SECRET,
// });

// const streamingProvider = createStreamingProvider(streamingProviderConfig);
export * from "./create-streaming-provider";
