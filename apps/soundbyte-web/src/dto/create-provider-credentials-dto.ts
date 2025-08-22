import { z } from "zod";

export const SpotifyToken = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
});
export type SpotifyToken = z.infer<typeof SpotifyToken>;

export const CreateProviderCredentialsDto = z.object({
  userId: z.string(),
  provider: z.string(), // 'spotify', 'soundcloud'
  token: SpotifyToken,
});
export type CreateProviderCredentialsDto = z.infer<
  typeof CreateProviderCredentialsDto
>;
