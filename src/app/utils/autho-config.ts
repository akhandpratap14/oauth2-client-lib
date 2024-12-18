export const AUTHO_CONFIG = {
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirectUri: import.meta.env.VITE_APP_REDIRECTURL,
  authUrl: "https://{Domain}/authorize",
  tokenUrl: "https://{domain}/oauth/token",
};
