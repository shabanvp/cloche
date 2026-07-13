const { google } = require("googleapis");
const readline = require("readline");

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || "http://localhost:3000/oauth2callback";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET before running this script.");
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  include_granted_scopes: true,
  scope: ["https://www.googleapis.com/auth/gmail.send"],
});

console.log("Visit this URL to authorize:\n", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nPaste the authorization code here: ", async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("\nREFRESH TOKEN (copy this to Render as GMAIL_REFRESH_TOKEN):\n");
    console.log(tokens.refresh_token || "(none returned)");

    if (!tokens.refresh_token) {
      console.log("\nNo refresh token was returned. Revoke the app grant from your Google Account, then run this again.");
    }

    rl.close();
  } catch (error) {
    console.error("Error:", error.message);
    rl.close();
  }
});
