import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';

@Controller('api/soundcloud')
export class SoundCloudApiController {
  constructor() {}

  /**
   * Get user's SoundCloud profile
   * GET /api/soundcloud/profile
   */
  @Get('profile')
  async getProfile(
    @Req() req: Request & { session: { soundcloudToken: string } },
  ): Promise<any> {
    const token = req.session?.['soundcloudToken'];

    if (!token) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      const response = await fetch('https://api.soundcloud.com/me', {
        headers: {
          Authorization: `Bearer ${token}`,
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
