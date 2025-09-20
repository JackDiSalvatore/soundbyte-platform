import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { OAuthState, OAuthStateWithPKCE } from '../types/oauth-state';

@Injectable()
export class OAuthCSRFService {
  private stateStore: Map<string, OAuthState> = new Map();
  private readonly stateTTL: number = 10 * 60 * 1000; // 10 minutes

  /**
   * Generate OAuth state parameter (without PKCE for Spotify)
   */
  generateOAuthState(
    provider: string,
    userId?: string,
    originalUrl?: string,
  ): OAuthState {
    const state = crypto.randomBytes(32).toString('base64url');

    const oauthState: OAuthState = {
      state,
      provider,
      expires: Date.now() + this.stateTTL,
      userId,
      originalUrl,
    };

    this.stateStore.set(state, oauthState);
    this.cleanupExpiredStates();

    return oauthState;
  }

  /**
   * Generate PKCE code verifier for providers that support it (SoundCloud)
   */
  generateOAuthStateWithPKCE(
    provider: string,
    userId?: string,
    originalUrl?: string,
  ): OAuthStateWithPKCE {
    const state = crypto.randomBytes(32).toString('base64url');
    const codeVerifier = crypto.randomBytes(32).toString('base64url');

    const oauthState: OAuthStateWithPKCE = {
      state,
      provider,
      codeVerifier,
      expires: Date.now() + this.stateTTL,
      userId,
      originalUrl,
    };

    this.stateStore.set(state, oauthState);
    this.cleanupExpiredStates();

    return oauthState;
  }

  generateCodeChallenge(codeVerifier: string): string {
    return crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  }

  validateState(state: string): OAuthState | null {
    const storedState = this.stateStore.get(state);

    if (!storedState) {
      return null;
    }

    if (Date.now() > storedState.expires) {
      this.stateStore.delete(state);
      return null;
    }

    return storedState;
  }

  consumeState(state: string): OAuthState | null {
    const storedState = this.validateState(state);
    if (storedState) {
      this.stateStore.delete(state);
    }
    return storedState;
  }

  private cleanupExpiredStates(): void {
    const now = Date.now();
    for (const [state, stateData] of this.stateStore.entries()) {
      if (now > stateData.expires) {
        this.stateStore.delete(state);
      }
    }
  }
}
