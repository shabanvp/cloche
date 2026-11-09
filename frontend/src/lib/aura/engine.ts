import { extractEntities, mergeEntities, type AuraEntities } from "./entities";
import { classifyIntent, type AuraIntent } from "./intents";
import { detectLanguage, normalizeMessage } from "./normalize";
import { generateResponse, type AuraMemory, type AuraEngineResult } from "./response";
import type { AuraVendorItem } from "../auraEngine";

export interface AuraTurn { query: string; memory?: AuraMemory; vendors?: AuraVendorItem[]; guestCount?: number; knownVendorNames?: string[]; }

export function processAuraTurn(input: AuraTurn): AuraEngineResult & { intent: AuraIntent; entities: AuraEntities } {
  const query = normalizeMessage(input.query);
  const sourceMemory = input.memory || {};
  const pendingLocation = sourceMemory.pendingIntent === "vendor_search" && sourceMemory.pendingField === "location";
  const cancelled = /\b(?:never\s+mind|cancel(?:\s+(?:that|this|it))?|stop\s+(?:searching|looking)|forget\s+it)\b/i.test(query);
  const current = extractEntities(query, input.knownVendorNames, pendingLocation ? "location" : undefined);
  const categoryChanged = Boolean(current.category && sourceMemory.lastCategory && current.category !== sourceMemory.lastCategory);
  const previous = {
    ...sourceMemory,
    ...(categoryChanged ? { lastBudget: undefined, budget: undefined } : {}),
    ...(cancelled ? { pendingIntent: undefined, pendingField: undefined } : {}),
  };
  let entities = mergeEntities(previous, current);
  const pendingVendorSearch = previous.pendingIntent === "vendor_search"
    || (["vendors", "budget_filter", "compare"].includes(previous.lastIntent || "")
      && Boolean(current.category || current.budget !== undefined || current.vendorNames.length));
  const intent = cancelled
    ? "unsupported"
    : classifyIntent(query, { ...entities, city: current.city, budget: current.budget }, pendingVendorSearch);
  if (intent === "compare" && entities.vendorNames.length < 2 && /\b(?:first\s+two|top\s+two|these\s+two)\b/i.test(query)) {
    entities = { ...entities, vendorNames: (previous.recentVendors || []).slice(0, 2).map((vendor) => vendor.name) };
  }
  const result = generateResponse({ query, intent, language: detectLanguage(query), entities, memory: previous, vendors: input.vendors, guestCount: input.guestCount });
  return { ...result, intent, entities };
}
