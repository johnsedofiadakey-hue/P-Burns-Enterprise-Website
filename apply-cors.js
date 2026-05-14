const https = require('https');
const fs = require('fs');

// Read the service account to get an access token
// We'll use the Firebase Admin approach via a script
const { execSync } = require('child_process');

const cors = [
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    responseHeader: [
      'Content-Type',
      'Authorization', 
      'Content-Length',
      'X-Requested-With',
      'Access-Control-Allow-Origin'
    ],
    maxAgeSeconds: 3600
  }
];

// Get auth token from gcloud or firebase-tools
let token;
try {
  token = execSync('npx firebase-tools login:ci --no-localhost 2>/dev/null || cat ~/.config/firebase/auth.json 2>/dev/null', { encoding: 'utf8' }).trim();
} catch(e) {}

// Try getting the token from firebase-tools internals
try {
  const authFile = require('os').homedir() + '/.config/firebase/auth.json';
  if (fs.existsSync(authFile)) {
    const auth = JSON.parse(fs.readFileSync(authFile, 'utf8'));
    const tokens = auth.tokens;
    if (tokens && tokens.access_token) {
      token = tokens.access_token;
      console.log('Found cached token');
    }
  }
} catch(e) {}

if (!token) {
  console.log('No token available. Please run: npx firebase-tools login and then re-run this script');
  process.exit(1);
}

console.log('Applying CORS config...');
console.log(JSON.stringify(cors, null, 2));
