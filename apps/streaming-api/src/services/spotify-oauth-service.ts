import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuthCSRFService } from './oauth-csrf-service';
import { OAuthState } from '../types/oauth-state';
import { SpotifyTokenResponse } from '../types/spotify-token-response';
import { SpotifyUser } from '../types/spotify-user';

@Injectable()
export class SpotifyOAuthService {
  constructor(
    private readonly csrfService: OAuthCSRFService,
    private readonly configService: ConfigService,
  ) {}

  private get clientId(): string {
    const id = this.configService.get<string>('SPOTIFY_CLIENT_ID');
    if (!id) {
      throw new Error('SPOTIFY_CLIENT_ID is not defined in configuration');
    }
    return id;
  }

  private get clientSecret(): string {
    const secret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
    if (!secret) {
      throw new Error('SPOTIFY_CLIENT_SECRET is not defined in configuration');
    }
    return secret;
  }

  private get redirectUri(): string {
    const uri = this.configService.get<string>('SPOTIFY_REDIRECT_URI');
    if (!uri) {
      throw new Error('SPOTIFY_REDIRECT_URI is not defined in configuration');
    }
    return uri;
  }

  private get scopes(): string {
    return (
      this.configService.get<string>('SPOTIFY_SCOPES') ||
      'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state'
    );
  }

  /**
   * Build Spotify authorization URL
   */
  buildAuthUrl(
    userId?: string,
    originalUrl?: string,
  ): { url: string; state: string } {
    const oauthState = this.csrfService.generateOAuthState(
      'spotify',
      userId,
      originalUrl,
    );

    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      state: oauthState.state,
      show_dialog: 'true', // Force user to see the authorization dialog
    });

    const url = `https://accounts.spotify.com/authorize?${params.toString()}`;

    return { url, state: oauthState.state };
  }

  /**
   * Validate OAuth state parameter
   */
  validateOAuthState(state: string): OAuthState | null {
    return this.csrfService.validateState(state);
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<SpotifyTokenResponse> {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: this.redirectUri,
    });

    // Spotify requires Basic Auth with client credentials
    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: tokenParams.toString(),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `Spotify token exchange failed: ${response.status} ${errorData}`,
      );
    }

    return await response.json();
  }

  /**
   * Refresh Spotify access token
   */
  async refreshToken(refreshToken: string): Promise<SpotifyTokenResponse> {
    const tokenParams = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });

    const credentials = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${credentials}`,
      },
      body: tokenParams.toString(),
    });

    if (!response.ok) {
      throw new Error(`Spotify token refresh failed: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Get Spotify user profile
   */
  async getUserProfile(accessToken: string): Promise<SpotifyUser> {
    const response = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch Spotify profile: ${response.statusText}`,
      );
    }

    return await response.json();
  }

  /**
   * Consume state after successful token exchange
   */
  consumeState(state: string): OAuthState | null {
    return this.csrfService.consumeState(state);
  }
}
