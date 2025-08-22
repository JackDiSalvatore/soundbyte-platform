export class CreateProviderCredentialsDto {
  userId: string;
  provider: string; // ex: 'spotify', 'soundcloud'
  token: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  };
}
