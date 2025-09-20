import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StreamingProviderApiController } from '../controllers/api.controller';
import { SoundCloudOAuthController } from '../controllers/soundcloud.oauth.controller';
import { SpotifyOAuthController } from '../controllers/spotify.oauth.controller';
import { OAuthCSRFService } from '../services/oauth-csrf-service';
import { SoundCloudOAuthService } from '../services/soundcloud-oauth-service';
import { SpotifyOAuthService } from '../services/spotify-oauth-service';
import { SoundCloudApiController } from '../controllers/soundcloud.api.controller';
import { CredentialService } from '../services/credential-service';

@Module({
  imports: [ConfigModule],
  controllers: [
    SpotifyOAuthController,
    SoundCloudOAuthController,
    SoundCloudApiController,
    StreamingProviderApiController,
  ],
  providers: [
    OAuthCSRFService,
    SpotifyOAuthService,
    SoundCloudOAuthService,
    CredentialService,
  ],
  exports: [
    OAuthCSRFService,
    SpotifyOAuthService,
    SoundCloudOAuthService,
    CredentialService,
  ],
})
export class StreamingProviderOAuthModule {}
