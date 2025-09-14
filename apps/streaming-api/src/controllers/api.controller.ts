import { Controller, Get, Req, UnauthorizedException } from '@nestjs/common';
import { SpotifyOAuthService } from '../services/spotify-oauth-service';
import { ApiTags } from '@nestjs/swagger';

// Combined API Controller for both providers
@ApiTags('api')
@Controller('api')
export class StreamingProviderApiController {
  constructor(private readonly spotifyService: SpotifyOAuthService) {}

  @Get()
  getInfo(@Req() req: Request) {
    return 'Hello World!';
  }

  /**
   * Get Spotify user profile
   * GET /api/spotify/profile
   */
  @Get('spotify/profile')
  async getSpotifyProfile(
    @Req() req: Request & { session: { user: { id: string } } },
  ): Promise<any> {
    const token = req.session?.['spotifyToken'];

    if (!token) {
      throw new UnauthorizedException('Not authenticated with Spotify');
    }

    try {
      // Check if token is expired and refresh if needed
      const tokenExpires = req.session?.['spotifyTokenExpires'];
      if (tokenExpires && Date.now() > tokenExpires) {
        const refreshToken = req.session?.['spotifyRefreshToken'];
        if (refreshToken) {
          const newTokens =
            await this.spotifyService.refreshToken(refreshToken);
          req.session['spotifyToken'] = newTokens.access_token;
          req.session['spotifyTokenExpires'] =
            Date.now() + newTokens.expires_in * 1000;
        }
      }

      return await this.spotifyService.getUserProfile(
        req.session['spotifyToken'],
      );
    } catch (error) {
      console.error('Failed to fetch Spotify profile:', error);
      throw new UnauthorizedException('Failed to fetch Spotify profile');
    }
  }

  /**
   * Get Spotify authentication status
   * GET /api/spotify/status
   */
  @Get('spotify/status')
  getSpotifyAuthStatus(
    @Req() req: Request & { session: { user: { id: string } } },
  ): any {
    const hasToken = !!req.session?.['spotifyToken'];

    return {
      connected: hasToken,
      provider: 'spotify',
      profile: hasToken ? req.session['spotifyProfile'] : null,
    };
  }

  /**
   * Get SoundCloud authentication status
   * GET /api/soundcloud/status
   */
  @Get('soundcloud/status')
  getSoundCloudAuthStatus(
    @Req() req: Request & { session: { user: { id: string } } },
  ): any {
    const hasToken = !!req.session?.['soundcloudToken'];

    return {
      connected: hasToken,
      provider: 'soundcloud',
    };
  }
}
