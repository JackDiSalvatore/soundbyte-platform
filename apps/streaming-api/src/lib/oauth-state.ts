export interface OAuthState {
  state: string;
  codeVerifier: string;
  expires: number;
  userId?: string;
  originalUrl?: string; // Where to redirect after auth
}
