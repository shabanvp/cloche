export interface AuraEntities {
  name?: string;
  category?: string;
  city?: string;
  budget?: number;
  budgetStrict?: boolean;
  vendorNames: string[];
  comparison: boolean;
}

const CATEGORIES: Array<[string, string[]]> = [
  ["groom wear", ["groom wear", "groomwear", "sherwani", "groomswear", "groom outfit"]],
  ["photographers", ["photographer", "photographers", "photography", "photo studio"]],
  ["makeup artists", ["makeup artist", "makeup artists", "makeup", "bridal makeup"]],
  ["venues", ["venue", "venues", "wedding hall", "banquet hall"]],
  ["decor", ["decor", "decoration", "decorator", "wedding planner"]],
  ["catering", ["caterer", "catering", "food"]],
  ["bridal wear", ["bridal wear", "bridalwear", "bridal studio", "bridal outfit"]],
  ["mehendi artists", ["mehendi", "mehndi"]],
];

const CITIES: Array<[string, string[]]> = [
  ["Kochi", ["kochi", "kochi-yil", "kochi yil", "kochiyil", "കൊച്ചി"]],
  ["Ernakulam", ["ernakulam", "എറണാകുളം"]],
  ["Thiruvananthapuram", ["thiruvananthapuram", "തിരുവനന്തപുരം"]],
  ["Trivandrum", ["trivandrum"]],
  ["Kozhikode", ["kozhikode", "kozhikod", "കോഴിക്കോട്"]], ["Calicut", ["calicut"]],
  ["Thrissur", ["thrissur", "തൃശ്ശൂർ", "തൃശൂർ"]], ["Kannur", ["kannur", "കണ്ണൂർ"]],
  ["Kottayam", ["kottayam", "കോട്ടയം"]], ["Alappuzha", ["alappuzha", "ആലപ്പുഴ"]],
  ["Palakkad", ["palakkad", "പാലക്കാട്"]], ["Malappuram", ["malappuram", "മലപ്പുറം"]],
  ["Perinthalmanna", ["perinthalmanna", "perinthalman", "പെരിന്തൽമണ്ണ"]],
  ["Nilambur", ["nilambur", "നിലമ്പൂർ"]],
];

function escaped(value: string) { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

export function extractEntities(text: string, knownVendorNames: string[] = [], expectedField?: "location"): AuraEntities {
  const normalized = text.toLocaleLowerCase();
  const category = CATEGORIES.find(([, terms]) => terms.some((term) => new RegExp(`\\b${escaped(term)}\\b`, "i").test(normalized)))?.[0];
  const detectedCity = CITIES.find(([, aliases]) => aliases.some((alias) => {
    if (/[\u0d00-\u0d7f]/.test(alias)) return text.includes(alias);
    return new RegExp(`\\b${escaped(alias)}(?:[- ]?(?:yil|il))?\\b`, "i").test(text);
  }))?.[0];
  const budgetMatch = text.match(/(?:under|below|within|budget(?:\s+of)?|₹|rs\.?\s*)(?:\s*₹\s*)?([\d,]+(?:\.\d+)?)\s*(lakh|lakhs|l|k|thousand)?/i);
  let budget: number | undefined;
  if (budgetMatch) {
    const amount = Number(budgetMatch[1].replace(/,/g, ""));
    const unit = (budgetMatch[2] || "").toLowerCase();
    if (Number.isFinite(amount)) budget = amount * (["lakh", "lakhs", "l"].includes(unit) ? 100_000 : ["k", "thousand"].includes(unit) ? 1000 : 1);
  }
  const intro = text.match(/\b(?:my name is|i am|i'm|call me)\s+([\p{L}][\p{L}'-]{0,39})/iu);
  const name = intro?.[1];
  const vendorNames = knownVendorNames.filter((candidate) => candidate && normalized.includes(candidate.toLocaleLowerCase())).slice(0, 5);
  const comparison = /\b(compare|comparison|versus|vs\.?|difference between)\b/i.test(text);
  const budgetStrict = budget !== undefined && /\b(?:under|below|less than)\b|<(?!\=)/i.test(text);
  const city = expectedField === "location" || category || /\b(?:in|near|around|at)\b/i.test(text) ? detectedCity : undefined;
  return { name, category, city, budget, budgetStrict, vendorNames, comparison };
}

export function mergeEntities(previous: Partial<AuraEntities> & { lastCategory?: string; lastCity?: string; lastBudget?: number; lastBudgetStrict?: boolean }, current: AuraEntities): AuraEntities {
  return {
    name: current.name || previous.name,
    category: current.category || previous.category || previous.lastCategory,
    city: current.city || previous.city || previous.lastCity,
    budget: current.budget ?? previous.budget ?? previous.lastBudget,
    budgetStrict: current.budget !== undefined ? current.budgetStrict : previous.budgetStrict ?? previous.lastBudgetStrict,
    vendorNames: current.vendorNames.length ? current.vendorNames : previous.vendorNames || [],
    comparison: current.comparison || Boolean(previous.comparison),
  };
}
