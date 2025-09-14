import { Injectable } from '@nestjs/common';
import { OAuthCSRFService } from './oauth-csrf-service';
import { ConfigService } from '@nestjs/config';
import { OAuthState } from './oauth-state';

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
    if (!uri) throw new Error('SOUNDCLOUD_REDIRED_URL is not defined');
    return uri;
  }

  /**
   * Build authorization URL for OAuth initiation
   */
  buildAuthUrl(
    userId?: string,
    originalUrl?: string,
  ): { url: string; state: string } {
    return this.csrfService.buildAuthorizationURL(
      this.clientId,
      this.redirectUri,
      userId,
      originalUrl,
    );
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
  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<any> {
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

  /**
   * Consume state after successful token exchange
   */
  consumeState(state: string): OAuthState | null {
    return this.csrfService.consumeState(state);
  }
}
