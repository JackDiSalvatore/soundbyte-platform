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
import { UpdateProfileDto } from '../dto/profiles/update-profile.dto';
import { UpsertSubscriptionDto } from '../dto/profiles/upsert-subscription.dto';
import { CreateProfileDto } from '../dto';
import { CreateSocialLinkDto } from '../dto/profiles/create-social-link.dto';
import { CreateSubscriptionDto } from '../services/profiles/subscriptions.service';
import { UpsertProfileGenresDto } from '../dto/profiles/upsert-profile-genres.dto';

@ApiTags('Profiles')
@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  /**
   * GET users profile with provider ID
   * @param providerId Users ID on the provided streaming service (ex: SoundCloud ID)
   * @param req None
   * @returns a users profile
   */
  @Get('/providerId/:providerId')
  @ApiResponse({ status: 200, description: 'Profile' })
  getProfile(@Param('providerId') providerId: string, @Req() req: Request) {
    return this.profilesService.findByProviderId(providerId);
  }

  /**
   * GET users profile with User ID
   * @param userId Users SoundByte ID
   * @param req None
   * @returns a users full profile
   */
  @Get('/userId/:userId')
  @ApiResponse({ status: 200, description: 'Profile' })
  getProfileByUserId(@Param('userId') userId: string) {
    return this.profilesService.findByUserId(userId);
  }

  /**
   * GET users genres by User ID
   * @param userId SoundByte userId
   * @returns users geners
   */
  @Get('/userId/:userId/genres')
  @ApiResponse({ status: 200, description: 'User Genres' })
  findGenres(@Param('userId') userId: string) {
    return this.profilesService.findGenresByUserId(userId);
  }

  /**
   * GET users social links by User ID
   * @param userId SoundByte userId
   * @returns users genres
   */
  @Get('/userId/:userId/social-links')
  @ApiResponse({ status: 200, description: 'User Social Links' })
  findSocialLinks(@Param('userId') userId: string) {
    return this.profilesService.findSocialLinksByUserId(userId);
  }

  /**
   * GET users subscription information by User ID
   * @param userId SoundByte userId
   * @returns users genres
   */
  @Get('/userId/:userId/subscriptions')
  @ApiResponse({ status: 200, description: 'User Subscription' })
  findSubscriptions(@Param('userId') userId: string) {
    return this.profilesService.findSubscriptionByUserId(userId);
  }

  /**
   * POST /profiles/user/:userId/genres
   * @param userId
   * @param genreIds
   * @returns
   */
  @Post('/userId/:userId/genres')
  updateGenres(
    @Param('userId') userId: string,
    @Body() dto: UpsertProfileGenresDto,
  ) {
    console.log('Setting Genres to: ', dto);
    return this.profilesService.updateGenres(userId, dto.genreIds);
  }

  /**
   * POST /profiles/user/:userId/social-links
   * @param userId
   * @param links
   * @returns
   */
  @Post('/userId/:userId/social-links')
  updateSocialLinks(
    @Param('userId') userId: string,
    @Body() links: Record<string, string | null>,
  ) {
    return this.profilesService.updateSocialLinks(userId, links);
  }

  /**
   * POST /profiles/user/:userId/subscription
   */
  @Post('/userId/:userId/subscription')
  upsertSubscription(
    @Param('userId') userId: string,
    @Body() dto: UpsertSubscriptionDto,
  ) {
    return this.profilesService.upsertSubscription(userId, dto);
  }

  /**
   * POST a new user profile
   * @param dto users create profile
   * @returns users profile
   */
  @Post()
  createProfile(
    @Body()
    dto: CreateProfileDto,
  ) {
    console.log('Creating Profile: ', dto);

    return this.profilesService.create(dto);
  }

  /**
   * PATCH user profile
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
   * DELETE user profile + gernes + social links + subscription
   * @param id profile id
   * @returns deleted profile
   */
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.profilesService.remove(id);
  }
}
