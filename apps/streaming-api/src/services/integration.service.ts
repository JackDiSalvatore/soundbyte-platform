import { Injectable } from '@nestjs/common';
import { ConnectDto } from '../dto/connect.dto';
import { DisconnectDto } from '../dto/disconnect.dto';
import { ConnectProviderCallbackDto } from '../dto/connect-provider-callback.dto';
import SpotifyWebApi from 'spotify-web-api-node';
import {
  deleteCredentials,
  getCredentials,
  upsertCredentials,
} from '../db/provider-credentials';
import { AccessTokenRequestDto } from '../dto/access-token-request.dto';
import { z } from 'zod';
import { EnvironmentVariables } from '../lib/environment.variables';
import { ConfigService } from '@nestjs/config';

const SPOTIFY = 'spotify';
const SOUNDCLOUD = 'soundcloud';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  /**
   * Get Streaming Service Providers
   * @returns string array of streaming service provider names
   */
  getStreamingServices(): string[] {
    return [SPOTIFY, SOUNDCLOUD];
  }

  /**
   * Connect:
   * When user clicks "Connect" button on the front end
   * call this to redirect them to a streaming providers auth page
   */
  async connect(connectDto: ConnectDto): Promise<{ success: boolean }> {
    const { provider, userId } = connectDto;

    console.log('Connecting ', userId, ' to:', provider);

    switch (provider) {
      case SPOTIFY: {
        // const spotifyAuthLink =
        //   `https://accounts.spotify.com/authorize` +
        //   `?client_id=${spotifyClientId}` +
        //   `&response_type=code` +
        //   `&redirect_uri=${spotifyRedirectUrl}` +
        //   `&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

        break;
      }
      case SOUNDCLOUD: {
        // const soundcloudAuthLink =
        //   `https://secure.soundcloud.com/authorize` +
        //   `?client_id=${soundcloudConfig.clientId}` +
        //   `&redirect_uri=${soundcloudConfig.redirectUrl}` +
        //   `&response_type=code` +
        //   `&code_challenge=${soundcloudConfig.codeChallenge}` +
        //   `&code_challenge_method=S256` +
        //   `&state=${soundcloudConfig.state}`; // CSRF Protection

        break;
      }
    }

    return { success: true };
  }

  /**
   * Connect Providre Callback Handler: convert streaming provider `code` into an `access_token`
   * @param code proivder (spotify) code
   * @param provider provider name (spofity)
   * @param userId authentication user id
   */
  async connectProviderCallback(
    connectCallbackDto: ConnectProviderCallbackDto,
  ): Promise<string> {
    const { code, provider, userId } = connectCallbackDto;

    console.log('provider:', provider);
    console.log('code:', code);

    const existingCredentials = await getCredentials({ userId, provider });

    if (existingCredentials) throw new Error('User already connected');
    if (!code) throw new Error('OAuth code not provided');

    // User has not logged in yet
    let creds: {
      access_token: string;
      token_type: string;
      expires_in: number;
      refresh_token: string;
      scope: string;
    };
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

    creds = data;
    console.log(`raw credentials:`, creds);

    // Save `refresh_token`, `expires_in`, etc. to the db and ink it to the user id
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

  /**
   * Disconnect: removes stream provider credentials from database
   */
  async disconnect(disconnectDto: DisconnectDto): Promise<boolean> {
    const { userId, provider } = disconnectDto;

    console.log('Disconnecting ', userId, ' from:', provider);

    await deleteCredentials({ userId, provider });

    return true;
  }

  /**
   * Get Access Token: Fetch as uses access token for a streaming service provider
   */
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
