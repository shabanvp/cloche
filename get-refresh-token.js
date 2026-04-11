const {google} = require('googleapis');
const readline = require('readline');

const CLIENT_ID = "1044474441949-s7642ed34oovuto2o250uf9sju1g3an6.apps.googleusercontent.com";
const CLIENT_SECRET = "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";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  "http://localhost:3000/oauth2callback"
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/gmail.send']
});

console.log('🔗 Visit this URL to authorize:\n', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\n📋 Paste the authorization code here: ', async (code) => {
  try {
    const {tokens} = await oauth2Client.getToken(code);
    console.log('\n✅ REFRESH TOKEN (copy this to Render):\n');
    console.log(tokens.refresh_token);
    rl.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
  }
});
