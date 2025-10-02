import {
  Body,
  Controller,
  Get,
  Param,
  Req,
  Post,
  Patch,
  Delete,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from '../services/profiles/profiles.service';
import { CreateProfileWithRelationsDto } from '../dto/profiles/create-profile-with-relations.dto';
import { UpdateProfileDto } from '../dto/profiles/update-profile.dto';
import { UpsertSubscriptionDto } from '../dto/profiles/upsert-subscription.dto';

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
   * Get users genres by User ID
   * @param userId SoundByte userId
   * @returns users geners
   */
  @Get('userId/:userId/genres')
  findGenres(@Param('userId') userId: string) {
    return this.profilesService.findGenresByUserId(userId);
  }

  /**
   * Get users social links by User ID
   * @param userId SoundByte userId
   * @returns users genres
   */
  @Get('userId/:userId/social-links')
  findSocialLinks(@Param('userId') userId: string) {
    return this.profilesService.findSocialLinksByUserId(userId);
  }

  /**
   * Get users subscription information by User ID
   * @param userId SoundByte userId
   * @returns users genres
   */
  @Get('userId/:userId/subscriptions')
  findSubscriptions(@Param('userId') userId: string) {
    return this.profilesService.findSubscriptionByUserId(userId);
  }

  /**
   * PATCH /profiles/user/:userId/genres
   * @param userId
   * @param genreIds
   * @returns
   */
  @Patch('user/:userId/genres')
  updateGenres(
    @Param('userId') userId: string,
    @Body('genreIds') genreIds: number[],
  ) {
    return this.profilesService.updateGenres(userId, genreIds);
  }

  /**
   * PATCH /profiles/user/:userId/social-links
   * @param userId
   * @param links
   * @returns
   */
  @Patch('user/:userId/social-links')
  updateSocialLinks(
    @Param('userId') userId: string,
    @Body() links: Record<string, string | null>,
  ) {
    return this.profilesService.updateSocialLinks(userId, links);
  }

  /**
   * PATCH /profiles/user/:userId/subscription
   */
  @Patch('user/:userId/subscription')
  upsertSubscription(
    @Param('userId') userId: string,
    @Body(new ValidationPipe({ transform: true })) dto: UpsertSubscriptionDto,
  ) {
    return this.profilesService.upsertSubscription(userId, dto);
  }

  /**
   * Create a new user profile
   * @param dto users full profile
   * @returns users full profile
   */
  @Post()
  create(
    @Body(new ValidationPipe({ transform: true }))
    dto: CreateProfileWithRelationsDto,
  ) {
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
  update(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true })) dto: UpdateProfileDto,
  ) {
    return this.profilesService.update(id, dto);
  }

  /**
   * Delete user profile + gernes + social links + subscription
   * @param id profile id
   * @returns deleted profile
   */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.profilesService.remove(id);
  }
}
