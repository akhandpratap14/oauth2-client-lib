import axios from "axios";
import { OAuthClientConfig, TokenResponse } from "./interfaceType";
export class OAuthClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private authUrl: string;
  private tokenUrl: string;
  private tokenExpiryTime?: number;

  constructor({
    clientId,
    clientSecret,
    redirectUri,
    authUrl,
    tokenUrl,
  }: OAuthClientConfig) {
    if (!clientId || !redirectUri || !authUrl || !tokenUrl) {
      throw new Error(
        "Missing required parameters for OAuthClient initialization."
      );
    }

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.authUrl = authUrl;
    this.tokenUrl = tokenUrl;
  }

  startAuthFlow(scope: string[] = []): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: scope.join(" "),
      access_type: "offline",
    });
    return `${this.authUrl}?${params.toString()}`;
  }

  async handleCallback(callbackParams: {
    code: string;
  }): Promise<TokenResponse> {
    if (!callbackParams.code) {
      throw new Error("Authorization code missing in callback parameters");
    }

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code: callbackParams.code,
      redirect_uri: this.redirectUri,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    try {
      const response = await axios.post(this.tokenUrl, body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const tokenResponse = response.data;
      this.tokenExpiryTime = Date.now() + tokenResponse.expires_in * 1000;
      return tokenResponse;
    } catch (error) {
      throw new Error(`failed: ${error}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    try {
      const response = await axios.post(this.tokenUrl, body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const tokenResponse = response.data;
      this.tokenExpiryTime = Date.now() + tokenResponse.expires_in * 1000;
      return response.data;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error}`);
    }
  }

  isTokenExpired(): boolean {
    return !this.tokenExpiryTime || Date.now() >= this.tokenExpiryTime - 30000;
  }
}
