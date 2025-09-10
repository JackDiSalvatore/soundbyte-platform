import { Injectable } from '@nestjs/common';
import { ConnectDto } from '../dto/connect.dto';
import { RefreshDto } from '../dto/refresh.dto';
import SpotifyWebApi from 'spotify-web-api-node';
import {
  deleteCredentials,
  getCredentials,
  upsertCredentials,
} from '../db/provider-credentials';
import { z } from 'zod';
import { LogoutDto } from '../dto/logout.dto';
import { AccessTokenRequestDto } from '../dto/access-token-request.dto';

export const SpotifyError = z.object({
  error: z.string(),
  error_description: z.string(),
});
export type SpotifyError = z.infer<typeof SpotifyError>;

export const ProviderCredentials = z.object({
  access_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number(),
  refresh_token: z.string(),
  scope: z.string(),
});
export type ProviderCredentials = z.infer<typeof ProviderCredentials>;

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
   * Connect: convert streaming provider code into an access token
   * @param code proivder (spotify) code
   * @param provider provider name (spofity)
   * @param userId authentication user id
   */
  async connect(connectDto: ConnectDto): Promise<string> {
    const { code, provider, userId } = connectDto;

    console.log('provider:', provider);
    console.log('code:', code);

    const existingCredentials = await getCredentials({ userId, provider });

    console.log('existingCredentials:', existingCredentials);

    if (!existingCredentials && code) {
      // User has not logged in yet
      let creds: ProviderCredentials;
      let authUrl = '';

      // Set up request to convert code into a token
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);

      if (provider === 'spotify') {
        params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URL!);
        params.append('client_id', process.env.SPOTIFY_CLIENT_ID!);
        params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET!);
        authUrl = 'https://accounts.spotify.com/api/token';
      } else if (provider === 'soundcloud') {
        params.append('redirect_uri', process.env.SOUNDCLOUD_REDIRECT_URL!);
        params.append('client_id', process.env.SOUNDCLOUD_CLIENT_ID!);
        params.append('client_secret', process.env.SOUNDCLOUD_CLIENT_SECRET!);

        // Sound cloud specific
        params.append(
          'code_verifier',
          'd39b0b56274a072b4f38727943d817936b6e58396c855cb56bffd57a',
        );
        authUrl = 'https://secure.soundcloud.com/oauth/token';
      }

      // Convert code to token
      console.log(`Fetching Auth Token...`);
      console.log('authUrl: ', authUrl);
      console.log('params:', JSON.stringify(params));

      const res = await fetch(authUrl, {
        method: 'POST',
        headers: {
          accept: 'application/json; charset=uft-8',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Failed to get Provider Auth Token', data);
        throw new Error(res.statusText);
      }

      creds = ProviderCredentials.parse(data);
      console.log(`raw credentials:`, creds);

      // Save `refresh_token`, `expires_in`, etc. to the database
      // Link it to the current user session
      await upsertCredentials({
        userId,
        provider,
        token: {
          access_token: creds.access_token,
          refresh_token: creds.refresh_token,
          expires_in: creds.expires_in,
          scope: creds.scope,
          token_type: creds.token_type ?? '',
        },
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

  async getAccessToken(
    accessTokenRequest: AccessTokenRequestDto,
  ): Promise<{ provider: string; accessToken: string }[]> {
    const { userId, providers } = accessTokenRequest;

    const response: { provider: string; accessToken: string }[] = [];

    for (let provider of providers) {
      const existing = await getCredentials({ userId, provider });

      if (existing === undefined)
        throw new Error(`Provider ${provider} not connected`);

      // Update existing credentials
      if (Date.now() >= existing.expiresAt.getTime()) {
        const spotifyApi = new SpotifyWebApi({
          redirectUri: process.env.SPOTIFY_REDIRECT_URL!,
          clientId: process.env.SPOTIFY_CLIENT_ID!,
          clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
          refreshToken: existing.refreshToken,
        });

        const data = await spotifyApi.refreshAccessToken();
        const accessToken = data.body.access_token;

        await upsertCredentials({
          userId,
          provider,
          token: {
            access_token: accessToken,
            refresh_token: existing.refreshToken,
            expires_in: existing.expiresIn,
            scope: existing.scope,
            token_type: existing.tokenType ?? '',
          },
        });

        response.push({ provider, accessToken });
      } else {
        response.push({ provider, accessToken: existing.accessToken });
      }
    }

    return response;
  }
}
