export interface OAuthClientConfig {
  clientId: string;
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope?: string;
  id_token: string;
}
