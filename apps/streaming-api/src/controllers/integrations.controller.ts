import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConnectDto } from '../dto/connect.dto';
import { IntegrationService } from '../services/integration.service';
import { LogoutDto } from '../dto/logout.dto';
import { AccessTokenRequestDto } from '../dto/access-token-request.dto';

@Controller()
export class IntegrationsController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get('list')
  getStreamingServices(): string[] {
    return this.integrationService.getStreamingServices();
  }

  @Post('connect')
  async connect(
    @Body() connectDto: ConnectDto,
  ): Promise<{ access_token: string }> {
    try {
      return {
        access_token: await this.integrationService.connect(connectDto),
      };
    } catch (error) {
      // NestJS built-in expection layer will handle this
      throw error;
    }
  }

  @Post('logout')
  async logout(@Body() logoutDto: LogoutDto): Promise<{ success: boolean }> {
    try {
      await this.integrationService.logout(logoutDto);
      return {
        success: true,
      };
    } catch (error) {
      // NestJS built-in expection layer will handle this
      throw error;
    }
  }

  @Post('get-access-token')
  async getAccessToken(
    @Body() accessTokenRequestDto: AccessTokenRequestDto,
  ): Promise<{ provider: string; accessToken: string }[]> {
    try {
      const res = await this.integrationService.getAccessToken(
        accessTokenRequestDto,
      );
      return res;
    } catch (error) {
      // NestJS built-in expection layer will handle this
      throw error;
    }
  }
}
