require('dotenv').config();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testSingleJoinQuery() {
  console.time('SingleJoinQuery');
  const res = await fetch(
    `${url}/rest/v1/vendors?select=*,vendor_profiles(*),vendor_contacts(*),vendor_addresses(*),vendor_categories(id,name,slug),vendor_social_links(*)&limit=1`,
    { headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` } }
  );
  console.timeEnd('SingleJoinQuery');

  if (res.ok) {
    const data = await res.json();
    console.log('Single Join Query Success! Returned vendor count:', data.length);
    if (data.length > 0) {
      const v = data[0];
      console.log('Vendor ID:', v.id);
      console.log('Profile:', v.vendor_profiles);
      console.log('Contacts:', v.vendor_contacts);
      console.log('Addresses:', v.vendor_addresses);
      console.log('Category:', v.vendor_categories);
      console.log('Social Links:', v.vendor_social_links);
    }
  } else {
    console.error('Single Join Query Error:', await res.text());
  }
}

testSingleJoinQuery();
