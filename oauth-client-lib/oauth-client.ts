import { OAuthClientConfig, TokenResponse } from "./interfaceType";
export class OAuthClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private authUrl: string;
  private tokenUrl: string;

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

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`failed: ${error}`);
    }

    return (await response.json()) as TokenResponse;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token refresh failed: ${error}`);
    }

    return await response.json();
  }
}
