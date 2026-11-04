const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const required = [
  'AURA_TEST_ENVIRONMENT', 'AURA_TEST_BASE_URL', 'AURA_TEST_SUPABASE_URL',
  'AURA_TEST_SERVICE_ROLE_KEY', 'AURA_TEST_JWT_SECRET',
];
const configReady = required.every((name) => Boolean(process.env[name]));
const enabled = configReady && process.env.AURA_TEST_ENVIRONMENT === 'isolated'
  && isLoopback(process.env.AURA_TEST_BASE_URL) && isLoopback(process.env.AURA_TEST_SUPABASE_URL);
const suite = enabled ? test : test.skip;
const runId = crypto.randomUUID();
const identities = ['a', 'b'].map((suffix) => ({
  id: crypto.randomUUID(), email: `aura-test-${runId}-${suffix}@aura.test`, fullName: `Aura Test ${suffix.toUpperCase()}`,
}));
const tokens = new Map();
let testConversationA;
let testConversationB;

function isLoopback(value) {
  try { return ['127.0.0.1', 'localhost', '[::1]'].includes(new URL(value).hostname); }
  catch { return false; }
}

function signToken(user) {
  const header = b64({ alg: 'HS256', typ: 'JWT' });
  const iat = Math.floor(Date.now() / 1000);
  const payload = b64({ userId: user.id, email: user.email, fullName: user.fullName, roles: ['customer'], iat, exp: iat + 3600 });
  const body = `${header}.${payload}`;
  const signature = crypto.createHmac('sha256', process.env.AURA_TEST_JWT_SECRET).update(body).digest('base64url');
  return `${body}.${signature}`;
}
function b64(value) { return Buffer.from(JSON.stringify(value)).toString('base64url'); }

function restHeaders(extra = {}) {
  const key = process.env.AURA_TEST_SERVICE_ROLE_KEY;
  return { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...extra };
}
async function rest(path, init = {}) {
  const response = await fetch(`${process.env.AURA_TEST_SUPABASE_URL}/rest/v1/${path}`, {
    ...init, headers: restHeaders(init.headers),
  });
  const text = await response.text();
  if (!response.ok) throw new Error(`Isolated test REST call failed (${response.status}): ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}
async function api(user, path, init = {}) {
  const response = await fetch(`${process.env.AURA_TEST_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(user ? { Authorization: `Bearer ${tokens.get(user.id)}` } : {}), ...init.headers },
  });
  const text = await response.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  return { status: response.status, body, retryAfter: response.headers.get('retry-after') };
}
async function resetLimiter(user) {
  await rest(`aura_rate_limit_windows?user_id=eq.${user.id}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
}
async function findRealVendorSearch() {
  const aliases = [
    { match: /photograph/i, phrase: 'photographer' },
    { match: /groom/i, phrase: 'groom wear' },
    { match: /makeup/i, phrase: 'makeup artist' },
    { match: /mehendi|mehndi/i, phrase: 'mehendi artist' },
    { match: /venue/i, phrase: 'venue' },
    { match: /decor|planner|flower/i, phrase: 'decor' },
    { match: /cater/i, phrase: 'catering' },
  ];
  const categories = await rest('vendor_categories?select=id,name,slug');
  for (const alias of aliases) {
    const matches = categories.filter((category) => alias.match.test(`${category.name} ${category.slug}`));
    if (!matches.length) continue;
    const ids = matches.map((category) => category.id).join(',');
    const path = `vendors?deleted_at=is.null&status=eq.active&or=(is_verified.eq.true,is_kyc_verified.eq.true)&category_id=in.(${ids})&select=id,is_verified,is_kyc_verified,vendor_categories(name,slug),vendor_profiles(business_name,city,starting_price),vendor_services(base_price,deleted_at,status,is_active)&vendor_services.deleted_at=is.null&vendor_services.status=eq.published&vendor_services.is_active=eq.true&order=created_at.desc&limit=200`;
    const rows = await rest(path);
    const populated = rows.map((row) => ({
      row,
      profile: Array.isArray(row.vendor_profiles) ? row.vendor_profiles[0] : row.vendor_profiles,
    })).find(({ profile }) => profile && profile.city);
    if (populated) return { ...populated, phrase: alias.phrase, ids: new Set(rows.map((row) => row.id)), records: new Map(rows.map((row) => [row.id, row])) };
  }
  return null;
}
async function send(user, id, message, conversationId) {
  return api(user, '/api/aura/chat', { method: 'POST', body: JSON.stringify({
    conversationId, message, clientMessageId: id,
  }) });
}

if (!enabled) {
  console.info('Aura API integration suite skipped. Configure loopback-only AURA_TEST_* values for a dedicated isolated Supabase + Next.js test stack.');
}

suite('Aura authenticated API integration (loopback isolated stack only)', { concurrency: false }, async (t) => {
  t.before(async () => {
    assert.ok(process.env.AURA_TEST_JWT_SECRET.length >= 32, 'test JWT secret must be at least 32 characters');
    const baseUrl = new URL(process.env.AURA_TEST_BASE_URL);
    const supabaseUrl = new URL(process.env.AURA_TEST_SUPABASE_URL);
    assert.equal(baseUrl.protocol, 'http:', 'integration suite accepts only local HTTP endpoints');
    assert.equal(supabaseUrl.protocol, 'http:', 'integration suite accepts only local HTTP endpoints');
    for (const user of identities) {
      await rest('users', { method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify({
        id: user.id, email: user.email, full_name: user.fullName, name: user.fullName, is_active: true, is_verified: true,
      }) });
      tokens.set(user.id, signToken(user));
    }
    for (const user of identities) await resetLimiter(user);
  });

  t.after(async () => {
    for (const user of identities) {
      try { await rest(`aura_rate_limit_windows?user_id=eq.${user.id}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } }); } catch {}
      try { await rest(`aura_conversations?user_id=eq.${user.id}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } }); } catch {}
    }
    try { await rest(`users?id=in.(${identities.map((u) => u.id).join(',')})`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } }); } catch {}
  });

  await t.test('rejects unauthenticated requests and validates large input', async () => {
    const unauthenticated = await api(null, '/api/aura/chats');
    assert.equal(unauthenticated.status, 401);
    const tooLarge = await send(identities[0], crypto.randomUUID(), 'x'.repeat(8001), crypto.randomUUID());
    assert.equal(tooLarge.status, 400);
  });

  await t.test('persists conversations, restores them, and keeps separate contexts', async () => {
    testConversationA = `aura-test-${runId}-a`;
    testConversationB = `aura-test-${runId}-b`;
    await resetLimiter(identities[0]);
    const introduce = await send(identities[0], crypto.randomUUID(), 'Hi, my name is Shaban.', testConversationA);
    assert.equal(introduce.status, 200, JSON.stringify(introduce.body));
    assert.match(introduce.body.reply, /Shaban/);
    const followup = await send(identities[0], crypto.randomUUID(), 'What is my name?', testConversationA);
    assert.equal(followup.status, 200);
    assert.match(followup.body.reply, /Shaban/);
    const independentA = await send(identities[0], crypto.randomUUID(), 'What is my name?', `aura-test-${runId}-a-independent`);
    assert.equal(independentA.status, 200);
    assert.doesNotMatch(independentA.body.reply, /Shaban/);

    await resetLimiter(identities[1]);
    const separate = await send(identities[1], crypto.randomUUID(), 'What is my name?', testConversationB);
    assert.equal(separate.status, 200);
    assert.doesNotMatch(separate.body.reply, /Shaban/);

    const chatsA = await api(identities[0], '/api/aura/chats');
    const chatsB = await api(identities[1], '/api/aura/chats');
    assert.equal(chatsA.status, 200);
    assert.equal(chatsB.status, 200);
    const restoredA = chatsA.body.chats.find((chat) => chat.id === testConversationA);
    assert.ok(restoredA);
    assert.ok(restoredA.messages.length >= 4, 'reopened history should include both user and assistant turns');
    assert.ok(chatsB.body.chats.some((chat) => chat.id === testConversationB));
    assert.ok(!chatsA.body.chats.some((chat) => chat.id === testConversationB));
  });

  await t.test('prevents cross-user read, delete, and context update', async () => {
    const before = await rest(`aura_conversations?id=eq.${testConversationB}&user_id=eq.${identities[1].id}&select=context`);
    const read = await api(identities[0], '/api/aura/chats');
    assert.equal(read.status, 200);
    assert.ok(!read.body.chats.some((chat) => chat.id === testConversationB));
    const remove = await api(identities[0], `/api/aura/chats/${testConversationB}`, { method: 'DELETE' });
    assert.equal(remove.status, 404);
    const update = await api(identities[0], `/api/aura/chats/${testConversationB}`, { method: 'PATCH', body: JSON.stringify({ pinned: true, context: { preferredName: 'attacker' } }) });
    assert.equal(update.status, 404);
    const after = await rest(`aura_conversations?id=eq.${testConversationB}&user_id=eq.${identities[1].id}&select=context`);
    assert.deepEqual(after, before);
    const owner = await api(identities[1], '/api/aura/chats');
    assert.equal(owner.status, 200);
    assert.ok(owner.body.chats.some((chat) => chat.id === testConversationB));
  });

  await t.test('serializes concurrent context updates within a conversation', async () => {
    await resetLimiter(identities[0]);
    const [introduction, followup] = await Promise.all([
      send(identities[0], crypto.randomUUID(), 'My name is Amina.', testConversationA),
      send(identities[0], crypto.randomUUID(), 'What is my name?', testConversationA),
    ]);
    assert.equal(introduction.status, 200, JSON.stringify(introduction.body));
    assert.equal(followup.status, 200, JSON.stringify(followup.body));
    const persisted = await rest(`aura_conversations?id=eq.${testConversationA}&user_id=eq.${identities[0].id}&select=context`);
    assert.equal(persisted[0].context.preferredName, 'Amina');
    const current = await send(identities[0], crypto.randomUUID(), 'What is my name?', testConversationA);
    assert.equal(current.status, 200);
    assert.match(current.body.reply, /Amina/);
  });

  await t.test('deduplicates concurrent retries and returns the stored reply', async () => {
    await resetLimiter(identities[0]);
    const id = crypto.randomUUID();
    const conversation = `aura-test-${runId}-retry`;
    const [first, second] = await Promise.all([
      send(identities[0], id, 'Hi, my name is Shaban.', conversation),
      send(identities[0], id, 'Hi, my name is Shaban.', conversation),
    ]);
    assert.equal(first.status, 200, JSON.stringify(first.body));
    assert.equal(second.status, 200, JSON.stringify(second.body));
    assert.equal(first.body.reply, second.body.reply);
    const stored = await rest(`aura_messages?conversation_id=eq.${conversation}&user_id=eq.${identities[0].id}&client_message_id=eq.${id}&select=role`);
    assert.equal(stored.filter((row) => row.role === 'user').length, 1);
    assert.equal(stored.filter((row) => row.role === 'assistant').length, 1);
  });

  await t.test('searches the actual verified vendor directory and states empty results honestly', async () => {
    await resetLimiter(identities[0]);
    const candidate = await findRealVendorSearch();
    const phrase = candidate ? `Find ${candidate.phrase} in ${candidate.profile.city}.` : 'Find photographers in Kochi.';
    const response = await send(identities[0], crypto.randomUUID(), phrase, `aura-test-${runId}-vendors`);
    assert.equal(response.status, 200, JSON.stringify(response.body));
    const vendors = response.body.groundedVendors || [];
    if (!candidate) {
      assert.equal(vendors.length, 0, 'an empty real directory must not be filled with demo vendors');
      assert.match(response.body.reply, /couldn.t find verified/i);
      return;
    }
    assert.ok(vendors.length > 0, `expected a result for registered ${candidate.phrase} category in ${candidate.profile.city}`);
    for (const vendor of vendors) {
      assert.ok(candidate.ids.has(vendor.id), 'returned vendor ID must exist in the queried active directory rows');
      assert.equal(vendor.isVerified, true);
      assert.equal(vendor.category, candidate.row.vendor_categories.name);
      assert.ok(vendor.city.toLowerCase().includes(candidate.profile.city.toLowerCase()));
      assert.match(vendor.detailUrl, /^\/boutiques\//);
      const source = candidate.records.get(vendor.id);
      const profile = Array.isArray(source.vendor_profiles) ? source.vendor_profiles[0] : source.vendor_profiles;
      const services = Array.isArray(source.vendor_services) ? source.vendor_services : [];
      const servicePrices = services.map((service) => Number(service.base_price || 0)).filter((amount) => Number.isFinite(amount) && amount > 0);
      const storedAmount = servicePrices.length ? Math.min(...servicePrices) : Number(profile?.starting_price || 0);
      if (storedAmount > 0) assert.equal(vendor.startingPrice.replace(/\D/g, ''), String(Math.round(storedAmount)));
      else assert.equal(vendor.startingPrice, 'Contact for pricing');
    }
  });

  await t.test('rate limit is shared, user-scoped, and returns 429 at the configured limit', async () => {
    await resetLimiter(identities[0]);
    const conversation = `aura-test-${runId}-rate`;
    for (let index = 0; index < 20; index += 1) {
      const result = await send(identities[0], crypto.randomUUID(), `Rate check ${index}`, conversation);
      assert.equal(result.status, 200, `request ${index + 1}: ${JSON.stringify(result.body)}`);
    }
    const limited = await send(identities[0], crypto.randomUUID(), 'Rate check 21', conversation);
    assert.equal(limited.status, 429);
    assert.equal(limited.retryAfter, '60');
    await resetLimiter(identities[1]);
    const otherUser = await send(identities[1], crypto.randomUUID(), 'Independent limit window', `aura-test-${runId}-user-b-rate`);
    assert.equal(otherUser.status, 200, 'the limit must be scoped per user');
  });
});
