import { extractEntities, mergeEntities, type AuraEntities } from "./entities";
import { classifyIntent, type AuraIntent } from "./intents";
import { detectLanguage, normalizeMessage } from "./normalize";
import { generateResponse, type AuraMemory, type AuraEngineResult, type AuraResponseIntent } from "./response";
import type { AuraVendorItem } from "../auraEngine";

export interface AuraTurn { query: string; memory?: AuraMemory; vendors?: AuraVendorItem[]; guestCount?: number; knownVendorNames?: string[]; }
export interface AuraProcessedTurn extends AuraEngineResult {
  intent: AuraIntent;
  responseIntent: AuraResponseIntent;
  entities: AuraEntities;
}

function responseIntentFor(intent: AuraIntent, text: string, entities: AuraEntities, pendingIntent?: AuraMemory["pendingIntent"]): AuraResponseIntent {
  switch (intent) {
    case "introduce": return "introduce";
    case "ask_name": return "ask_name";
    case "greeting": return "greeting";
    case "vendor_search": return "vendors";
    case "vendor_comparison": return "compare";
    case "wedding_budget_planning":
    case "wedding_planning_guidance": return "budget_plan";
    case "wedding_checklist": return "checklist";
    case "service_information":
    case "general_knowledge": return "knowledge";
    case "clarification_response":
      return pendingIntent === "vendor_search" ? "vendors" : pendingIntent === "wedding_budget_planning" ? "budget_plan" : "unsupported";
    case "conversation_follow_up":
      return entities.budget !== undefined && /\b(?:under|below|less than|cheaper|cheapest)\b/i.test(text) ? "budget_filter" : "vendors";
    default: return "unsupported";
  }
}

function clearVendorContext(memory: AuraMemory): AuraMemory {
  const next = { ...memory };
  delete next.lastCategory;
  delete next.lastCity;
  delete next.lastBudget;
  delete next.lastBudgetStrict;
  delete next.recentVendors;
  delete next.pendingIntent;
  delete next.pendingField;
  delete next.category;
  delete next.city;
  delete next.budget;
  delete next.budgetStrict;
  delete next.guestCount;
  delete next.functionType;
  delete next.vendorNames;
  delete next.comparison;
  return next;
}

export function processAuraTurn(input: AuraTurn): AuraProcessedTurn {
  const query = normalizeMessage(input.query);
  const sourceMemory = input.memory || {};
  const pendingLocation = sourceMemory.pendingField === "location";
  const plannerPendingField = sourceMemory.pendingIntent === "wedding_budget_planning" && sourceMemory.pendingField !== "category"
    ? sourceMemory.pendingField
    : undefined;
  const expectedField = plannerPendingField || (pendingLocation ? "location" : undefined);
  const cancelled = /\b(?:never\s+mind|cancel(?:\s+(?:that|this|it))?|stop\s+(?:searching|looking)|forget\s+it)\b/i.test(query);
  const current = extractEntities(query, input.knownVendorNames, expectedField);
  const intent = cancelled
    ? "unsupported_request"
    : classifyIntent(query, current, sourceMemory);
  const retainsVendorContext = intent === "conversation_follow_up" || intent === "clarification_response" || intent === "vendor_comparison";
  const baseMemory = retainsVendorContext ? sourceMemory : clearVendorContext(sourceMemory);
  const categoryChanged = Boolean(current.category && sourceMemory.lastCategory && current.category !== sourceMemory.lastCategory);
  const previous = categoryChanged && retainsVendorContext
    ? { ...baseMemory, lastBudget: undefined, budget: undefined, lastBudgetStrict: undefined, budgetStrict: undefined }
    : baseMemory;
  let entities = retainsVendorContext
    ? mergeEntities(previous, current)
    : current;

  if (intent === "vendor_search" && current.category) {
    entities = { ...current, vendorNames: current.vendorNames, comparison: current.comparison };
  }
  if (cancelled) {
    delete previous.pendingIntent;
    delete previous.pendingField;
  }

  const responseIntent = responseIntentFor(intent, query, entities, sourceMemory.pendingIntent);
  if (intent === "vendor_comparison" && entities.vendorNames.length < 2 && /\b(?:first\s+two|top\s+two|these\s+two)\b/i.test(query)) {
    entities = { ...entities, vendorNames: (previous.recentVendors || []).slice(0, 2).map((vendor) => vendor.name) };
  }
  if (intent === "vendor_search" && entities.category && entities.city) {
    delete previous.pendingIntent;
    delete previous.pendingField;
  }
  if (intent === "conversation_follow_up" && current.category && current.category !== sourceMemory.lastCategory) {
    entities = { ...entities, budget: undefined, budgetStrict: undefined };
  }

  const result = generateResponse({
    query,
    intent: responseIntent,
    language: detectLanguage(query),
    entities,
    memory: previous,
    vendors: input.vendors,
    guestCount: input.guestCount,
  });
  result.memory.lastIntent = intent;
  if (intent === "vendor_search" || intent === "vendor_comparison" || intent === "conversation_follow_up" || intent === "clarification_response") {
    result.memory.lastCategory = entities.category || result.memory.lastCategory;
    if (entities.city) result.memory.lastCity = entities.city;
  }
  return { ...result, intent, responseIntent, entities };
}
