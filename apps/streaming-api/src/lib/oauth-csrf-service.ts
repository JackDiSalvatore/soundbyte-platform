import crypto from 'crypto';
import {
  Injectable,
  Controller,
  Get,
  Query,
  Res,
  Req,
  BadRequestException,
  UnauthorizedException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { OAuthState } from './oauth-state';

@Injectable()
export class OAuthCSRFService {
  private stateStore: Map<string, OAuthState> = new Map();
  private readonly stateTTL: number = 10 * 60 * 1000; // 10 minutes

  /**
   * Generate OAuth state parameter and PKCE code verifier
   */
  generateOAuthState(userId?: string, originalUrl?: string): OAuthState {
    // Generate cryptographically secure random state (32 bytes = 256 bits)
    const state = crypto.randomBytes(32).toString('base64url');

    // Generate PKCE code verifier (43-128 characters, base64url encoded)
    const codeVerifier = crypto.randomBytes(32).toString('base64url');

    const oauthState: OAuthState = {
      state,
      codeVerifier,
      expires: Date.now() + this.stateTTL,
      userId,
      originalUrl,
    };

    // Store state for later verification
    this.stateStore.set(state, oauthState);

    // Cleanup expired states
    this.cleanupExpiredStates();

    return oauthState;
  }

  /**
   * Generate PKCE code challenge from code verifier
   */
  generateCodeChallenge(codeVerifier: string): string {
    return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  }

  /**
   * Build SoundCloud authorization URL
   */
  buildAuthorizationURL(
    clientId: string,
    redirectUri: string,
    userId?: string,
    originalUrl?: string,
  ): { url: string; state: string } {
    const oauthState = this.generateOAuthState(userId, originalUrl);
    const codeChallenge = this.generateCodeChallenge(oauthState.codeVerifier);

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state: oauthState.state,
    });

    const url = `https://secure.soundcloud.com/authorize?${params.toString()}`;

    return { url, state: oauthState.state };
  }

  /**
   * Validate state parameter from OAuth callback
   */
  validateState(state: string): OAuthState | null {
    const storedState = this.stateStore.get(state);

    if (!storedState) {
      return null;
    }

    // Check if state has expired
    if (Date.now() > storedState.expires) {
      this.stateStore.delete(state);
      return null;
    }

    return storedState;
  }

  /**
   * Consume and remove state (call after successful token exchange)
   */
  consumeState(state: string): OAuthState | null {
    const storedState = this.validateState(state);
    if (storedState) {
      this.stateStore.delete(state);
    }
    return storedState;
  }

  /**
   * Clean up expired states
   */
  private cleanupExpiredStates(): void {
    const now = Date.now();
    for (const [state, stateData] of this.stateStore.entries()) {
      if (now > stateData.expires) {
        this.stateStore.delete(state);
      }
    }
  }
}
