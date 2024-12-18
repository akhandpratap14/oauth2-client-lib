## Overview

This project demonstrates an AuthO client library implemented in TypeScript, along with a demo application that uses the library to authenticate users via Google OAuth. It integrates tools like **React Hook Form**, **TanStack React Query**, and **React Auth Kit** for an enhanced developer experience.

---

## Project Structure

```
oauth2-client-lib/
|
├── oauth-client-lib/
│   ├── oauth-client.ts          // OAuth library logic
│   ├── interfaceType.ts         // Interfaces for OAuthClient
│
├── public/
│   └── index.html               // HTML entry point
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── Header.tsx   // Header component
│   │   │   └── OAuthCallback.tsx // OAuth callback handler
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx    // Login page
│   │   │   │   └── Register.tsx // Register page
│   │   │   ├── Home.tsx         // Protected Home page
│   │   │
│   │   ├── services/
│   │   │   ├── useAuth.ts       // Custom authentication hook
│   │   │   ├── instance.ts      // Axios instance configuration
│   │   │
│   │   ├── utilities/
│   │   │   ├── oauthInstance.ts // OAuthClient instance configuration
│   │   │   └── zod/             // Zod schemas for form validation
│   │   │
│   │
│   ├── App.tsx                  // Main App component
│   ├── main.tsx                 // React entry point
│   ├── index.css                // Global styles
│   │
│   └── other files...           // Additional files if any
│
├── .gitignore
├── README.md
├── eslint.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## How to Use the OAuth Library

### 1. Import the Library

Import the `OAuthClient` class from the library folder:

```typescript
import { OAuthClient } from "../../../oauth-client-lib/oauth-client";
```

### 2. Initialize the Client

Create an instance of `OAuthClient` with your OAuth configuration:

```typescript
const oauthClient = new OAuthClient({
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  redirectUri: import.meta.env.VITE_APP_REDIRECTURL,
  authUrl: "****",
  tokenUrl: "****",
});
```

### 3. Start AuthO Flow

Generate the authorization URL and redirect the user:

```typescript
const authUrl = oauthClient.startAuthFlow([
  "openid",
  "profile",
  "email"
]);
window.location.href = authUrl;
```

### 4. Handle Callback

After the user is redirected back with an authorization code, exchange it for tokens:

```typescript
const tokenResponse = await oauthClient.handleCallback({ AUTHORIZATION_CODE });
```

### 5. Refresh Token

Refresh the access token when it expires:

```typescript
const newTokenResponse = await oauthClient.refreshToken("REFRESH_TOKEN");
console.log("New Token Response:", newTokenResponse);
```

---

## How to Run the Demo

### 1. Prerequisites

- Node.js installed on your machine.
- Google OAuth 2.0 credentials (client ID and secret).

### 2. Clone the Repository

```bash
git clone https://github.com/akhandpratap14/oauth2-client-lib.git
cd oauth2-client-lib
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the following:

```env

VITE_APP_APIURL="http://localhost:8000/"
VITE_APP_REDIRECTURL="http://localhost:5173/callback"
VITE_AUTH0_CLIENT_ID="****"
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Key Features in the Demo

### 1. Login with Google

- The `Login.tsx` page provides a form-based login and a **Sign in with Google** button.
- Clicking the button initiates the OAuth flow via the `login` function.

### 2. AUTH) Callback Handling

- The `OAuthCallback.tsx` processes the authorization code returned by Google.
- It exchanges the code for tokens and fetches the user's profile information.

### 3. Protected Home Page

- The `Home.tsx` page displays user information in a **Material UI Card** after successful authentication.
- If the user is not authenticated, they are redirected to the login page.

---

## Third-Party Libraries

1. **React Hook Form**:

   - Used in `Login.tsx` for form handling and validation.
   - Integrated with `zod` for schema-based validation.

2. **TanStack React Query**:

   - Used for managing asynchronous requests (e.g., login mutation).

3. **React Auth Kit**:

   - Used to manage authentication state and session storage.

4. **Material UI**:

   - Used for UI components like `Card`, `Box`, `Button`, and `CircularProgress`.

---

## Flow of the Demo

1. **Login Page** (`Login.tsx`):

   - User enters credentials or clicks **Sign in with Google**.
   - If Google OAuth is chosen, the browser opens Google's OAuth consent screen.

2. **Callback Handling** (`OAuthCallback.tsx`):

   - The app receives an authorization code from Google.
   - Exchanges the code for access and refresh tokens.
   - Fetches the user's profile information.

3. **Protected Home Page** (`Home.tsx`):

   - Displays user information (name, email, profile picture).
   - Shows email verification status.
   - Includes a **Logout** button to clear the session.

## Demo Video

[![Watch the video](./assets/demo-thumbnail.png)](https://youtu.be/PNsUXMjeqKQ)
