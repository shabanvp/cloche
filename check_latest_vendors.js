const fs = require('fs');
const envContent = fs.readFileSync('frontend/.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(l => {
  const m = l.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (m) env[m[1]] = (m[2]||'').replace(/^"|"$/g, '').trim();
});
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function run() {
  const uRes = await fetch(url + '/rest/v1/users?select=id,email,full_name,created_at&order=created_at.desc&limit=5', {
    headers: { apikey: key, Authorization: 'Bearer ' + key }
  });
  console.log('Latest users:', await uRes.json());

  // Also query auth.users via admin API
  const authUsersRes = await fetch(url + '/auth/v1/admin/users?per_page=5', {
    headers: { apikey: key, Authorization: 'Bearer ' + key }
  });
  const authUsers = await authUsersRes.json();
  console.log('Latest auth users:', authUsers.users ? authUsers.users.map(u => ({ id: u.id, email: u.email, created_at: u.created_at, metadata: u.user_metadata })) : authUsers);

  // Check vendor_profiles for recent ones
  const vpRes = await fetch(url + '/rest/v1/vendor_profiles?select=*,vendor_id(*)&order=created_at.desc&limit=5', {
    headers: { apikey: key, Authorization: 'Bearer ' + key }
  });
  console.log('Latest vendor profiles:', await vpRes.json());
}

run().catch(console.error);

