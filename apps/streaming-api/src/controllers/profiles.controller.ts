import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from '../services/profiles/profiles.service';
import { CreateProfileWithRelationsDto } from '../dto/create-profile-with-relations.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@ApiTags('Profiles')
@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('/providerId/:providerId/profile')
  @ApiResponse({ status: 200, description: 'Profile' })
  getProfile(@Param('providerId') providerId: string, @Req() req: Request) {
    // TODO
    return {};
  }

  @Get('/userId/:userId/profile')
  @ApiResponse({ status: 200, description: 'Profile' })
  getProfileByUserId(@Param('userId') userId: string, @Req() req: Request) {
    // TODO: mock data
    return {
      profile: {
        userId: 'user_123',
        providerId: 'soundcloud_abc',
        email: 'user@example.com',
        verified: true,
        public: true,
      },
      subscription: {
        plan: 'pro',
        membership: 'monthly',
        expiresAt: '2025-12-31T00:00:00.000Z',
      },
      genres: [1, 3, 5],
      socials: [
        { platform: 'twitter', url: 'https://twitter.com/user' },
        { platform: 'spotify', url: 'https://open.spotify.com/artist/123' },
      ],
    };
  }
  @Post()
  create(@Body() dto: CreateProfileWithRelationsDto) {
    return this.profilesService.createWithRelations(dto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.profilesService.remove(id);
  }
}
