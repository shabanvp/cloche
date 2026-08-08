require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkMedia() {
  const mediaRes = await fetch(`${url}/rest/v1/media?limit=1`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
  });
  if (mediaRes.ok) {
    const data = await mediaRes.json();
    console.log('media sample:', data);
  } else {
    console.error('media error:', await mediaRes.text());
  }
}

checkMedia();
