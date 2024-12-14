interface OAuthClientConfig {
  clientId: string;
  clientSecret: string; // Optional
  redirectUri: string;
  authUrl: string;
  tokenUrl: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope?: string;
  [key: string]: any;
}

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
    });

    if (this.clientSecret) {
      body.append("client_secret", this.clientSecret);
    }

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      let errorDetails: any;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = { error_description: "Unknown error occurred" };
      }
      throw new Error(
        `Token exchange failed: ${
          errorDetails.error_description || response.statusText
        }`
      );
    }

    return (await response.json()) as TokenResponse;
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
    });

    if (this.clientSecret) {
      body.append("client_secret", this.clientSecret);
    }

    const response = await fetch(this.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      let errorDetails: any;
      try {
        errorDetails = await response.json();
      } catch {
        errorDetails = { error_description: "Unknown error occurred" };
      }
      throw new Error(
        `Token refresh failed: ${
          errorDetails.error_description || response.statusText
        }`
      );
    }

    return (await response.json()) as TokenResponse;
  }

  async revokeToken(token: string): Promise<void> {
    const body = new URLSearchParams({ token });
    const response = await fetch(`${this.tokenUrl}/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(`Token revocation failed: ${response.statusText}`);
    }
  }
}
