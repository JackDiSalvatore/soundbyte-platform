import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SoundCloudOAuthModule } from './oauth/soundcloud-oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      // Optional: Load custom configuration files
      // load: [appConfig, databaseConfig],
    }),
    SoundCloudOAuthModule,
  ],
})
export class AppModule {}
