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
  assert.equal(second.intent, 'conversation_follow_up');
  assert.equal(second.responseIntent, 'budget_filter');
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
  assert.match(result.reply, /not actual vendor quotations/i);
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

test('resolves a pending photographer location and searches using the merged context', () => {
  const first = processAuraTurn({ query: 'Find photographers.' });
  assert.equal(first.memory.pendingIntent, 'vendor_search');
  assert.equal(first.memory.pendingField, 'location');
  assert.match(first.reply, /Which city or area/i);

  const inPerinthalmanna = { ...fixtures[2], city: 'Perinthalmanna', detailUrl: '/boutiques/perinthalmanna-lens' };
  const result = processAuraTurn({
    query: 'Perinthalmanna.',
    memory: first.memory,
    vendors: [inPerinthalmanna],
  });
  assert.equal(result.intent, 'clarification_response');
  assert.equal(result.entities.category, 'photographers');
  assert.equal(result.entities.city, 'Perinthalmanna');
  assert.equal(result.groundedVendors[0].id, inPerinthalmanna.id);
  assert.match(result.reply, /photographers in Perinthalmanna/i);
  assert.equal(result.memory.pendingIntent, undefined);
  assert.equal(result.memory.lastCity, 'Perinthalmanna');
});

test('resolves pending makeup artist location follow-ups', () => {
  const first = processAuraTurn({ query: 'Find makeup artists.' });
  const makeup = { ...fixtures[3], city: 'Kozhikode' };
  const result = processAuraTurn({ query: 'Kozhikode', memory: first.memory, vendors: [makeup] });
  assert.equal(result.entities.category, 'makeup artists');
  assert.equal(result.entities.city, 'Kozhikode');
  assert.equal(result.groundedVendors[0].id, makeup.id);
});

test('preserves a previous budget while resolving a pending location', () => {
  const first = processAuraTurn({ query: 'Find photographers under ₹20,000.' });
  const kannurPhotographer = { ...fixtures[2], city: 'Kannur' };
  const result = processAuraTurn({ query: 'Kannur', memory: first.memory, vendors: [kannurPhotographer] });
  assert.equal(result.entities.budget, 20000);
  assert.equal(result.entities.city, 'Kannur');
  assert.equal(result.groundedVendors[0].id, kannurPhotographer.id);
  assert.match(result.reply, /under ₹20,000/i);
});

test('searches immediately when a location is included in the original request', () => {
  const result = processAuraTurn({
    query: 'Find photographers in Perinthalmanna.',
    vendors: [{ ...fixtures[2], city: 'Perinthalmanna' }],
  });
  assert.equal(result.entities.city, 'Perinthalmanna');
  assert.equal(result.memory.pendingField, undefined);
  assert.equal(result.groundedVendors.length, 1);
});

test('a pending location request can be replaced by a new category and location', () => {
  const first = processAuraTurn({ query: 'Find photographers.' });
  const makeup = { ...fixtures[3], city: 'Malappuram' };
  const result = processAuraTurn({
    query: 'Actually, find makeup artists in Malappuram.',
    memory: first.memory,
    vendors: [makeup],
  });
  assert.equal(result.entities.category, 'makeup artists');
  assert.equal(result.entities.city, 'Malappuram');
  assert.equal(result.groundedVendors[0].id, makeup.id);
  assert.equal(result.memory.pendingIntent, undefined);
});

test('an uncertain reply is not treated as a location and keeps the pending search', () => {
  const first = processAuraTurn({ query: 'Find photographers.' });
  const uncertain = processAuraTurn({ query: "I don't know.", memory: first.memory });
  assert.match(uncertain.reply, /No problem/i);
  assert.doesNotMatch(uncertain.reply, /Which city or area should I search/i);
  assert.equal(uncertain.entities.city, undefined);
  assert.equal(uncertain.memory.pendingField, 'location');
});

test('does not repeat the location clarification after a valid answer', () => {
  const first = processAuraTurn({ query: 'Find photographers.' });
  const result = processAuraTurn({
    query: 'Perinthalmanna',
    memory: first.memory,
    vendors: [],
  });
  assert.doesNotMatch(result.reply, /Which city or area should I search/i);
  assert.match(result.reply, /couldn.t find verified.*Perinthalmanna/i);
});

test('searches photographers in Thrissur as a vendor search', () => {
  const result = processAuraTurn({ query: 'Find photographers in Thrissur.', vendors: [{ ...fixtures[2], city: 'Thrissur' }] });
  assert.equal(result.intent, 'vendor_search');
  assert.equal(result.responseIntent, 'vendors');
  assert.equal(result.entities.category, 'photographers');
  assert.equal(result.entities.city, 'Thrissur');
  assert.equal(result.groundedVendors[0].city, 'Thrissur');
});

test('routes the exact 5 lakh marriage-function request to the budget planner without vendor context', () => {
  const vendorTurn = processAuraTurn({ query: 'Find photographers in Thrissur.', vendors: [fixtures[2]] });
  const result = processAuraTurn({
    query: 'I have about 5 lakh rupees and I want to do a marriage function. What to do?',
    memory: vendorTurn.memory,
    vendors: [fixtures[2]],
  });
  assert.equal(result.intent, 'wedding_budget_planning');
  assert.equal(result.responseIntent, 'budget_plan');
  assert.equal(result.entities.budget, 500000);
  assert.equal(result.entities.category, undefined);
  assert.equal(result.entities.city, undefined);
  assert.equal(result.groundedVendors, undefined);
  assert.equal(result.budgetPlan.totalBudget, 500000);
  assert.equal(result.budgetPlan.city, '');
  assert.match(result.reply, /illustrative sample allocation/i);
  assert.match(result.reply, /guest count/i);
  assert.match(result.reply, /wedding location/i);
  assert.equal(result.budgetPlan.functionType, 'marriage function');
  assert.doesNotMatch(result.reply, /what is your function type/i);
  assert.equal(result.memory.lastCategory, undefined);
  assert.equal(result.memory.lastCity, undefined);
  assert.equal(result.memory.recentVendors, undefined);
});

test('continues wedding-budget clarification turns and clears pending state when complete', () => {
  let turn = processAuraTurn({ query: 'Plan a wedding with ₹5 lakh.' });
  assert.equal(turn.intent, 'wedding_budget_planning');
  assert.equal(turn.memory.pendingField, 'guestCount');

  turn = processAuraTurn({ query: '250 guests', memory: JSON.parse(JSON.stringify(turn.memory)) });
  assert.equal(turn.intent, 'clarification_response');
  assert.equal(turn.responseIntent, 'budget_plan');
  assert.equal(turn.budgetPlan.totalBudget, 500000);
  assert.equal(turn.budgetPlan.guestCount, 250);
  assert.equal(turn.memory.pendingField, 'location');

  turn = processAuraTurn({ query: 'Perinthalmanna', memory: turn.memory });
  assert.equal(turn.budgetPlan.city, 'Perinthalmanna');
  assert.equal(turn.memory.pendingField, 'functionType');

  turn = processAuraTurn({ query: 'Reception', memory: turn.memory });
  assert.equal(turn.budgetPlan.functionType, 'Reception');
  assert.equal(turn.memory.pendingIntent, undefined);
  assert.equal(turn.memory.pendingField, undefined);
});

test('an explicit wedding plan switches away from a previous vendor search', () => {
  const prior = processAuraTurn({ query: 'Find photographers in Thrissur.', vendors: [fixtures[2]] });
  const result = processAuraTurn({
    query: 'Actually, help me plan a wedding for ₹5 lakh.',
    memory: prior.memory,
    vendors: [fixtures[2]],
  });
  assert.equal(result.intent, 'wedding_budget_planning');
  assert.equal(result.budgetPlan.totalBudget, 500000);
  assert.equal(result.groundedVendors, undefined);
  assert.equal(result.memory.lastCategory, undefined);
  assert.equal(result.memory.lastCity, undefined);
});

test('keeps vendor contexts independent when switching conversations', () => {
  const conversationA = processAuraTurn({ query: 'Find photographers in Thrissur.', vendors: [fixtures[2]] });
  const conversationB = processAuraTurn({ query: 'I want makeup artists in Malappuram.', vendors: [{ ...fixtures[3], city: 'Malappuram' }] });
  assert.equal(conversationA.memory.lastCategory, 'photographers');
  assert.equal(conversationA.memory.lastCity, 'Thrissur');
  assert.equal(conversationB.memory.lastCategory, 'makeup artists');
  assert.equal(conversationB.memory.lastCity, 'Malappuram');
  const restoredA = processAuraTurn({ query: 'Show cheaper options.', memory: JSON.parse(JSON.stringify(conversationA.memory)), vendors: [fixtures[2]] });
  assert.equal(restoredA.responseIntent, 'vendors');
  assert.equal(restoredA.entities.category, 'photographers');
  assert.equal(restoredA.entities.city, 'Thrissur');
});

test('uses follow-up language only with active vendor-search context', () => {
  const prior = processAuraTurn({ query: 'Find photographers in Thrissur.', vendors: [fixtures[2]] });
  const inContext = processAuraTurn({ query: 'Show cheaper options.', memory: prior.memory, vendors: [fixtures[2]] });
  const newConversation = processAuraTurn({ query: 'Show cheaper options.' });
  assert.equal(inContext.intent, 'conversation_follow_up');
  assert.equal(inContext.entities.category, 'photographers');
  assert.equal(inContext.entities.city, 'Thrissur');
  assert.equal(newConversation.intent, 'unsupported_request');
  assert.equal(newConversation.entities.category, undefined);
  assert.equal(newConversation.entities.city, undefined);
});

test('recognizes wedding budget guidance as planning, not vendor discovery', () => {
  const result = processAuraTurn({ query: 'What is the best way to manage a ₹5 lakh wedding budget?' });
  assert.equal(result.intent, 'wedding_budget_planning');
  assert.equal(result.responseIntent, 'budget_plan');
  assert.equal(result.budgetPlan.totalBudget, 500000);
  assert.equal(result.groundedVendors, undefined);
});

test('keeps a photographer under-₹20,000 request in vendor search', () => {
  const result = processAuraTurn({
    query: 'Find photographers with a budget under ₹20,000.',
    vendors: [fixtures[2]],
  });
  assert.equal(result.intent, 'vendor_search');
  assert.equal(result.entities.category, 'photographers');
  assert.equal(result.entities.budget, 20000);
  assert.equal(result.groundedVendors.length, 1);
});

test('extracts wedding location and budget without carrying vendor location', () => {
  const prior = processAuraTurn({ query: 'Find photographers in Thrissur.', vendors: [fixtures[2]] });
  const result = processAuraTurn({
    query: 'I want to plan a wedding in Perinthalmanna with ₹5 lakh.',
    memory: prior.memory,
  });
  assert.equal(result.intent, 'wedding_budget_planning');
  assert.equal(result.entities.city, 'Perinthalmanna');
  assert.equal(result.entities.budget, 500000);
  assert.equal(result.budgetPlan.city, 'Perinthalmanna');
  assert.notEqual(result.budgetPlan.city, 'Thrissur');
});

test('starts a new conversation without previous vendor-search state', () => {
  const previousConversation = processAuraTurn({ query: 'Find photographers in Thrissur.', vendors: [fixtures[2]] });
  const newConversation = processAuraTurn({ query: 'Hi!' });
  assert.equal(newConversation.intent, 'greeting');
  assert.equal(newConversation.responseIntent, 'greeting');
  assert.equal(newConversation.groundedVendors, undefined);
  assert.equal(newConversation.memory.lastCity, undefined);
  assert.equal(previousConversation.memory.lastCity, 'Thrissur');
});

test('pending clarification survives serializing and restoring conversation context', () => {
  const first = processAuraTurn({ query: 'Find photographers.' });
  const restoredMemory = JSON.parse(JSON.stringify(first.memory));
  const result = processAuraTurn({
    query: 'Perinthalmanna',
    memory: restoredMemory,
    vendors: [{ ...fixtures[2], city: 'Perinthalmanna' }],
  });
  assert.equal(result.entities.city, 'Perinthalmanna');
  assert.equal(result.groundedVendors.length, 1);
  assert.equal(result.memory.pendingIntent, undefined);
});

test('does not treat a bare city as a vendor search without a pending location question', () => {
  const priorSearch = processAuraTurn({
    query: 'Find photographers in Kochi.',
    vendors: [fixtures[2]],
  });
  const unrelated = processAuraTurn({ query: 'Perinthalmanna', memory: priorSearch.memory });
  assert.notEqual(unrelated.intent, 'vendors');
  assert.equal(unrelated.memory.lastCity, undefined);
  assert.equal(unrelated.groundedVendors, undefined);
});

test('asks a different, specific clarification for an ambiguous pending-location reply', () => {
  const first = processAuraTurn({ query: 'Find photographers.' });
  const unclear = processAuraTurn({ query: 'Maybe nearby.', memory: first.memory });
  assert.notEqual(unclear.reply, first.reply);
  assert.match(unclear.reply, /Please name a city or town/i);
  assert.equal(unclear.memory.pendingField, 'location');
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

test('routes Cloche service questions to maintained service information', () => {
  const result = processAuraTurn({ query: 'What services does Cloche offer?' });
  assert.equal(result.intent, 'service_information');
  assert.equal(result.topic, 'knowledge');
  assert.match(result.reply, /registered wedding-vendor listings/i);
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
