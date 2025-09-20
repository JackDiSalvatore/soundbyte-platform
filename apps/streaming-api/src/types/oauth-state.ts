export interface OAuthState {
  state: string;
  provider: string;
  expires: number;
  userId?: string;
  originalUrl?: string; // Where to redirect after auth
}

export interface OAuthStateWithPKCE extends OAuthState {
  codeVerifier: string;
}
