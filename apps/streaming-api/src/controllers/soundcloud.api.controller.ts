import {
  Body,
  Controller,
  Get,
  Param,
  Query,
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
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      // parse pagination params
      const DEFAULT_LIMIT = 100;
      const page = Math.max(1, parseInt(String(pageRaw)) || 1);
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(limitRaw)) || DEFAULT_LIMIT),
      );

      // SoundCloud supports linked_partitioning with next_href for cursor-style pagination.
      // But it also accepts offset param for basic offset pagination in many endpoints.
      const offset = (page - 1) * limit;

      const url = new URL('https://api.soundcloud.com/me/playlists');
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('linked_partitioning', 'true');
      url.searchParams.set('show_tracks', 'true');
      // include offset to support predictable paging if SoundCloud accepts it
      url.searchParams.set('offset', String(offset));

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      const data = await response.json();

      // If SoundCloud returned a collection with pagination (collection + next_href), return as-is
      if (data && (data.collection || data.next_href)) {
        return data;
      }

      // Fallback: ensure we return items and pagination metadata
      const items = Array.isArray(data) ? data : data.items || [];
      const total = items.length;

      return {
        collection: items,
        pagination: {
          page,
          limit,
          offset,
          total,
          // note: SoundCloud may not provide total_count reliably
        },
      };
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
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      const DEFAULT_LIMIT = 100;
      const page = Math.max(1, parseInt(String(pageRaw)) || 1);
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(limitRaw)) || DEFAULT_LIMIT),
      );
      const offset = (page - 1) * limit;

      const url = new URL('https://api.soundcloud.com/me/tracks');
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('linked_partitioning', 'true');
      url.searchParams.set('offset', String(offset));

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      const data = await response.json();

      if (data && (data.collection || data.next_href)) {
        return data;
      }

      const items = Array.isArray(data) ? data : data.items || [];
      const total = items.length;

      return {
        collection: items,
        pagination: {
          page,
          limit,
          offset,
          total,
        },
      };
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
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      const DEFAULT_LIMIT = 10;
      const page = Math.max(1, parseInt(String(pageRaw)) || 1);
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(limitRaw)) || DEFAULT_LIMIT),
      );
      const offset = (page - 1) * limit;

      const url = new URL('https://api.soundcloud.com/me/likes/tracks');
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('linked_partitioning', 'true');
      url.searchParams.set('offset', String(offset));

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      const data = await response.json();

      if (data && (data.collection || data.next_href)) {
        return data;
      }

      const items = Array.isArray(data) ? data : data.items || [];
      const total = items.length;

      return {
        collection: items,
        pagination: {
          page,
          limit,
          offset,
          total,
        },
      };
    } catch (error) {
      console.error('Failed to fetch SoundCloud liked tracks:', error);
      throw new UnauthorizedException('Failed to fetch liked tracks');
    }
  }

  /**
   * Get user's SoundCloud tracks
   * GET /api/soundcloud/tracks
   */
  @Get('/userId/:userId/tracks/search/:searchTerm')
  async searchTracks(
    @Param('userId') userId: string,
    @Param('searchTerm') searchTerm: string,
    @Req() req: Request,
    @Query('page') pageRaw?: string,
    @Query('limit') limitRaw?: string,
  ): Promise<any> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    try {
      const DEFAULT_LIMIT = 10;
      const page = Math.max(1, parseInt(String(pageRaw)) || 1);
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(limitRaw)) || DEFAULT_LIMIT),
      );
      const offset = (page - 1) * limit;

      const url = new URL('https://api.soundcloud.com/tracks');
      url.searchParams.set('limit', String(limit));
      url.searchParams.set('offset', String(offset));
      url.searchParams.set('linked_partitioning', 'true');
      url.searchParams.set('q', String(searchTerm)); // search string

      /*
      url.searchParams.set('ids', String('')); // example: `1,2,3`
      url.searchParams.set('urns', String('')); // example: `soundcloud:tracks:1,soundcloud:tracks:2`
      url.searchParams.set('genres', String('')); // example: `Pop,House`
      url.searchParams.set('tags', String('')); //
      url.searchParams.set('bpm', Object({ from: Number(), to: Number() }));
      url.searchParams.set(
        'durration',
        Object({ from: Number(), to: Number() }),
      );
      url.searchParams.set(
        'created_at',
        Object({ from: Number(), to: Number() }),
      );
      url.searchParams.set(
        'created_at',
        Object({ from: Number(), to: Number() }),
      );
      */

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${credentials.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new UnauthorizedException('Invalid SoundCloud token');
      }

      const data = await response.json();

      if (data && (data.collection || data.next_href)) {
        return data;
      }

      const items = Array.isArray(data) ? data : data.items || [];
      const total = items.length;

      return {
        collection: items,
        pagination: {
          page,
          limit,
          offset,
          total,
        },
      };
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
