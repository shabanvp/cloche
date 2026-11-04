const test = require('node:test');
const assert = require('node:assert/strict');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = require('node:fs').readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  module._compile(output, filename);
};

const { processAuraTurn } = require('../src/lib/aura/engine.ts');
const fixtures = [
  { id: '1', name: 'Kochi Groom Studio', category: 'Groom Wear', categorySlug: 'groom-wear', city: 'Kochi', state: 'Kerala', rating: 4.7, reviewCount: 12, startingPrice: '₹8,500', logo: '', coverImage: '', isVerified: true, slug: 'kochi-groom', detailUrl: '/boutiques/kochi-groom' },
  { id: '2', name: 'Ernakulam Groom House', category: 'Groom Wear', categorySlug: 'groom-wear', city: 'Kochi', state: 'Kerala', rating: 4.5, reviewCount: 8, startingPrice: 'Contact for pricing', logo: '', coverImage: '', isVerified: true, slug: 'groom-house', detailUrl: '/boutiques/groom-house' },
  { id: '3', name: 'Kochi Lens', category: 'Photographers', categorySlug: 'photographers', city: 'Kochi', state: 'Kerala', rating: 4.9, reviewCount: 20, startingPrice: '₹12,000', logo: '', coverImage: '', isVerified: true, slug: 'kochi-lens', detailUrl: '/boutiques/kochi-lens' },
  { id: '4', name: 'Kochi Makeup One', category: 'Makeup Artists', categorySlug: 'makeup-artists', city: 'Kochi', state: 'Kerala', rating: 4.8, reviewCount: 10, startingPrice: '₹9,000', logo: '', coverImage: '', isVerified: true, slug: 'makeup-one', detailUrl: '/boutiques/makeup-one' },
  { id: '5', name: 'Kochi Makeup Two', category: 'Makeup Artists', categorySlug: 'makeup-artists', city: 'Kochi', state: 'Kerala', rating: 4.6, reviewCount: 7, startingPrice: '₹11,000', logo: '', coverImage: '', isVerified: true, slug: 'makeup-two', detailUrl: '/boutiques/makeup-two' },
  { id: '6', name: 'Kochi Exact Budget Studio', category: 'Groom Wear', categorySlug: 'groom-wear', city: 'Kochi', state: 'Kerala', rating: 4.3, reviewCount: 4, startingPrice: '₹10,000', logo: '', coverImage: '', isVerified: true, slug: 'exact-budget', detailUrl: '/boutiques/exact-budget' },
];

test('remembers introduction and answers the name follow-up', () => {
  const hello = processAuraTurn({ query: 'Hi, my name is Shaban.' });
  assert.equal(hello.memory.preferredName, 'Shaban');
  const answer = processAuraTurn({ query: 'What is my name?', memory: hello.memory });
  assert.match(answer.reply, /Shaban/);
});

test('classifies groom wear and applies the follow-up budget cap', () => {
  const first = processAuraTurn({ query: 'Find affordable groom wear in Kochi.', vendors: fixtures.slice(0, 2) });
  assert.equal(first.entities.category, 'groom wear');
  assert.equal(first.entities.city, 'Kochi');
  const second = processAuraTurn({ query: 'Show options under ₹10,000.', memory: first.memory, vendors: [fixtures[0], fixtures[1], fixtures[5]] });
  assert.equal(second.intent, 'budget_filter');
  assert.equal(second.entities.budgetStrict, true);
  assert.equal(second.groundedVendors.length, 1);
  assert.equal(second.groundedVendors[0].name, 'Kochi Groom Studio');
});

test('carries location context when category changes to photographers', () => {
  const prior = processAuraTurn({ query: 'Find groom wear in Kochi.', vendors: fixtures.slice(0, 2) });
  const next = processAuraTurn({ query: 'What about photographers?', memory: prior.memory, vendors: [fixtures[2]] });
  assert.equal(next.entities.category, 'photographers');
  assert.equal(next.entities.city, 'Kochi');
  assert.equal(next.groundedVendors[0].category, 'Photographers');
});

test('calculates the requested five lakh sample plan transparently', () => {
  const result = processAuraTurn({ query: 'Plan a wedding for ₹5 lakh.' });
  assert.equal(result.budgetPlan.totalBudget, 500000);
  assert.equal(result.budgetPlan.items.reduce((sum, item) => sum + item.amount, 0), 500000);
  assert.match(result.reply, /not vendor quotations/i);
});

test('provides a deterministic wedding planning checklist', () => {
  const result = processAuraTurn({ query: 'Give me a wedding checklist.' });
  assert.equal(result.topic, 'checklist');
  assert.ok(result.checklist.length >= 5);
  assert.ok(result.checklist.every((item) => item.completed === false));
});

test('recognizes Malayalam-English transliteration for a category and city', () => {
  const result = processAuraTurn({ query: 'Enikku Kochiyil makeup artist venam.', vendors: [] });
  assert.equal(result.entities.category, 'makeup artists');
  assert.equal(result.entities.city, 'Kochi');
  assert.equal(result.topic, 'vendors');
  assert.match(result.reply, /couldn.{1,3}t find verified/i);
});

test('comparison is grounded in the two named verified candidates', () => {
  const names = fixtures.slice(0, 2).map((vendor) => vendor.name);
  const result = processAuraTurn({ query: 'Compare Kochi Groom Studio and Ernakulam Groom House.', memory: { lastCategory: 'groom wear', lastCity: 'Kochi' }, knownVendorNames: names, vendors: fixtures.slice(0, 2) });
  assert.equal(result.topic, 'comparison');
  assert.match(result.reply, /you named/);
  const needsNames = processAuraTurn({ query: 'Compare these two vendors.', memory: { lastCategory: 'groom wear', lastCity: 'Kochi' }, vendors: fixtures.slice(0, 2) });
  assert.match(needsNames.reply, /Which two vendor names/);
});

test('supports first-two references and the requested multi-turn scenario', () => {
  let turn = processAuraTurn({ query: 'Hi, my name is Shaban.' });
  assert.equal(turn.memory.preferredName, 'Shaban');
  turn = processAuraTurn({ query: 'Find affordable groom wear in Kochi.', memory: turn.memory, vendors: fixtures.slice(0, 2) });
  assert.equal(turn.entities.city, 'Kochi');
  turn = processAuraTurn({ query: 'Show options under ₹10,000.', memory: turn.memory, vendors: [fixtures[0], fixtures[1], fixtures[5]] });
  assert.equal(turn.groundedVendors.length, 1);
  turn = processAuraTurn({ query: 'What about makeup artists?', memory: turn.memory, vendors: fixtures.slice(3, 5) });
  assert.equal(turn.entities.city, 'Kochi');
  assert.equal(turn.groundedVendors.length, 2, 'a groom-wear price filter must not silently filter the new category');
  turn = processAuraTurn({ query: 'Compare the first two vendors.', memory: turn.memory, vendors: fixtures.slice(3, 5) });
  assert.equal(turn.entities.vendorNames.length, 2);
  assert.match(turn.reply, /you named/);
  turn = processAuraTurn({ query: 'Plan a wedding with ₹5 lakh.', memory: turn.memory });
  assert.equal(turn.budgetPlan.totalBudget, 500000);
  turn = processAuraTurn({ query: 'Enikku Kochiyil photographer venam.', memory: turn.memory, vendors: [fixtures[2]] });
  assert.equal(turn.entities.category, 'photographers');
  assert.equal(turn.entities.city, 'Kochi');
  assert.match(processAuraTurn({ query: 'What is Python?', memory: turn.memory }).reply, /don’t have a curated knowledge entry/i);
  assert.match(processAuraTurn({ query: 'Write a React application.', memory: turn.memory }).reply, /not a general code-generation tool/i);
});

test('answers Python and React prompts from explicit knowledge limitations', () => {
  const python = processAuraTurn({ query: 'What is Python?' });
  const react = processAuraTurn({ query: 'Write a React application.' });
  assert.match(python.reply, /don’t have a curated knowledge entry/i);
  assert.match(react.reply, /not a general code-generation tool/i);
});

test('shared database limiter fails closed and keeps a per-user window contract', async () => {
  const Module = require('node:module');
  const originalLoad = Module._load;
  const modulePath = require.resolve('../src/lib/auraRateLimit.ts');
  let result = true;
  Module._load = function (request, parent, isMain) {
    if (request === '@/lib/auraServer') return { auraDbFetch: async () => {
      if (result instanceof Error) throw result;
      return result;
    } };
    return originalLoad.call(this, request, parent, isMain);
  };
  delete require.cache[modulePath];
  try {
    const { consumeAuraRateLimit, auraRateLimitConfig } = require('../src/lib/auraRateLimit.ts');
    assert.deepEqual(auraRateLimitConfig, { limit: 20, windowSeconds: 60 });
    result = false;
    assert.equal(await consumeAuraRateLimit('test-user'), false);
    result = new Error('database unavailable');
    await assert.rejects(consumeAuraRateLimit('test-user'), /database unavailable/);
  } finally {
    Module._load = originalLoad;
    delete require.cache[modulePath];
  }
});

test('database wrapper errors exclude raw database response bodies', async () => {
  const Module = require('node:module');
  const originalLoad = Module._load;
  const originalFetch = global.fetch;
  const oldUrl = process.env.SUPABASE_URL;
  const oldKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const modulePath = require.resolve('../src/lib/auraServer.ts');
  Module._load = function (request, parent, isMain) {
    if (request === '@/lib/auth') return { verifyJwtToken: () => null };
    return originalLoad.call(this, request, parent, isMain);
  };
  process.env.SUPABASE_URL = 'http://127.0.0.1:54321';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-only-key';
  global.fetch = async () => new Response('private SQL and customer data', { status: 500 });
  delete require.cache[modulePath];
  try {
    const { auraDbFetch } = require('../src/lib/auraServer.ts');
    await assert.rejects(auraDbFetch('aura_conversations'), (error) => {
      assert.match(error.message, /500/);
      assert.doesNotMatch(error.message, /private SQL|customer data/);
      return true;
    });
  } finally {
    Module._load = originalLoad;
    global.fetch = originalFetch;
    if (oldUrl === undefined) delete process.env.SUPABASE_URL; else process.env.SUPABASE_URL = oldUrl;
    if (oldKey === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY; else process.env.SUPABASE_SERVICE_ROLE_KEY = oldKey;
    delete require.cache[modulePath];
  }
});

test('production auth refuses to use the checked-in development JWT key', () => {
  const modulePath = require.resolve('../src/lib/auth.ts');
  const saved = {
    nodeEnv: process.env.NODE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    nextAuthSecret: process.env.NEXT_AUTH_SECRET,
  };
  process.env.NODE_ENV = 'production';
  delete process.env.JWT_SECRET;
  delete process.env.NEXT_AUTH_SECRET;
  delete require.cache[modulePath];
  try {
    const auth = require('../src/lib/auth.ts');
    assert.equal(auth.verifyJwtToken('header.payload.signature'), null);
    assert.throws(() => auth.signJwtToken({ userId: 'user', email: 'test@example.test', fullName: 'Test', roles: ['customer'] }), /secret is not configured/i);
    process.env.JWT_SECRET = 'test-only-production-secret-longer-than-32-chars';
    const configuredToken = auth.signJwtToken({ userId: 'user', email: 'test@example.test', fullName: 'Test', roles: ['customer'] });
    assert.equal(auth.verifyJwtToken(configuredToken).userId, 'user');
  } finally {
    if (saved.nodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = saved.nodeEnv;
    if (saved.jwtSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = saved.jwtSecret;
    if (saved.nextAuthSecret === undefined) delete process.env.NEXT_AUTH_SECRET; else process.env.NEXT_AUTH_SECRET = saved.nextAuthSecret;
    delete require.cache[modulePath];
  }
});
