import type { AuraIntent } from "./intents";
import type { AuraLanguage } from "./normalize";
import type { AuraEntities } from "./entities";
import type { AuraVendorItem } from "../auraEngine";
import { retrieveKnowledge } from "./knowledge";

export interface AuraMemory extends Partial<AuraEntities> {
  preferredName?: string;
  lastIntent?: AuraIntent;
  lastCategory?: string;
  lastCity?: string;
  lastBudget?: number;
  recentVendors?: AuraVendorItem[];
}

export interface AuraEngineResult { reply: string; topic: string; groundedVendors?: AuraVendorItem[]; budgetPlan?: { totalBudget: number; guestCount: number; city: string; items: Array<{ category: string; percentage: number; amount: number; note: string }> }; checklist?: Array<{ id: string; title: string; category: string; completed: boolean }>; memory: AuraMemory; }

const MALAYALAM = {
  greeting: "നമസ്കാരം! Cloche വെഡ്ഡിംഗ് പ്ലാനിംഗിലും യഥാർത്ഥ vendor-കളെ കണ്ടെത്തുന്നതിലും സഹായിക്കാം. എന്താണ് വേണ്ടത്?",
  nameSaved: (name: string) => `സന്തോഷം, ${name}! ഈ സംഭാഷണത്തിൽ നിങ്ങളുടെ പേര് ഓർക്കാം.`,
  nameUnknown: "ഈ സംഭാഷണത്തിൽ നിങ്ങൾ പേര് പറഞ്ഞിട്ടില്ല. പറഞ്ഞാൽ ഈ ചാറ്റിൽ ഓർത്തുവെക്കാം.",
  askCity: "ഏത് നഗരത്തിലോ പ്രദേശത്തിലോ വേണം? സ്ഥലം പറഞ്ഞാൽ Cloche-യിലെ രജിസ്റ്റർ ചെയ്ത vendor-കൾ തിരയാം.",
  noVendors: "നൽകിയ മാനദണ്ഡങ്ങൾക്ക് അനുയോജ്യമായ verified Cloche vendor-കളെ കണ്ടെത്താനായില്ല. മറ്റൊരു category, സ്ഥലം, അല്ലെങ്കിൽ budget പരീക്ഷിക്കാമോ?",
  unsupported: "ഞാൻ wedding planning, budgeting, curated സഹായം, Cloche vendor directory എന്നിവയ്ക്കായി നിർമിച്ച deterministic assistant ആണ്. ഈ വിഷയത്തിൽ പരിശോധിച്ച അറിവ് ഇപ്പോൾ ഇല്ല; ഊഹിച്ച് മറുപടി നൽകില്ല.",
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
    ["Venue", 22, "Sample planning share; get a venue quotation."],
    ["Catering", 30, "Sample planning share; depends on guest count and menu."],
    ["Decor", 12, "Sample planning share; confirm inclusions."],
    ["Photography", 10, "Sample planning share; confirm coverage."],
    ["Attire and jewellery", 12, "Sample planning share; adjust to priorities."],
    ["Other costs and contingency", 14, "Sample reserve for invitations, transport and unexpected costs."],
  ];
  return allocations.map(([category, percentage, note]) => ({ category, percentage, amount: Math.round(total * Number(percentage) / 100), note }));
}

export function generateResponse(input: {
  query: string; intent: AuraIntent; language: AuraLanguage; entities: AuraEntities; memory: AuraMemory; vendors?: AuraVendorItem[]; guestCount?: number;
}): AuraEngineResult {
  const { query, intent, language, entities } = input;
  const memory: AuraMemory = { ...input.memory };
  const ml = language === "ml";
  const greeting = ml ? MALAYALAM.greeting : "Hi! I can help with wedding planning and find real vendors listed on Cloche. What would you like help with?";
  let reply = "";
  let topic = "general";
  let extras: Pick<AuraEngineResult, "groundedVendors" | "budgetPlan" | "checklist"> = {};

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
    if (!category && intent !== "compare") {
      reply = ml ? "ഏത് തരത്തിലുള്ള vendor ആണ് വേണ്ടത്—photographer, makeup artist, venue, അല്ലെങ്കിൽ മറ്റൊന്നോ?" : "Which vendor category should I look for, such as photographers, makeup artists, venues or catering?";
    } else if (!city && !input.vendors) {
      memory.lastCategory = category;
      reply = ml ? MALAYALAM.askCity : `Which city or area should I search for${category ? ` ${category}` : " vendors"}? I’ll use Cloche’s registered listings.`;
    } else if (intent === "compare" && entities.vendorNames.length < 2) {
      reply = "Which two vendor names should I compare? Mention both names from Cloche, and I can compare the stored category, city, starting price and profile rating where listed.";
    } else {
      const results = input.vendors || [];
      const filtered = budget ? results.filter((v) => {
        const amount = Number(String(v.startingPrice || "").replace(/[^\d.]/g, ""));
        return amount > 0 && amount <= budget;
      }) : results;
      memory.lastCategory = category;
      memory.lastCity = city;
      memory.lastBudget = budget;
      memory.recentVendors = filtered;
      extras.groundedVendors = filtered;
      if (filtered.length === 0) reply = ml ? MALAYALAM.noVendors : "I couldn’t find verified Cloche vendors matching those filters. Try another category, city or budget. I won’t make up listings or prices.";
      else if (intent === "compare" && filtered.length < 2) reply = "I found fewer than two matching vendors to compare. Please name two vendors or broaden the category or location.";
      else if (intent === "compare") reply = `Here are the ${filtered.length} verified vendor records you named. Compare the listed category, city, starting price and any recorded rating on their Cloche profiles. I can only compare attributes stored in those profiles; availability and unlisted inclusions need confirmation with each vendor.`;
      else if (budget && filtered.every((v) => v.startingPrice === "Contact for pricing")) reply = `I found ${filtered.length} verified ${category} listing(s) in ${city}, but their starting prices are not listed, so I can’t confirm which are under ₹${budget.toLocaleString("en-IN")}. Contact them to check.`;
      else reply = `I found ${filtered.length} verified ${category} listing(s)${city ? ` in ${city}` : ""}${budget ? ` with listed starting prices at or below ₹${budget.toLocaleString("en-IN")}` : ". Listings are ordered by their recorded starting price where available"}. The cards show only details stored in Cloche; confirm current prices and availability with each vendor.`;
    }
  } else if (intent === "budget_plan") {
    topic = "budget";
    const total = entities.budget || memory.lastBudget;
    if (!total) reply = ml ? "ആകെ wedding budget എത്രയാണ്? തുക പറഞ്ഞാൽ വ്യക്തമായ sample allocation കണക്കാക്കാം." : "What total wedding budget should I use? Share an amount and I’ll calculate a sample allocation.";
    else {
      const items = budgetBreakdown(total);
      const guestCount = input.guestCount || 0;
      const perGuest = guestCount ? Math.round(total / guestCount) : undefined;
      extras.budgetPlan = { totalBudget: total, guestCount, city: entities.city || memory.lastCity || "", items };
      memory.lastBudget = total;
      reply = `For a total of ₹${total.toLocaleString("en-IN")}, here is a sample allocation—not vendor quotations or market prices:\n\n${items.map((item) => `- **${item.category} (${item.percentage}%)**: ₹${item.amount.toLocaleString("en-IN")} — ${item.note}`).join("\n")}${perGuest ? `\n\nThat is about ₹${perGuest.toLocaleString("en-IN")} per guest for ${guestCount} guests.` : ""}\n\nAdjust these shares to your priorities and get written quotations. This is arithmetic guidance, not live pricing.`;
    }
  } else if (intent === "checklist") {
    topic = "checklist";
    extras.checklist = makeChecklist();
    reply = `Here’s a starter checklist:\n\n${extras.checklist.map((item) => `- [ ] ${item.title}`).join("\n")}\n\nTell me your wedding date to tailor the order. This is a general planning aid.`;
  } else {
    const entry = retrieveKnowledge(query);
    if (entry) {
      topic = "knowledge";
      reply = entry.answer;
    } else if (intent === "clarify") {
      reply = ml ? "കൂടുതൽ സഹായിക്കാം. Vendor തിരയണോ, wedding budget ആസൂത്രണം ചെയ്യണോ, checklist വേണോ?" : "I can help with Cloche vendor search, wedding budgeting or a planning checklist. Which would you like?";
    } else {
      reply = ml ? MALAYALAM.unsupported : "I’m Cloche’s deterministic wedding assistant. I can search verified Cloche vendors, calculate a sample wedding budget, provide a starter checklist, and answer a small set of maintained wedding-planning questions. I don’t have a maintained answer for that request, so I won’t guess. You can ask about vendor selection, wedding budgets or planning checklists.";
      topic = "unsupported";
    }
  }

  memory.lastIntent = intent;
  return { reply, topic, ...extras, memory };
}

