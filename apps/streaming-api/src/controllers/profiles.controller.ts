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

  /**
   * Get users profile with provider ID
   * @param providerId Users ID on the provided streaming service (ex: SoundCloud ID)
   * @param req None
   * @returns a users profile
   */
  @Get('/providerId/:providerId/profile')
  @ApiResponse({ status: 200, description: 'Profile' })
  getProfile(@Param('providerId') providerId: string, @Req() req: Request) {
    return this.profilesService.findByProviderId(providerId);
  }

  /**
   * Get users profile with User ID
   * @param userId Users SoundByte ID
   * @param req None
   * @returns a users full profile
   */
  @Get('/userId/:userId/profile')
  @ApiResponse({ status: 200, description: 'Profile' })
  getProfileByUserId(@Param('userId') userId: string, @Req() req: Request) {
    return this.profilesService.findByUserId(userId);
  }

  /**
   * Get genres by User ID
   * @param userId SoundByte userId
   * @returns users geners
   */
  @Get('userId/:userId/genres')
  findGenres(@Param('userId') userId: string) {
    return this.profilesService.findGenresByUserId(userId);
  }

  /**
   * Get social links by User ID
   * @param userId SoundByte userId
   * @returns users genres
   */
  @Get('userId/:userId/social-links')
  findSocialLinks(@Param('userId') userId: string) {
    return this.profilesService.findSocialLinksByUserId(userId);
  }

  /**
   * Get subscriptions information by User ID
   * @param userId SoundByte userId
   * @returns users genres
   */
  @Get('userId/:userId/subscriptions')
  findSubscriptions(@Param('userId') userId: string) {
    return this.profilesService.findSubscriptionsByUserId(userId);
  }

  /**
   * Create a new user profile
   * @param dto users full profile
   * @returns users full profile
   */
  @Post()
  create(@Body() dto: CreateProfileWithRelationsDto) {
    console.log('Creating Profile with');
    console.log(dto);

    return this.profilesService.createWithRelations(dto);
  }

  /**
   * Update user profile
   * @param id profile id
   * @param dto users profile
   * @returns updated profile
   */
  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(id, dto);
  }

  /**
   * Delete user profile
   * @param id profile id
   * @returns deleted profile
   */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.profilesService.remove(id);
  }
}
