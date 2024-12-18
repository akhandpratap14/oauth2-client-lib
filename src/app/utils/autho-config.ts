export const AUTHO_CONFIG = {
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirectUri: "http://localhost:5173/callback",
  authUrl: "https://DOMAIN/authorize",
  tokenUrl: "https://DOMAIN/oauth/token",
};
