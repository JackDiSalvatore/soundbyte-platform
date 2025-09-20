import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CredentialService } from '../services/credential-service';

@ApiTags('SoundCloudApi')
@Controller('api/soundcloud')
export class SoundCloudApiController {
  constructor(private readonly credentialService: CredentialService) {}

  /**
   * Get user's SoundCloud profile
   * GET /api/soundcloud/profile
   */
  @Get('/userId/:userId/profile')
  async getProfile(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      const response = await fetch('https://api.soundcloud.com/me', {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch SoundCloud profile:', error);
      throw new UnauthorizedException('Failed to fetch profile');
    }
  }

  /**
   * Get user's SoundCloud playlists
   * GET /api/soundcloud/playlists
   */
  @Get('/userId/:userId/playlists')
  async getPlaylists(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      const response = await fetch(
        'https://api.soundcloud.com/me/playlists?show_tracks=true',
        {
          headers: {
            Authorization: `Bearer ${credentials.accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch SoundCloud profile:', error);
      throw new UnauthorizedException('Failed to fetch profile');
    }
  }

  /**
   * Get authentication status
   * GET /api/soundcloud/status
   */
  @Get('status')
  getAuthStatus(
    @Req() req: Request & { session: { soundcloudToken: string } },
  ): any {
    const hasToken = !!req.session?.['soundcloudToken'];

    return {
      authenticated: hasToken,
      soundcloudConnected: hasToken,
    };
  }
}
