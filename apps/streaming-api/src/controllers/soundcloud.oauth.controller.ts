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
import { SoundCloudOAuthService } from '../services/soundcloud-oauth-service';
import { ApiTags } from '@nestjs/swagger';
import { upsertCredentials } from '../db/provider-credentials';

@ApiTags('SoundCloudAuth')
@Controller('auth/soundcloud')
export class SoundCloudOAuthController {
  constructor(private readonly soundCloudService: SoundCloudOAuthService) {}

  @Get()
  async initiateAuth(
    @Query('returnTo') returnTo: string,
    @Req() req: Request & { session: {} },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const userId = req.query.userId as string;
      console.debug('userId: ', userId);

      const { url, state } = this.soundCloudService.buildAuthUrl(
        userId,
        returnTo,
      );

      if (!req.session) {
        throw new BadRequestException('Session not available');
      }

      req.session['soundcloudOauthState'] = state;

      res.redirect(url);
    } catch (error) {
      console.error('SoundCloud OAuth initiation error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to initiate SoundCloud OAuth flow',
      });
    }
  }

  @Get('callback')
  async handleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Query('error') error: string,
    @Req() req: Request & { session: {} },
    @Res() res: Response,
  ): Promise<void> {
    try {
      if (error) {
        const redirectUrl = this.buildErrorRedirect(error);
        return res.redirect(redirectUrl);
      }

      if (!code || !state) {
        throw new BadRequestException(
          'Missing authorization code or state parameter',
        );
      }

      const storedState = this.soundCloudService.validateOAuthState(state);

      if (!storedState) {
        throw new BadRequestException(
          'Invalid or expired state parameter - possible CSRF attack',
        );
      }

      if (!storedState.userId) {
        throw new BadRequestException('Missing User ID');
      }

      console.debug('cached storedState: ', storedState);

      if (req.session?.['soundcloudOauthState'] !== state) {
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
        throw new BadRequestException(
          'Failed to obtain SoundCloud access token',
        );
      }

      // Persist to DB here
      await upsertCredentials({
        userId: storedState.userId,
        provider: storedState.provider,
        token: {
          access_token: tokenResponse.access_token,
          token_type: tokenResponse.token_type,
          expires_in: tokenResponse.expires_in,
          refresh_token: tokenResponse.refresh_token,
          scope: tokenResponse.scope ?? '',
        },
      });

      this.soundCloudService.consumeState(state);
      delete req.session['soundcloudOauthState'];

      req.session['soundcloudToken'] = tokenResponse.access_token;
      req.session['soundcloudRefreshToken'] = tokenResponse.refresh_token;

      const redirectUrl = this.buildSuccessRedirect(
        storedState.originalUrl,
        'soundcloud',
      );
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('SoundCloud OAuth callback error:', error);

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
      provider: provider || 'soundcloud',
    });
    return `${frontendUrl}${redirectPath}?${params.toString()}`;
  }

  private buildErrorRedirect(error: string): string {
    const frontendUrl =
      process.env.FRONTEND_BASE_URL || 'http://127.0.0.1:3000';
    const params = new URLSearchParams({
      auth: 'error',
      error: error,
      provider: 'soundcloud',
    });
    return `${frontendUrl}/settings?${params.toString()}`;
  }
}
