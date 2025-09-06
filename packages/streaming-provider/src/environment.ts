import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

export const Environment = z.object({
  SPOTIFY_CLIENT_ID: z.string(),
  SPOTIFY_CLIENT_SECRET: z.string(),
  SPOTIFY_REDIRECT_URL: z.string(),

  SOUNDCLOUD_CLIENT_ID: z.string(),
  SOUNDCLOUD_CLIENT_SECRET: z.string(),
  SOUNDCLOUD_REDIRECT_URL: z.string(),
});
export type Environment = z.infer<typeof Environment>;

export const env = Environment.parse({
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URL: process.env.SPOTIFY_REDIRECT_URL,

  SOUNDCLOUD_CLIENT_ID: process.env.SOUNDCLOUD_CLIENT_ID,
  SOUNDCLOUD_CLIENT_SECRET: process.env.SOUNDCLOUD_CLIENT_SECRET,
  SOUNDCLOUD_REDIRECT_URL: process.env.SOUNDCLOUD_REDIRECT_URL,
});
