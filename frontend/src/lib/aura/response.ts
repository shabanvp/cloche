import type { AuraIntent } from "./intents";
import type { AuraLanguage } from "./normalize";
import type { AuraEntities } from "./entities";
import type { AuraVendorItem } from "../auraEngine";
import { retrieveKnowledge } from "./knowledge";

export interface AuraMemory extends Partial<AuraEntities> {
  preferredName?: string;
  lastIntent?: AuraIntent | string;
  pendingIntent?: "vendor_search" | "wedding_budget_planning";
  pendingField?: "category" | "location" | "budget" | "guestCount" | "functionType";
  lastCategory?: string;
  lastCity?: string;
  lastBudget?: number;
  lastBudgetStrict?: boolean;
  recentVendors?: AuraVendorItem[];
}

export type AuraResponseIntent = "greeting" | "introduce" | "ask_name" | "vendors" | "budget_filter" | "compare" | "budget_plan" | "checklist" | "planning" | "knowledge" | "unsupported" | "clarify";
export interface AuraEngineResult { reply: string; topic: string; groundedVendors?: AuraVendorItem[]; budgetPlan?: { totalBudget: number; guestCount: number; city: string; functionType?: string; items: Array<{ category: string; percentage: number; amount: number; note: string }> }; checklist?: Array<{ id: string; title: string; category: string; completed: boolean }>; memory: AuraMemory; }

const MALAYALAM = {
  greeting: "നമസ്കാരം! എങ്ങനെ സഹായിക്കണം?",
  nameSaved: (name: string) => `സന്തോഷം, ${name}! ഈ സംഭാഷണത്തിൽ നിങ്ങളുടെ പേര് ഓർക്കാം.`,
  nameUnknown: "ഈ സംഭാഷണത്തിൽ നിങ്ങൾ പേര് പറഞ്ഞിട്ടില്ല. പറഞ്ഞാൽ ഈ ചാറ്റിൽ ഓർത്തുവെക്കാം.",
  askCity: "ഏത് നഗരത്തിലോ പ്രദേശത്തിലോ വേണം?",
  noVendors: "നൽകിയ മാനദണ്ഡങ്ങൾക്ക് അനുയോജ്യമായ verified Cloche vendor-കളെ കണ്ടെത്താനായില്ല.",
  unsupported: "Wedding vendor-കൾ, budget, planning checklist എന്നിവയിൽ സഹായിക്കാം. എന്താണ് വേണ്ടത്?",
};

export function makeChecklist() {
  return [
    ["budget", "Set total budget and contingency"],
    ["date", "Choose wedding date and guest estimate"],
    ["venue", "Shortlist and confirm venue"],
    ["vendors", "Compare and book essential vendors"],
    ["attire", "Plan wedding outfits and fittings"],
    ["invitations", "Prepare and send invitations"],
    ["final", "Confirm schedule, inclusions and payments"],
  ].map(([category, title], index) => ({ id: `wedding-${index + 1}`, category, title, completed: false }));
}

function budgetBreakdown(total: number) {
  const allocations: Array<[string, number, string]> = [
    ["Venue", 18, "Illustrative share; confirm venue capacity and quotation."],
    ["Catering", 30, "Illustrative share; depends on guest count, menu and service."],
    ["Photography and videography", 10, "Illustrative share; compare coverage and written packages."],
    ["Decoration", 8, "Illustrative share; confirm the venue's included setup."],
    ["Bridal and groom expenses", 12, "Illustrative share for attire, grooming and related needs."],
    ["Invitations and miscellaneous", 8, "Illustrative share for invitations, transport and small expenses."],
    ["Contingency", 14, "Reserve for unexpected expenses; adjust to local quotations."],
  ];
  return allocations.map(([category, percentage, note]) => ({ category, percentage, amount: Math.round(total * Number(percentage) / 100), note }));
}

export function generateResponse(input: {
  query: string; intent: AuraResponseIntent; language: AuraLanguage; entities: AuraEntities; memory: AuraMemory; vendors?: AuraVendorItem[]; guestCount?: number;
}): AuraEngineResult {
  const { query, intent, language, entities } = input;
  const memory: AuraMemory = { ...input.memory };
  const ml = language === "ml";
  const greeting = ml ? MALAYALAM.greeting : "Hi! How can I help you today?";
  let reply = "";
  let topic = "general";
  const extras: Pick<AuraEngineResult, "groundedVendors" | "budgetPlan" | "checklist"> = {};

  if (entities.name) {
    memory.preferredName = entities.name;
    reply = ml ? MALAYALAM.nameSaved(entities.name) : `Nice to meet you, ${entities.name}. I’ll remember your name in this conversation.`;
  } else if (intent === "ask_name") {
    reply = memory.preferredName ? (ml ? `നിങ്ങളുടെ പേര് ${memory.preferredName} എന്നാണ് പറഞ്ഞത്.` : `You told me your name is ${memory.preferredName}.`) : (ml ? MALAYALAM.nameUnknown : "You haven’t shared your name in this conversation yet. Tell me your name and I can remember it here.");
  } else if (intent === "greeting") {
    reply = greeting;
  } else if (intent === "vendors" || intent === "budget_filter" || intent === "compare") {
    topic = intent === "compare" ? "comparison" : "vendors";
    const category = entities.category || memory.lastCategory || "";
    const city = entities.city || memory.lastCity || "";
    const budget = entities.budget ?? memory.lastBudget;
    const budgetStrict = entities.budget !== undefined ? Boolean(entities.budgetStrict) : Boolean(memory.lastBudgetStrict);
    if (!category && intent !== "compare") {
      memory.pendingIntent = "vendor_search";
      memory.pendingField = "category";
      reply = ml ? "ഏത് തരത്തിലുള്ള vendor ആണ് വേണ്ടത്—photographer, makeup artist, venue, അല്ലെങ്കിൽ മറ്റൊന്നോ?" : "Which vendor category should I look for, such as photographers, makeup artists, venues or catering?";
    } else if (!city && !input.vendors) {
      const alreadyAskedForLocation = memory.pendingIntent === "vendor_search" && memory.pendingField === "location";
      memory.lastCategory = category;
      memory.lastBudget = budget;
      memory.lastBudgetStrict = budgetStrict;
      memory.pendingIntent = "vendor_search";
      memory.pendingField = "location";
      const unsure = /\b(?:i\s+(?:do\s+not|don.t)\s+know|not\s+sure|no\s+idea)\b/i.test(query);
      reply = unsure
        ? (ml ? "ശരി. സമീപത്തെ നഗരം അല്ലെങ്കിൽ പ്രദേശം അറിയുമ്പോൾ പറയൂ; അതനുസരിച്ച് Cloche listings പരിശോധിക്കാം." : "No problem. Tell me a nearby city or area when you have one in mind, and I’ll check Cloche’s listings.")
        : alreadyAskedForLocation
          ? (ml ? "നഗരമോ പ്രദേശമോ വ്യക്തമാക്കാമോ? ഉദാഹരണത്തിന് Kochi, Kozhikode, അല്ലെങ്കിൽ Perinthalmanna." : "I didn’t catch the area. Please name a city or town, such as Kochi, Kozhikode, or Perinthalmanna.")
        : (ml ? MALAYALAM.askCity : `Which city or area should I search for${category ? ` ${category}` : " vendors"}? I’ll use Cloche’s registered listings.`);
    } else if (intent === "compare" && entities.vendorNames.length < 2) {
      reply = "Which two vendor names should I compare? Mention both names from Cloche.";
    } else {
      const results = input.vendors || [];
      const filtered = budget ? results.filter((v) => {
        const amount = Number(String(v.startingPrice || "").replace(/[^\d.]/g, ""));
        return amount > 0 && (budgetStrict ? amount < budget : amount <= budget);
      }) : results;
      memory.lastCategory = category;
      memory.lastCity = city;
      memory.lastBudget = budget;
      memory.lastBudgetStrict = budgetStrict;
      memory.recentVendors = filtered;
      delete memory.pendingIntent;
      delete memory.pendingField;
      extras.groundedVendors = filtered;
      const unpriced = results.filter((vendor) => vendor.startingPrice === "Contact for pricing");
      if (filtered.length === 0 && budget && unpriced.length > 0) {
        reply = `I couldn’t find any verified ${category} in ${city} under ₹${budget.toLocaleString("en-IN")}. Contact vendors directly for custom packages.`;
      } else if (filtered.length === 0) {
        reply = ml ? MALAYALAM.noVendors : `I couldn't find verified Cloche ${category || "vendor"} listings${city ? ` in ${city}` : ""}${budget ? ` at the requested ${budgetStrict ? "under" : "at or below"} INR ${budget.toLocaleString("en-IN")} budget` : ""}. Try another city or category.`;
      } else if (intent === "compare" && filtered.length < 2) {
        reply = "Which two vendor names should I compare? Mention both names from Cloche.";
      } else if (intent === "compare") {
        reply = `Here are the verified vendors you named:`;
      } else if (budget && filtered.every((v) => v.startingPrice === "Contact for pricing")) {
        reply = `Here are verified ${category} in ${city} (pricing on request):`;
      } else {
        reply = `Here are verified ${category}${city ? ` in ${city}` : ""}${budget ? ` under ₹${budget.toLocaleString("en-IN")}` : ""}:`;
      }
    }
  } else if (intent === "budget_plan") {
    topic = "budget";
    const total = entities.budget;
    if (!total) {
      memory.pendingIntent = "wedding_budget_planning";
      memory.pendingField = "budget";
      reply = ml ? "ആകെ wedding budget എത്രയാണ്? തുക പറഞ്ഞാൽ വ്യക്തമായ sample allocation കണക്കാക്കാം." : "What total wedding budget should I use? Share an amount and I’ll calculate a sample allocation.";
    }
    else {
      const items = budgetBreakdown(total);
      const guestCount = entities.guestCount || input.guestCount || 0;
      const perGuest = guestCount ? Math.round(total / guestCount) : undefined;
      extras.budgetPlan = { totalBudget: total, guestCount, city: entities.city || "", functionType: entities.functionType, items };
      memory.lastBudget = total;
      memory.lastCity = entities.city;
      memory.guestCount = guestCount || undefined;
      memory.functionType = entities.functionType;
      const missing = [
        !guestCount ? "guest count" : "",
        !entities.city ? "wedding location" : "",
        !entities.functionType ? "function type (for example, ceremony or reception)" : "",
      ].filter(Boolean);
      const missingDetails = missing.length > 1 ? `${missing.slice(0, -1).join(", ")}, and ${missing[missing.length - 1]}` : missing[0];
      const nextField = !guestCount ? "guestCount" : !entities.city ? "location" : !entities.functionType ? "functionType" : undefined;
      if (nextField) {
        memory.pendingIntent = "wedding_budget_planning";
        memory.pendingField = nextField;
      } else {
        delete memory.pendingIntent;
        delete memory.pendingField;
      }
      reply = `For a total of ₹${total.toLocaleString("en-IN")}, here is an illustrative sample allocation—not actual vendor quotations or market prices:\n\n${items.map((item) => `- **${item.category} (${item.percentage}%)**: ₹${item.amount.toLocaleString("en-IN")} — ${item.note}`).join("\n")}${perGuest ? `\n\nThat is about ₹${perGuest.toLocaleString("en-IN")} per guest for ${guestCount} guests.` : ""}${missing.length ? `\n\nTo tailor this estimate, what is your ${missingDetails}?` : "\n\nAdjust these shares to your priorities and confirm actual costs with venues and vendors."}`;
    }
  } else if (intent === "checklist") {
    topic = "checklist";
    extras.checklist = makeChecklist();
    reply = `Here’s your starter checklist:\n\n${extras.checklist.map((item) => `- [ ] ${item.title}`).join("\n")}`;
  } else {
    const entry = retrieveKnowledge(query);
    if (entry) {
      topic = "knowledge";
      reply = entry.answer;
    } else if (intent === "clarify") {
      reply = ml ? "കൂടുതൽ സഹായിക്കാം. Vendor തിരയണോ, wedding budget ആസൂത്രണം ചെയ്യണോ, checklist വേണോ?" : "I can help with Cloche vendor search, wedding budgeting or a planning checklist. Which would you like?";
    } else {
      reply = ml ? MALAYALAM.unsupported : "I can help you search verified wedding vendors, calculate wedding budgets, or prepare a planning checklist. What would you like help with?";
      topic = "unsupported";
    }
  }

  return { reply, topic, ...extras, memory };
}
