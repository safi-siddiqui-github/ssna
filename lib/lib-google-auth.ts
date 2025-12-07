import { OAuth2Client } from "google-auth-library";

const GoogleOAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_OATH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OATH_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_OATH_CLIENT_REDIRECT,
});

export const GoogleOAuthClient = GoogleOAuth2Client;
