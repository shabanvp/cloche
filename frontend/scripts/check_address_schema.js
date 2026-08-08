require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkAddresses() {
  const addressRes = await fetch(`${url}/rest/v1/vendor_addresses?limit=1`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
  });
  if (addressRes.ok) {
    const data = await addressRes.json();
    console.log('vendor_addresses sample:', data);
  } else {
    console.error('vendor_addresses error:', await addressRes.text());
  }
}

checkAddresses();
