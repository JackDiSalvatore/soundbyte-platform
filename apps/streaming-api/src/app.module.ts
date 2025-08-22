import { Module } from '@nestjs/common';
import { IntegrationsController } from './controllers/integrations.controller';
import { IntegrationService } from './services/integration.service';

@Module({
  imports: [],
  controllers: [IntegrationsController],
  providers: [IntegrationService],
})
export class AppModule {}
