import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { ProfilesController } from '../controllers/profiles.controller';
import { GenresService } from '../services/profiles/genres.service';
import { ProfilesService } from '../services/profiles/profiles.service';
import { SocialLinksService } from '../services/profiles/social-links.service';
import { SubscriptionsService } from '../services/profiles/subscriptions.service';
import { GenresController } from '../controllers/genres.controller';

@Module({
  imports: [ConfigModule],
  controllers: [ProfilesController, GenresController],
  providers: [
    ProfilesService,
    GenresService,
    SocialLinksService,
    SubscriptionsService,
  ],
  exports: [
    ProfilesService,
    GenresService,
    SocialLinksService,
    SubscriptionsService,
  ],
})
export class ProfileModule {}
