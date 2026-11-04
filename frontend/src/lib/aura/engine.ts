import { extractEntities, mergeEntities, type AuraEntities } from "./entities";
import { classifyIntent, type AuraIntent } from "./intents";
import { detectLanguage, normalizeMessage } from "./normalize";
import { generateResponse, type AuraMemory, type AuraEngineResult } from "./response";
import type { AuraVendorItem } from "../auraEngine";

export interface AuraTurn { query: string; memory?: AuraMemory; vendors?: AuraVendorItem[]; guestCount?: number; knownVendorNames?: string[]; }

export function processAuraTurn(input: AuraTurn): AuraEngineResult & { intent: AuraIntent; entities: AuraEntities } {
  const query = normalizeMessage(input.query);
  const sourceMemory = input.memory || {};
  const current = extractEntities(query, input.knownVendorNames);
  const categoryChanged = Boolean(current.category && sourceMemory.lastCategory && current.category !== sourceMemory.lastCategory);
  const previous = categoryChanged ? { ...sourceMemory, lastBudget: undefined, budget: undefined } : sourceMemory;
  let entities = mergeEntities(previous, current);
  const pendingVendorSearch = ["vendors", "budget_filter", "compare"].includes(previous.lastIntent || "") && Boolean(previous.lastCategory || previous.lastCity);
  const intent = classifyIntent(query, entities, pendingVendorSearch);
  if (intent === "compare" && entities.vendorNames.length < 2 && /\b(?:first\s+two|top\s+two|these\s+two)\b/i.test(query)) {
    entities = { ...entities, vendorNames: (previous.recentVendors || []).slice(0, 2).map((vendor) => vendor.name) };
  }
  const result = generateResponse({ query, intent, language: detectLanguage(query), entities, memory: previous, vendors: input.vendors, guestCount: input.guestCount });
  return { ...result, intent, entities };
}

