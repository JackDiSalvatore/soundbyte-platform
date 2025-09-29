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
import { SocialLinksService } from '../services/profiles/social-links.service';

@ApiTags('Profiles')
@Controller('api/profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly socialLinksService: SocialLinksService,
  ) {}

  @Get('/providerId/:providerId/profile')
  @ApiResponse({ status: 200, description: 'Profile' })
  getProfile(@Param('providerId') providerId: string, @Req() req: Request) {
    // TODO
    return this.profilesService.findByProviderId(providerId);
  }

  @Get('/userId/:userId/profile')
  @ApiResponse({ status: 200, description: 'Profile' })
  async getProfileByUserId(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    const profile = await this.profilesService.findByUserId(userId);
    const genres = await this.profilesService.findGenresByUserId(userId);
    const subscriptions =
      await this.profilesService.findSubscriptionsByUserId(userId);
    const socials = await this.profilesService.findSocialLinksByUserId(userId);

    return {
      profile,
      subscriptions,
      genres,
      socials,
    };
  }

  @Post()
  create(@Body() dto: CreateProfileWithRelationsDto) {
    console.log('Creating Profile with');
    console.log(dto);

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
