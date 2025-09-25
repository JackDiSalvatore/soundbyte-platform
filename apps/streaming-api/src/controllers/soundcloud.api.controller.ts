import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CredentialService } from '../services/credential-service';

interface NormalizedResponse<T = any> {
  collection: T[];
  next_href?: string;
}

@ApiTags('SoundCloudApi')
@Controller('api/soundcloud')
export class SoundCloudApiController {
  constructor(private readonly credentialService: CredentialService) {}

  private DEFAULT_LIMITS = {
    playlists: 100,
    tracks: 100,
    likes: 10,
    search: 25,
  };

  private async fetchFromSoundCloud<T>(
    userId: string,
    url: string,
  ): Promise<T> {
    const credentials = await this.credentialService.getCredentials({
      userId,
      provider: 'soundcloud',
    });

    if (!credentials) {
      throw new UnauthorizedException('Not authenticated with SoundCloud');
    }

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    });

    if (response.status === 401) {
      throw new UnauthorizedException('Invalid or expired SoundCloud token');
    }

    if (response.status === 404) {
      throw new NotFoundException('SoundCloud resource not found');
    }

    if (!response.ok) {
      throw new InternalServerErrorException(
        `SoundCloud API error: ${response.statusText}`,
      );
    }

    return response.json();
  }

  private normalize<T = any>(data: any): NormalizedResponse<T> {
    if (!data) return { collection: [] };

    if (Array.isArray(data)) return { collection: data };

    if (data.collection || data.items) {
      return {
        collection: data.collection ?? data.items ?? [],
        next_href: data.next_href ?? data.nextHref,
      };
    }

    if (data.items && Array.isArray(data.items)) {
      return {
        collection: data.items,
        next_href: data.next_href ?? data.nextHref,
      };
    }

    return { collection: [data] };
  }

  private buildUrl(
    base: string,
    nextHref?: string,
    limit?: number,
    extraParams?: Record<string, string>,
  ): string {
    if (nextHref) return nextHref;

    const url = new URL(base);
    url.searchParams.set('linked_partitioning', 'true');
    if (limit) url.searchParams.set('limit', String(limit));
    if (extraParams) {
      Object.entries(extraParams).forEach(([k, v]) =>
        url.searchParams.set(k, v),
      );
    }
    return url.toString();
  }

  /** ----------- Endpoints ----------- **/

  @Get('/userId/:userId/users/:providerUserId')
  @ApiResponse({ status: 200, description: 'User' })
  async getUser(
    @Param('userId') userId: string,
    @Param('providerUserId') providerUserId: string,
  ): Promise<any> {
    const url = `https://api.soundcloud.com/users/soundcloud:users:${providerUserId}`;
    return this.fetchFromSoundCloud(userId, url);
  }

  @Get('/userId/:userId/users/:providerUserId/tracks')
  @ApiResponse({ status: 200, description: 'User' })
  async getUserTracks(
    @Param('userId') userId: string,
    @Param('providerUserId') providerUserId: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<any> {
    const limit = parseInt(limitRaw || '') || this.DEFAULT_LIMITS.tracks;
    const url = this.buildUrl(
      `https://api.soundcloud.com/users/soundcloud:users:${providerUserId}/tracks`,
      nextHref,
      limit,
      { show_tracks: 'true' },
    );
    return this.fetchFromSoundCloud(userId, url);
  }

  @Get('/userId/:userId/tracks/:providerTrackId')
  @ApiResponse({ status: 200, description: 'Track' })
  async getTrack(
    @Param('userId') userId: string,
    @Param('providerTrackId') providerTrackId: string,
  ): Promise<any> {
    const url = `https://api.soundcloud.com/tracks/soundcloud:tracks:${providerTrackId}`;
    return this.fetchFromSoundCloud(userId, url);
  }

  @Get('/userId/:userId/tracks/:providerTrackId/comments')
  @ApiResponse({ status: 200, description: 'User' })
  async getTrackComments(
    @Param('userId') userId: string,
    @Param('providerTrackId') providerTrackId: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<any> {
    const limit = parseInt(limitRaw || '') || this.DEFAULT_LIMITS.tracks;
    const url = this.buildUrl(
      `https://api.soundcloud.com/tracks/soundcloud:tracks:${providerTrackId}/comments`,
      nextHref,
      limit,
      { show_tracks: 'true' },
    );
    return this.fetchFromSoundCloud(userId, url);
  }

  @Get('/userId/:userId/profile')
  @ApiResponse({ status: 200, description: 'User profile' })
  async getProfile(@Param('userId') userId: string): Promise<any> {
    const url = 'https://api.soundcloud.com/me';
    return this.fetchFromSoundCloud(userId, url);
  }

  @Get('/userId/:userId/playlists')
  @ApiQuery({ name: 'next_href', required: false })
  async getPlaylists(
    @Param('userId') userId: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<NormalizedResponse> {
    const limit = parseInt(limitRaw || '') || this.DEFAULT_LIMITS.playlists;

    const url = this.buildUrl(
      'https://api.soundcloud.com/me/playlists',
      nextHref,
      limit,
      { show_tracks: 'true' },
    );

    const data = await this.fetchFromSoundCloud(userId, url);
    return this.normalize(data);
  }

  @Get('/userId/:userId/tracks')
  @ApiQuery({ name: 'next_href', required: false })
  async getTracks(
    @Param('userId') userId: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<NormalizedResponse> {
    const limit = parseInt(limitRaw || '') || this.DEFAULT_LIMITS.tracks;

    const url = this.buildUrl(
      'https://api.soundcloud.com/me/tracks',
      nextHref,
      limit,
    );

    const data = await this.fetchFromSoundCloud(userId, url);
    return this.normalize(data);
  }

  @Get('/userId/:userId/tracks/likes')
  @ApiQuery({ name: 'next_href', required: false })
  async getLikedTracks(
    @Param('userId') userId: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<NormalizedResponse> {
    const limit = parseInt(limitRaw || '') || this.DEFAULT_LIMITS.likes;

    const url = this.buildUrl(
      'https://api.soundcloud.com/me/likes/tracks',
      nextHref,
      limit,
    );

    const data = await this.fetchFromSoundCloud(userId, url);
    return this.normalize(data);
  }

  @Get('/userId/:userId/tracks/search/:searchTerm')
  @ApiQuery({ name: 'next_href', required: false })
  async searchTracks(
    @Param('userId') userId: string,
    @Param('searchTerm') searchTerm: string,
    @Query('limit') limitRaw?: string,
    @Query('next_href') nextHref?: string,
  ): Promise<NormalizedResponse> {
    const limit = parseInt(limitRaw || '') || this.DEFAULT_LIMITS.search;

    const url = this.buildUrl(
      'https://api.soundcloud.com/tracks',
      nextHref,
      limit,
      { q: searchTerm },
    );

    const data = await this.fetchFromSoundCloud(userId, url);
    return this.normalize(data);
  }

  @Get('status')
  getAuthStatus(
    @Req() req: Request & { session: { soundcloudToken?: string } },
  ) {
    const authenticated = !!req.session?.soundcloudToken;
    return {
      authenticated,
      soundcloudConnected: authenticated,
    };
  }
}
