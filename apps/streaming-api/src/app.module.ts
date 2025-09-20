import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StreamingProviderOAuthModule } from './oauth/streaming-provider-oauth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
      // Optional: Load custom configuration files
      // load: [appConfig, databaseConfig],
    }),
    StreamingProviderOAuthModule,
  ],
  controllers: [
    // Any existing app-level controllers you might have
  ],
  providers: [
    // Any existing app-level providers you might have
  ],
})
export class AppModule {}
