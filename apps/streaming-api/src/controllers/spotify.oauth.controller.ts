import {
  Controller,
  Get,
  Req,
  Res,
  BadRequestException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SpotifyOAuthService } from '../services/spotify-oauth-service';
import type { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { upsertCredentials } from '../db/provider-credentials';

@ApiTags('SpotifyAuth')
@Controller('auth/spotify')
export class SpotifyOAuthController {
  constructor(private readonly spotifyService: SpotifyOAuthService) {}

  /**
   * Initiate Spotify OAuth flow
   * GET /auth/spotify
   */
  @Get()
  async initiateAuth(
    @Query('returnTo') returnTo: string,
    @Req() req: Request & { session: {} },
    @Res() res: Response,
  ): Promise<void> {
    console.log('Initiating Spotify OAuth flow');

    try {
      const userId = req.query.userId as string;
      console.debug('userId: ', userId);

      const { url, state } = this.spotifyService.buildAuthUrl(userId, returnTo);

      console.debug('state: ', state);

      if (!req.session) {
        throw new BadRequestException('Session not available');
      }

      req.session['spotifyOauthState'] = state;

      res.redirect(url);
    } catch (error) {
      console.error('Spotify OAuth initiation error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to initiate Spotify OAuth flow',
      });
    }
  }

  /**
   * Handle Spotify OAuth callback
   * GET /auth/spotify/callback
   */
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Req() req: Request & { session: {} },
    @Res() res: Response,
  ): Promise<void> {
    console.log('Handling Spotify OAuth callback');

    try {
      if (error) {
        const redirectUrl = this.buildErrorRedirect(error);
        res.redirect(redirectUrl);
        return;
      }

      if (!code || !state) {
        throw new BadRequestException(
          'Missing authorization code or state parameter',
        );
      }

      // Verify state parameter (CSRF protection)
      const storedState = this.spotifyService.validateOAuthState(state);

      if (!storedState) {
        throw new BadRequestException(
          'Invalid or expired state parameter - possible CSRF attack',
        );
      }

      if (!storedState.userId) {
        throw new BadRequestException('Missing User ID');
      }

      console.debug('cached storedState: ', storedState);

      // Additional check: verify state matches session
      if (req.session?.['spotifyOauthState'] !== state) {
        throw new BadRequestException(
          'State parameter mismatch - possible CSRF attack',
        );
      }

      // Exchange authorization code for access token
      const tokenResponse =
        await this.spotifyService.exchangeCodeForToken(code);

      console.debug('tokenResponse: ', tokenResponse);

      if (!tokenResponse.access_token) {
        throw new BadRequestException('Failed to obtain Spotify access token');
      }

      // Persist to DB here
      await upsertCredentials({
        userId: storedState.userId,
        provider: storedState.provider,
        accessToken: tokenResponse.access_token,
        tokenType: tokenResponse.token_type,
        expiresIn: tokenResponse.expires_in,
        refreshToken: tokenResponse.refresh_token,
        scope: tokenResponse.scope,
      });

      // Get user profile to store additional info
      const userProfile = await this.spotifyService.getUserProfile(
        tokenResponse.access_token,
      );

      console.debug('userProfile: ', JSON.stringify(userProfile, null, 2));

      // Consume state to prevent reuse
      this.spotifyService.consumeState(state);
      delete req.session['spotifyOauthState'];

      // Store tokens and profile info securely in session
      req.session['spotifyToken'] = tokenResponse.access_token;
      req.session['spotifyRefreshToken'] = tokenResponse.refresh_token; // Might not need this
      req.session['spotifyProfile'] = {
        id: userProfile.id,
        displayName: userProfile.display_name,
        email: userProfile.email,
      };

      // Calculate token expiration
      if (tokenResponse.expires_in) {
        req.session['spotifyTokenExpires'] =
          Date.now() + tokenResponse.expires_in * 1000;
      }

      console.debug('req.session: ', req.session);

      // Redirect to original URL or default success page
      const redirectUrl = this.buildSuccessRedirect(
        storedState.originalUrl,
        'spotify',
      );

      console.log('redirectUrl: ', redirectUrl);

      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Spotify OAuth callback error:', error);

      const redirectUrl =
        error instanceof BadRequestException
          ? this.buildErrorRedirect(error.message)
          : this.buildErrorRedirect('OAuth callback processing failed');

      res.redirect(redirectUrl);
    }
  }

  private buildSuccessRedirect(
    originalUrl?: string,
    provider?: string,
  ): string {
    const frontendUrl =
      process.env.FRONTEND_BASE_URL || 'http://127.0.0.1:3000';
    const redirectPath = originalUrl || '/settings'; // Default to settings page

    const params = new URLSearchParams({
      auth: 'success',
      provider: provider || 'spotify',
    });
    return `${frontendUrl}${redirectPath}?${params.toString()}`;
  }

  private buildErrorRedirect(error: string): string {
    const frontendUrl =
      process.env.FRONTEND_BASE_URL || 'http://127.0.0.1:3000';
    const params = new URLSearchParams({
      auth: 'error',
      error: error,
      provider: 'spotify',
    });
    return `${frontendUrl}/settings?${params.toString()}`;
  }
}
