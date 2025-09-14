import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoundCloudOAuthController } from '../controllers/soundcloud.oauth.controller';
import { SoundCloudApiController } from '../controllers/soundcloud.api.controller';
import { OAuthCSRFService } from '../lib/oauth-csrf-service';
import { SoundCloudOAuthService } from '../lib/soundcloud-oauth-service';

@Module({
  imports: [ConfigModule],
  controllers: [SoundCloudOAuthController, SoundCloudApiController],
  providers: [OAuthCSRFService, SoundCloudOAuthService],
  exports: [OAuthCSRFService, SoundCloudOAuthService],
})
export class SoundCloudOAuthModule {}
