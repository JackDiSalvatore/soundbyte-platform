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
      const limit = 100;

      const response = await fetch(
        `https://api.soundcloud.com/me/playlists?limit=${limit}&linked_partitioning=true&show_tracks=true`,
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
      console.error('Failed to fetch SoundCloud playlists:', error);
      throw new UnauthorizedException('Failed to fetch playlists');
    }
  }

  /**
   * Get user's SoundCloud tracks
   * GET /api/soundcloud/tracks
   */
  @Get('/userId/:userId/tracks')
  async getTracks(
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
      const limit = 100;

      const response = await fetch(
        `https://api.soundcloud.com/me/tracks?limit=${limit}&linked_partitioning=true`,
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
      console.error('Failed to fetch SoundCloud tracks:', error);
      throw new UnauthorizedException('Failed to fetch tracks');
    }
  }

  /**
   * Get user's SoundCloud tracks
   * GET /api/soundcloud/tracks
   */
  @Get('/userId/:userId/tracks/likes')
  async getLikedTracks(
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
      const limit = 10;

      const response = await fetch(
        `https://api.soundcloud.com/me/likes/tracks?limit=${limit}&linked_partitioning=true`,
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
      console.error('Failed to fetch SoundCloud liked tracks:', error);
      throw new UnauthorizedException('Failed to fetch liked tracks');
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
