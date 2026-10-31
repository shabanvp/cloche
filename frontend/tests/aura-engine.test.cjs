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
  const second = processAuraTurn({ query: 'Show options under ₹10,000.', memory: first.memory, vendors: fixtures.slice(0, 2) });
  assert.equal(second.intent, 'budget_filter');
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
  assert.match(result.reply, /couldn’t find verified/i);
});

test('comparison is grounded in the two named verified candidates', () => {
  const names = fixtures.slice(0, 2).map((vendor) => vendor.name);
  const result = processAuraTurn({ query: 'Compare Kochi Groom Studio and Ernakulam Groom House.', memory: { lastCategory: 'groom wear', lastCity: 'Kochi' }, knownVendorNames: names, vendors: fixtures.slice(0, 2) });
  assert.equal(result.topic, 'comparison');
  assert.match(result.reply, /you named/);
  const needsNames = processAuraTurn({ query: 'Compare these two vendors.', memory: { lastCategory: 'groom wear', lastCity: 'Kochi' }, vendors: fixtures.slice(0, 2) });
  assert.match(needsNames.reply, /Which two vendor names/);
});

test('answers Python and React prompts from explicit knowledge limitations', () => {
  const python = processAuraTurn({ query: 'What is Python?' });
  const react = processAuraTurn({ query: 'Write a React application.' });
  assert.match(python.reply, /don’t have a curated knowledge entry/i);
  assert.match(react.reply, /not a general code-generation tool/i);
});
