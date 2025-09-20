export class CreateProviderCredentialsDto {
  userId: string;
  provider: string; // ex: 'spotify', 'soundcloud'
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope: string;
}
