import type { AuraEntities } from "./entities";

export type AuraIntent = "greeting" | "introduce" | "ask_name" | "vendors" | "budget_filter" | "compare" | "budget_plan" | "checklist" | "planning" | "knowledge" | "unsupported" | "clarify";

const PHRASES: Record<AuraIntent, RegExp[]> = {
  greeting: [
    /\b(h+i+|h+e+y+|h+e+l+l*o+|h+e+l+a+|hola|yo|gm|gn)\b/i,
    /\b(good\s*(morning|afternoon|evening))\b/i,
    /\b(namaste|namaskar|namaskaram|sughamano)\b/i,
    /^(h+i+|h+e+y+|h+e+l+l*o+|hola|yo|namaste|namaskaram|halo+)[!.,\s]*$/i,
    /ഹലോ|നമസ്കാരം/i,
  ],
  introduce: [/\b(my name is|i am|i'm|call me)\b/i, /എന്റെ പേര്/],
  ask_name: [/\b(what is|what's|do you know)\s+(my\s+)?name\b/i, /എന്റെ പേര്.*എന്ത്/],
  vendors: [
    /\b(find|show|search|recommend|looking for|options|want|need|about|tell me about|info on|details on|show me)\b/i,
    /\b(photographer|groom wear|makeup artist|venue|caterer|decor|mehendi)\b/i,
    /വേണം|കാണിക്കൂ/i,
  ],
  budget_filter: [/\b(under|below|within|options under|show options)\b/i, /താഴെ|ബജറ്റ്/],
  compare: [/\b(compare|versus|\bvs\b|difference between)\b/i, /താരതമ്യം/],
  budget_plan: [/\b(plan|budget|allocate|split)\b/i, /ബജറ്റ്|പ്ലാൻ/],
  checklist: [/\b(checklist|to-do|todo|tasks)\b/i, /ചെക്ക്ലിസ്റ്റ്/],
  planning: [/\b(plan|planning|timeline|where do i start)\b/i, /ആസൂത്രണം/],
  knowledge: [/\b(what is|what are|explain|how does|define)\b/i, /എന്താണ്/],
  unsupported: [/\b(write|build|create|code|program|application|app|essay|poem)\b/i],
  clarify: [],
};

export function classifyIntent(text: string, entities: AuraEntities, hasPendingVendorSearch = false): AuraIntent {
  if (PHRASES.introduce.some((p) => p.test(text))) return "introduce";
  if (PHRASES.ask_name.some((p) => p.test(text))) return "ask_name";
  if (PHRASES.greeting.some((p) => p.test(text))) return "greeting";
  if (PHRASES.compare.some((p) => p.test(text)) || entities.comparison) return "compare";
  if (PHRASES.checklist.some((p) => p.test(text))) return "checklist";
  if (PHRASES.budget_plan.some((p) => p.test(text)) && (entities.budget || /wedding|വിവാഹ/i.test(text))) return "budget_plan";
  if (PHRASES.knowledge.some((p) => p.test(text))) return "knowledge";
  if (PHRASES.unsupported.some((p) => p.test(text))) return "unsupported";
  if (entities.category && (PHRASES.vendors.some((p) => p.test(text)) || hasPendingVendorSearch || entities.city || entities.budget)) return entities.budget && hasPendingVendorSearch ? "budget_filter" : "vendors";
  if (hasPendingVendorSearch && entities.budget) return "budget_filter";
  if (PHRASES.vendors.some((p) => p.test(text)) && !entities.category) return "clarify";
  if (PHRASES.planning.some((p) => p.test(text))) return "planning";
  return "unsupported";
}

