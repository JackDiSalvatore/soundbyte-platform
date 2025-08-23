import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';
import SpotifyWebApi from 'spotify-web-api-node';
import {
  deleteCredentials,
  getCredentials,
  upsertCredentials,
} from '../db/provider-credentials';
import { z } from 'zod';
import { LogoutDto } from '../dto/logout.dto';

export const SpotifyError = z.object({
  error: z.string(),
  error_description: z.string(),
});
export type SpotifyError = z.infer<typeof SpotifyError>;

export const SpotifyCredentials = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
});
export type SpotifyCredentials = z.infer<typeof SpotifyCredentials>;

@Injectable()
export class IntegrationService {
  /**
   * Get Streaming Service Providers
   * @returns string array of streaming service provider names
   */
  getStreamingServices(): string[] {
    return ['spotify', 'soundcloud'];
  }

  /**
   * Login: convert streaming provider code into an access token
   * @param code proivder (spotify) code
   * @param provider provider name (spofity)
   * @param userId authentication user id
   */
  async login(loginDto: LoginDto): Promise<string> {
    const { code, provider, userId } = loginDto;

    console.log('code:', code);

    const existingCredentials = await getCredentials({ userId, provider });

    console.log('existingCredentials:', existingCredentials);

    if (!existingCredentials && code) {
      // User has not logged in yet

      // Set up request to convert code into a token
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URL!);
      params.append('client_id', process.env.SPOTIFY_CLIENT_ID!);
      params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET!);

      // Convert code to token
      console.log(`Fetching Spotify Token...`);
      const spotifyRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await spotifyRes.json(); // TODO: validate data

      if (!spotifyRes.ok) {
        console.error('Failed to get Spotify Token', data);
        throw new Error(spotifyRes.statusText);
      }
      const creds = SpotifyCredentials.parse(data);
      console.log(`raw credentials:`, creds);

      // Save `refresh_token`, `expires_in`, etc. to the database
      // Link it to the current user session
      await upsertCredentials({
        userId,
        provider,
        token: creds,
      });

      return creds.access_token;
    }

    if (existingCredentials) {
      if (Date.now() >= existingCredentials.expiresAt.getTime()) {
        const spotifyApi = new SpotifyWebApi({
          redirectUri: process.env.SPOTIFY_REDIRECT_URL!,
          clientId: process.env.SPOTIFY_CLIENT_ID!,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
          refreshToken: existingCredentials.refreshToken,
        });

        const data = await spotifyApi.refreshAccessToken();

        return data.body.access_token;
      }

      return existingCredentials.accessToken;
    }

    return '';
  }

  /**
   * Logout: removes stream provider credentials from database
   */
  async logout(logoutDto: LogoutDto): Promise<boolean> {
    const { userId, provider } = logoutDto;
    await deleteCredentials({ userId, provider });

    return true;
  }
}
