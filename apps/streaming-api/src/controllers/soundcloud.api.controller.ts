import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CredentialService } from '../services/credential-service';

@ApiTags('SoundCloudApi')
@Controller('api/soundcloud')
export class SoundCloudApiController {
  constructor(private readonly credentialService: CredentialService) {}

  // Normalize various SoundCloud response shapes into a consistent
  // { collection, next_href? } object so frontend can rely on a single shape.
  private normalizeSoundCloudResponse(data: any) {
    if (!data) return { collection: [], next_href: undefined };

    // If SoundCloud already returned a paginated object
    if (data.collection || data.next_href || data.nextHref) {
      return {
        collection: data.collection ?? data.items ?? [],
        next_href: data.next_href ?? data.nextHref,
      };
    }

    // If the response was an array of items
    if (Array.isArray(data)) {
      return { collection: data, next_href: undefined };
    }

    // Fallback: if it's an object with items
    if (data.items && Array.isArray(data.items)) {
      return {
        collection: data.items,
        next_href: data.next_href ?? data.nextHref,
      };
    }

    // Otherwise wrap the value as a single-item collection
    return { collection: [data], next_href: undefined };
  }

  /**
   * Get user's SoundCloud profile
   * GET /api/soundcloud/profile
   */
  @Get('/userId/:userId/profile')
  async getProfile(@Param('userId') userId: string): Promise<any> {
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
   * Supports cursor-based pagination using next_href.
   * If nextHref is provided as a query param, it will be used directly.
   */
  @Get('/userId/:userId/playlists')
  @ApiQuery({
    name: 'next_href',
    required: false,
    type: String,
    description: 'Optional pagination',
  })
  async getPlaylists(
    @Param('userId') userId: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      let url: string;
      const DEFAULT_LIMIT = 100;
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(limitRaw)) || DEFAULT_LIMIT),
      );

      if (nextHref) {
        // Use the provided next_href for pagination
        url = nextHref;
      } else {
        // Initial request
        const baseUrl = new URL('https://api.soundcloud.com/me/playlists');
        baseUrl.searchParams.set('limit', String(limit));
        baseUrl.searchParams.set('linked_partitioning', 'true');
        baseUrl.searchParams.set('show_tracks', 'true');
        url = baseUrl.toString();
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      const data = await response.json();

      // Normalize to { collection, next_href? }
      return this.normalizeSoundCloudResponse(data);
    } catch (error) {
      console.error('Failed to fetch SoundCloud playlists:', error);
      throw new UnauthorizedException('Failed to fetch playlists');
    }
  }

  /**
   * Get user's SoundCloud tracks
   * GET /api/soundcloud/tracks
   * Supports cursor-based pagination using next_href.
   * If nextHref is provided as a query param, it will be used directly.
   */
  @Get('/userId/:userId/tracks')
  @ApiQuery({
    name: 'next_href',
    required: false,
    type: String,
    description: 'Optional pagination',
  })
  async getTracks(
    @Param('userId') userId: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      let url: string;
      const DEFAULT_LIMIT = 100;
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(limitRaw)) || DEFAULT_LIMIT),
      );

      if (nextHref) {
        // Use the provided next_href for pagination
        url = nextHref;
      } else {
        // Initial request
        const baseUrl = new URL('https://api.soundcloud.com/me/tracks');
        baseUrl.searchParams.set('limit', String(limit));
        baseUrl.searchParams.set('linked_partitioning', 'true');
        url = baseUrl.toString();
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      const data = await response.json();

      return this.normalizeSoundCloudResponse(data);
    } catch (error) {
      console.error('Failed to fetch SoundCloud tracks:', error);
      throw new UnauthorizedException('Failed to fetch tracks');
    }
  }

  /**
   * Get user's SoundCloud liked tracks
   * GET /api/soundcloud/tracks/likes
   * Supports cursor-based pagination using next_href.
   * If nextHref is provided as a query param, it will be used directly.
   */
  @Get('/userId/:userId/tracks/likes')
  @ApiQuery({
    name: 'next_href',
    required: false,
    type: String,
    description: 'Optional pagination',
  })
  async getLikedTracks(
    @Param('userId') userId: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      let url: string;
      const DEFAULT_LIMIT = 10;
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(limitRaw)) || DEFAULT_LIMIT),
      );

      if (nextHref) {
        // Use the provided next_href for pagination
        url = nextHref;
      } else {
        // Initial request
        const baseUrl = new URL('https://api.soundcloud.com/me/likes/tracks');
        baseUrl.searchParams.set('limit', String(limit));
        baseUrl.searchParams.set('linked_partitioning', 'true');
        url = baseUrl.toString();
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      const data = await response.json();

      return this.normalizeSoundCloudResponse(data);
    } catch (error) {
      console.error('Failed to fetch SoundCloud liked tracks:', error);
      throw new UnauthorizedException('Failed to fetch liked tracks');
    }
  }

  /**
   * Get user's SoundCloud tracks
   * GET /api/soundcloud/tracks
   * Supports cursor-based pagination using next_href.
   * If nextHref is provided as a query param, it will be used directly.
   */
  @Get('/userId/:userId/tracks/search/:searchTerm')
  @ApiQuery({
    name: 'next_href',
    required: false,
    type: String,
    description: 'Optional pagination',
  })
  async searchTracks(
    @Param('userId') userId: string,
    @Param('searchTerm') searchTerm: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      let url: string;
      const DEFAULT_LIMIT = 25;
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(limitRaw)) || DEFAULT_LIMIT),
      );

      if (nextHref) {
        // Use the provided next_href for pagination
        url = nextHref;
      } else {
        // Initial request
        const baseUrl = new URL('https://api.soundcloud.com/tracks');
        baseUrl.searchParams.set('limit', String(limit));
        baseUrl.searchParams.set('linked_partitioning', 'true');
        baseUrl.searchParams.set('q', String(searchTerm)); // search string
        // baseUrl.searchParams.set('ids', String('')); // example: `1,2,3`
        // baseUrl.searchParams.set('urns', String('')); // example: `soundcloud:tracks:1,soundcloud:tracks:2`
        // baseUrl.searchParams.set('genres', String('')); // example: `Pop,House`
        // baseUrl.searchParams.set('tags', String('')); //
        // baseUrl.searchParams.set(
        //   'bpm',
        //   Object({ from: Number(), to: Number() }),
        // );
        // baseUrl.searchParams.set(
        //   'durration',
        //   Object({ from: Number(), to: Number() }),
        // );
        // baseUrl.searchParams.set(
        //   'created_at',
        //   Object({ from: Number(), to: Number() }),
        // );
        // baseUrl.searchParams.set(
        //   'created_at',
        //   Object({ from: Number(), to: Number() }),
        // );

        url = baseUrl.toString();
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      const data = await response.json();
      return this.normalizeSoundCloudResponse(data);
    } catch (error) {
      console.error('Failed to search SoundCloud tracks:', error);
      throw new UnauthorizedException('Failed to find tracks');
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
