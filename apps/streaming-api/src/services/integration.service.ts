import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { RefreshDto } from '../dto/refresh.dto';
import SpotifyWebApi from 'spotify-web-api-node';
import { getCredentials } from '../db/provider-credentials';

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
  async login(loginDto: LoginDto): Promise<unknown> {
    const { code, provider, userId } = loginDto;

    console.log(`code: ${code}`);

    if (code == '') {
      console.log('No code provided. Looking up credentails in database...');

      const credentails = await getCredentials({ userId, provider });

      console.log(`credentials: ${credentails}`);

      return {
        userId,
        provider,
        token: {
          access_token: credentails?.accessToken ?? '',
          refresh_token: credentails?.refreshToken ?? '',
          expires_in: credentails?.expiresIn ?? '',
        },
      };
    }

    // Set up request to convert code into a token
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URL!);
    params.append('client_id', process.env.SPOTIFY_CLIENT_ID!);
    params.append('client_secret', process.env.SPOTIFY_CLIENT_SECRET!);

    console.log(`Fetching Spotify Token...`);

    // Convert code to token
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
      return Response.json({ error: 'Failed to get token' }, { status: 500 });
    }

    const userSpotifyCredentails = {
      userId,
      provider,
      token: data,
    };

    console.log(
      `User Connect Details: ${JSON.stringify(userSpotifyCredentails, null, 2)}`,
    );

    // Save access_token, refresh_token, expires_in, etc. to your database
    // Link it to the current user session
    // await this.createProviderCredentials(userSpotifyCredentails);

    return userSpotifyCredentails;
    // return Response.json({ data: userSpotifyCredentails, status: 201 });
  }

  /**
   * Refresh: refresh access token
   */
  async refresh(refreshDto: RefreshDto): Promise<unknown> {
    const { refreshToken } = refreshDto;
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.SPOTIFY_REDIRECT_URL!,
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      refreshToken: refreshToken,
    });

    const data = await spotifyApi.refreshAccessToken();

    if (data) {
      return {
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      };
    } else {
      return { error: 'streaming api error' };
    }
  }
}
