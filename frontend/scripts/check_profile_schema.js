require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function checkTables() {
  const profileRes = await fetch(`${url}/rest/v1/vendor_profiles?limit=1`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
  });
  if (profileRes.ok) {
    const data = await profileRes.json();
    console.log('vendor_profiles sample:', data);
  } else {
    console.error('vendor_profiles error:', await profileRes.text());
  }

  const contactsRes = await fetch(`${url}/rest/v1/vendor_contacts?limit=1`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
  });
  if (contactsRes.ok) {
    const data = await contactsRes.json();
    console.log('vendor_contacts sample:', data);
  } else {
    console.error('vendor_contacts error:', await contactsRes.text());
  }

  const socialRes = await fetch(`${url}/rest/v1/vendor_social_links?limit=1`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
  });
  if (socialRes.ok) {
    const data = await socialRes.json();
    console.log('vendor_social_links sample:', data);
  } else {
    console.error('vendor_social_links error:', await socialRes.text());
  }
}

checkTables();
