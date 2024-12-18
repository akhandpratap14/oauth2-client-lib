import axios from "axios";
import { OAuthClientConfig, TokenResponse } from "./interfaceType";
import {
  fromBase64,
  generateEncryptionKey,
  generateRandomString,
  sha256,
  toBase64,
} from "./utilities";

export class OAuthClient {
  private clientId: string;
  private redirectUri: string;
  private authUrl: string;
  private tokenUrl: string;

  constructor({ clientId, redirectUri, authUrl, tokenUrl }: OAuthClientConfig) {
    if (!clientId || !redirectUri || !authUrl || !tokenUrl) {
      throw new Error(
        "Missing required parameters for OAuthClient initialization."
      );
    }

    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.authUrl = authUrl;
    this.tokenUrl = tokenUrl;
  }

  async startAuthFlow(scope: string[] = []): Promise<string> {
    const codeVerifier = generateRandomString(128);

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await generateEncryptionKey();

    const encryptedVerifier = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(codeVerifier)
    );

    sessionStorage.setItem(
      "code_verifier",
      toBase64(new Uint8Array(encryptedVerifier))
    );
    sessionStorage.setItem("code_verifier_iv", toBase64(iv));

    const exportedKey = await crypto.subtle.exportKey("raw", key);
    sessionStorage.setItem(
      "encryption_key",
      toBase64(new Uint8Array(exportedKey))
    );

    const codeChallenge = await sha256(codeVerifier);

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: scope.join(" "),
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    });

    return `${this.authUrl}?${params.toString()}`;
  }

  async handleCallback(callbackParams: {
    code: string;
  }): Promise<TokenResponse> {
    const encrypted = sessionStorage.getItem("code_verifier");
    const storedIv = sessionStorage.getItem("code_verifier_iv");
    const storedKey = sessionStorage.getItem("encryption_key");

    if (!encrypted || !storedIv || !storedKey) {
      throw new Error("Code verifier, IV, or key not found in sessionStorage.");
    }

    try {
      const iv = fromBase64(storedIv);
      const key = await crypto.subtle.importKey(
        "raw",
        fromBase64(storedKey),
        { name: "AES-GCM" },
        false,
        ["decrypt"]
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        fromBase64(encrypted)
      );

      const codeVerifier = new TextDecoder().decode(decrypted);

      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: callbackParams.code,
        redirect_uri: this.redirectUri,
        client_id: this.clientId,
        code_verifier: codeVerifier,
      });

      const response = await axios.post(this.tokenUrl, body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      sessionStorage.removeItem("code_verifier");
      sessionStorage.removeItem("code_verifier_iv");
      sessionStorage.removeItem("encryption_key");

      return response.data as TokenResponse;
    } catch (error) {
      sessionStorage.removeItem("code_verifier");
      sessionStorage.removeItem("code_verifier_iv");
      sessionStorage.removeItem("encryption_key");

      throw new Error(`Token exchange failed: ${error}`);
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.clientId,
    });

    try {
      const response = await axios.post(this.tokenUrl, body.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return response.data as TokenResponse;
    } catch (error) {
      throw new Error(`Token refresh failed: ${error}`);
    }
  }
}
