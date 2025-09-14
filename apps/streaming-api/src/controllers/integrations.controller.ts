import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConnectProviderCallbackDto } from '../dto/connect-provider-callback.dto';
import { IntegrationService } from '../services/integration.service';
import { ConnectDto } from '../dto/connect.dto';
import { DisconnectDto } from '../dto/disconnect.dto';
import { AccessTokenRequestDto } from '../dto/access-token-request.dto';

@Controller()
export class IntegrationsController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Get('list')
  getStreamingServices(): string[] {
    return this.integrationService.getStreamingServices();
  }

  @Post('connect/userId/:userId/provider/:provider')
  async connect(
    @Param('userId') userId: string,
    @Param('provider') provider: string,
    @Body() connectDto: ConnectDto,
  ): Promise<{ success: boolean }> {
    try {
      const res = await this.integrationService.connect(connectDto);

      return {
        success: true, // TODO
      };
    } catch (error) {
      // NestJS built-in expection layer will handle this
      throw error;
    }
  }

  @Post('/auth/:provider/callback')
  async connectProviderCallback(
    @Param('provider') provider: string,
    @Body() connectProviderCallbackDto: ConnectProviderCallbackDto,
  ): Promise<{ access_token: string }> {
    try {
      return {
        access_token: await this.integrationService.connectProviderCallback(
          connectProviderCallbackDto,
        ),
      };
    } catch (error) {
      // NestJS built-in expection layer will handle this
      throw error;
    }
  }

  @Post('disconnect/userId/:userId/provider/:provider')
  async disconnect(
    @Param('userId') userId: string,
    @Param('provider') provider: string,
    @Body() disconnectDto: DisconnectDto,
  ): Promise<{ success: boolean }> {
    try {
      await this.integrationService.disconnect(disconnectDto);
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
