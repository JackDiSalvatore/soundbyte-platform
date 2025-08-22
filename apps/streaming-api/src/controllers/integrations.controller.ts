import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { CreateProviderCredentialsDto } from '../dto/create-provider-credential.dto';
import { IntegrationService } from '../services/integration.service';
import { RefreshDto } from '../dto/refresh.dto';

@Controller()
export class IntegrationsController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get('list')
  getStreamingServices(): string[] {
    return this.integrationService.getStreamingServices();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<unknown> {
    return await this.integrationService.login(loginDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto): Promise<unknown> {
    return await this.integrationService.refresh(refreshDto);
  }
}
