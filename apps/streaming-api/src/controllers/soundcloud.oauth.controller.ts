import {
  Controller,
  Get,
  Req,
  Res,
  BadRequestException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { SoundCloudOAuthService } from '../lib/soundcloud-oauth-service';

@Controller('auth/soundcloud')
export class SoundCloudOAuthController {
  constructor(private readonly soundCloudService: SoundCloudOAuthService) {}

  /**
   * Initiate OAuth flow - redirect to SoundCloud
   * GET /auth/soundcloud
   */
  @Get()
  async initiateAuth(
    @Query('returnTo') returnTo: string,
    @Req() req: Request & { session: { user: { id: string } } },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.session?.['user'].id;

      console.log('userId: ', userId);

      const { url, state } = this.soundCloudService.buildAuthUrl(
        userId,
        returnTo,
      );

      // Store state in session as additional security measure
      if (!req.session) {
        throw new BadRequestException('Session not available');
      }

      req.session['oauthState'] = state;

      res.redirect(url);
    } catch (error) {
      console.error('OAuth initiation error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to initiate OAuth flow',
      });
    }
  }

  /**
   * Handle OAuth callback from SoundCloud
   * GET /auth/soundcloud/callback
   */
  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Req() req: Request & { session: { user: { id: string } } },
    @Res() res: Response,
  ): Promise<void> {
    try {
      // Check for OAuth errors
      if (error) {
        res.status(HttpStatus.BAD_REQUEST).json({
          error: 'OAuth authorization failed',
          details: error,
        });
        return;
      }

      if (!code || !state) {
        throw new BadRequestException(
          'Missing authorization code or state parameter',
        );
      }

      // Verify state parameter (CSRF protection)
      const storedState = this.soundCloudService.validateOAuthState(state);
      if (!storedState) {
        throw new BadRequestException(
          'Invalid or expired state parameter - possible CSRF attack',
        );
      }

      // Additional check: verify state matches session
      if (req.session?.['oauthState'] !== state) {
        throw new BadRequestException(
          'State parameter mismatch - possible CSRF attack',
        );
      }

      // Exchange authorization code for access token
      const tokenResponse = await this.soundCloudService.exchangeCodeForToken(
        code,
        storedState.codeVerifier,
      );

      if (!tokenResponse.access_token) {
        throw new BadRequestException('Failed to obtain access token');
      }

      // Consume state to prevent reuse
      this.soundCloudService.consumeState(state);
      delete req.session['oauthState'];

      // Store token securely in session
      req.session['soundcloudToken'] = tokenResponse.access_token;
      req.session['soundcloudRefreshToken'] = tokenResponse.refresh_token;

      // Redirect to original URL or default success page
      const redirectUrl = storedState.originalUrl || '/dashboard';
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('OAuth callback error:', error);

      if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          error: 'OAuth callback processing failed',
        });
      }
    }
  }
}
