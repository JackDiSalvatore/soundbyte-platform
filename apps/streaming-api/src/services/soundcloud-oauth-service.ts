import { Injectable } from '@nestjs/common';
import { OAuthCSRFService } from './oauth-csrf-service';
import { ConfigService } from '@nestjs/config';
import { OAuthState, OAuthStateWithPKCE } from '../types/oauth-state';
import { SoundCloudTokenResponse } from '../types/SoundCloudTokenResponse';

@Injectable()
export class SoundCloudOAuthService {
  constructor(
    private readonly csrfService: OAuthCSRFService,
    private readonly configService: ConfigService,
  ) {}

  private get clientId(): string {
    const id = this.configService.get<string>('SOUNDCLOUD_CLIENT_ID');
    if (!id) throw new Error('SOUNDCLOUD_CLIENT_ID is not defined');
    return id;
  }

  private get clientSecret(): string {
    const secret = this.configService.get<string>('SOUNDCLOUD_CLIENT_SECRET');
    if (!secret) throw new Error('SOUNDCLOUD_CLIENT_SECRET is not defined');
    return secret;
  }

  private get redirectUri(): string {
    const uri = this.configService.get<string>('SOUNDCLOUD_REDIRECT_URI');
    if (!uri) throw new Error('SOUNDCLOUD_REDIRECT_URI is not defined');
    return uri;
  }

  /**
   * Build authorization URL for OAuth initiation
   */
  buildAuthUrl(
    userId?: string,
    originalUrl?: string,
  ): { url: string; state: string } {
    const oauthState = this.csrfService.generateOAuthStateWithPKCE(
      'soundcloud',
      userId,
      originalUrl,
    );

    const codeChallenge = this.csrfService.generateCodeChallenge(
      oauthState.codeVerifier,
    );

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: oauthState.state, // just the random key
    });

    return {
      url: `https://secure.soundcloud.com/authorize?${params.toString()}`,
      state: oauthState.state,
    };
  }

  validateOAuthState(state: string): OAuthStateWithPKCE | null {
    return this.csrfService.validateState(state) as OAuthStateWithPKCE;
  }

  async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
  ): Promise<SoundCloudTokenResponse> {
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code: code,
      redirect_uri: this.redirectUri,
      code_verifier: codeVerifier,
    });

    const response = await fetch('https://api.soundcloud.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    return await response.json();
  }

  async useRefreshToken(
    refreshToken: string,
  ): Promise<SoundCloudTokenResponse> {
    const tokenParams = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    });

    const response = await fetch('https://secure.soundcloud.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json; charset=utf-8',
      },
      body: tokenParams.toString(),
    });

    if (!response.ok) {
      throw new Error(`Refresh token request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  consumeState(state: string): OAuthStateWithPKCE | null {
    return this.csrfService.consumeState(state) as OAuthStateWithPKCE;
  }
}
