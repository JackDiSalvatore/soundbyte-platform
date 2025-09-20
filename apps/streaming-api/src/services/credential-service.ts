import { Injectable } from '@nestjs/common';
import { getCredentials, upsertCredentials } from '../db/provider-credentials';
import { SoundCloudOAuthService } from './soundcloud-oauth-service';
import { CreateProviderCredentialsDto } from '../dto/create-provider-credential.dto';

@Injectable()
export class CredentialService {
  // private stateStore: Map<string, {}> = new Map();
  // private readonly stateTTL: number = 10 * 60 * 1000; // 10 minutes
  constructor(private readonly soundCloudService: SoundCloudOAuthService) {}

  async getCredentials({
    userId,
    provider,
  }): Promise<CreateProviderCredentialsDto | undefined> {
    let credentials = await getCredentials({
      userId,
      provider,
    });

    // Check if credentials have expired
    if (credentials?.expiresAt && credentials?.expiresAt >= new Date()) {
      // Update credentials
      const { access_token, token_type, refresh_token, scope, expires_in } =
        await this.soundCloudService.useRefreshToken(credentials.refreshToken);

      credentials = {
        ...credentials,
        accessToken: access_token,
        tokenType: token_type,
        refreshToken: refresh_token,
        expiresIn: expires_in,
        scope: scope ? scope : '',
      };

      await upsertCredentials(credentials);
    }

    return credentials;
  }
}
