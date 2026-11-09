import type { AuraEntities } from "./entities";

export type AuraIntent =
  | "greeting"
  | "introduce"
  | "ask_name"
  | "vendor_search"
  | "vendor_comparison"
  | "wedding_budget_planning"
  | "wedding_checklist"
  | "wedding_planning_guidance"
  | "service_information"
  | "general_knowledge"
  | "conversation_follow_up"
  | "clarification_response"
  | "unsupported_request";

export interface AuraIntentContext {
  lastIntent?: AuraIntent | string;
  pendingIntent?: "vendor_search" | "wedding_budget_planning";
  pendingField?: "category" | "location" | "budget" | "guestCount" | "functionType";
}

const VENDOR_ACTION = /\b(?:find|search|show|recommend|looking\s+for|list|browse|hire|book)\b/i;
const COMPARISON = /\b(?:compare|comparison|versus|vs\.?|difference\s+between)\b/i;
const BUDGET_FILTER = /\b(?:under|below|less\s+than|cheaper|cheapest|lower[- ]priced|options\s+under)\b/i;
const WEDDING_WORD = /\b(?:wedding|marriage|married|marriage\s+function|function)\b|വിവാഹ/i;
const BUDGET_WORD = /\b(?:budget|costs?|expenses?|₹|rs\.?)\b|ബജറ്റ്/i;
const PLANNING_ACTION = /\b(?:plan|planning|manage|organize|organise|allocate|split|what\s+to\s+do|where\s+do\s+i\s+start)\b/i;
const CHECKLIST = /\b(?:checklist|to[- ]do\s+list|tasks)\b/i;
const GREETING = /^(?:hi+|hey+|hello+|hola|yo|gm|gn|good\s+(?:morning|afternoon|evening)|namaste|namaskar|namaskaram|sughamano)[!.,\s]*$/i;
const INTRODUCE = /\b(?:my\s+name\s+is|i\s+am|i'm|call\s+me)\b|എന്റെ പേര്/i;
const ASK_NAME = /\b(?:what\s+is|what's|do\s+you\s+know)\s+(?:my\s+)?name\b|എന്റെ പേര്.*എന്ത്/i;
const KNOWLEDGE_QUESTION = /\b(?:what\s+is|what\s+are|explain|how\s+does|define|why\s+is)\b/i;
const UNSUPPORTED = /\b(?:write|build|create|code|program|application|essay|poem)\b/i;
const FOLLOW_UP = /\b(?:what\s+about|also|show\s+(?:me\s+)?(?:cheaper|more|other)|cheaper|more\s+options|those|these|them|instead)\b/i;
const SERVICE_INFORMATION = /\b(?:cloche|vendor\s+selection|choose\s+(?:a\s+)?vendor|select\s+(?:a\s+)?vendor|book\s+(?:a\s+)?vendor)\b/i;

export function classifyIntent(text: string, entities: AuraEntities, context: AuraIntentContext = {}): AuraIntent {
  if (INTRODUCE.test(text)) return "introduce";
  if (ASK_NAME.test(text)) return "ask_name";
  if (GREETING.test(text)) return "greeting";
  if (CHECKLIST.test(text)) return "wedding_checklist";
  if (COMPARISON.test(text) || entities.comparison) return "vendor_comparison";

  const explicitVendorRequest = VENDOR_ACTION.test(text) && Boolean(entities.category);
  const vendorBudgetRequest = Boolean(entities.category && entities.budget !== undefined && !WEDDING_WORD.test(text));
  if (explicitVendorRequest || vendorBudgetRequest) return "vendor_search";

  const weddingPlanningRequest = WEDDING_WORD.test(text)
    && (PLANNING_ACTION.test(text) || BUDGET_WORD.test(text) || entities.budget !== undefined);
  if (weddingPlanningRequest) {
    return BUDGET_WORD.test(text) || entities.budget !== undefined
      ? "wedding_budget_planning"
      : "wedding_planning_guidance";
  }
  if (WEDDING_WORD.test(text) && PLANNING_ACTION.test(text)) return "wedding_planning_guidance";

  if (SERVICE_INFORMATION.test(text)) return "service_information";
  if (KNOWLEDGE_QUESTION.test(text)) return "general_knowledge";
  if (UNSUPPORTED.test(text)) return "unsupported_request";

  const activeVendorSearch = context.pendingIntent === "vendor_search"
    || context.lastIntent === "vendor_search"
    || context.lastIntent === "vendor_comparison"
    || context.lastIntent === "conversation_follow_up"
    || ["vendors", "budget_filter", "compare"].includes(String(context.lastIntent || ""));
  if (context.pendingIntent) return "clarification_response";
  if (activeVendorSearch && entities.category && FOLLOW_UP.test(text)) return "conversation_follow_up";
  if (FOLLOW_UP.test(text) && activeVendorSearch) return "conversation_follow_up";
  if (context.pendingIntent === "vendor_search"
    && ((context.pendingField === "location" && entities.city) || (context.pendingField === "category" && entities.category))) {
    return "clarification_response";
  }
  if (entities.category && (VENDOR_ACTION.test(text) || (entities.city && WEDDING_WORD.test(text) === false))) return "vendor_search";
  if (BUDGET_FILTER.test(text) && activeVendorSearch) return "conversation_follow_up";
  if (WEDDING_WORD.test(text) && PLANNING_ACTION.test(text)) return "wedding_planning_guidance";
  if (/\b(?:help|information|services?)\b/i.test(text)) return "service_information";
  if (UNSUPPORTED.test(text)) return "unsupported_request";
  return "unsupported_request";
}
