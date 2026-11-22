const LOCATION_ALIASES: Record<string, string> = {
  kozhikod: "Kozhikode",
  kozhikode: "Kozhikode",
  calicut: "Kozhikode",
  ernakulam: "Ernakulam",
  kochi: "Kochi",
  perinthalmanna: "Perinthalmanna",
  perithalmanna: "Perinthalmanna",
  oachira: "Oachira",
  ochira: "Oachira",
  thrissur: "Thrissur",
  trichur: "Thrissur",
  trivandrum: "Thiruvananthapuram",
  thiruvananthapuram: "Thiruvananthapuram",
  alappuzha: "Alappuzha",
  alleppey: "Alappuzha",
  kollam: "Kollam",
  quilon: "Kollam",
};

function titleCase(value: string): string {
  return value.trim().toLowerCase().replace(/\b[\p{L}]/gu, (letter) => letter.toUpperCase());
}

function canonicalPlace(value: string): string {
  const trimmed = value.trim();
  return LOCATION_ALIASES[trimmed.toLowerCase()] || titleCase(trimmed);
}

export function formatPrice(value: unknown): string {
  if (value == null || (typeof value === "string" && !value.trim())) return "Contact for pricing";
  const raw = String(value).trim();
  if (/contact\s+for\s+pricing/i.test(raw)) return "Contact for pricing";

  const normalized = raw.replace(/,/g, "");
  const amountMatch = normalized.match(/\d+(?:\.\d+)?/);
  if (!amountMatch) return raw;

  let amount = Number(amountMatch[0]);
  const afterAmount = normalized.slice(amountMatch.index! + amountMatch[0].length);
  if (/^\s*k\b/i.test(afterAmount) || /^\s*k[+\s]/i.test(afterAmount)) amount *= 1000;
  if (!Number.isFinite(amount) || amount <= 0) return "Contact for pricing";

  const suffix = afterAmount.replace(/^\s*k/i, "").trim();
  const formattedAmount = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(amount);
  const suffixText = suffix.startsWith("+") ? suffix : suffix ? ` ${suffix}` : "";
  return `Starts from ₹${formattedAmount}${suffixText}`;
}

export function formatReviews(value: unknown): string {
  const count = Math.max(0, Math.floor(Number(value) || 0));
  if (count === 0) return "No reviews yet";
  return `${count} ${count === 1 ? "review" : "reviews"}`;
}

export function formatLocation(city?: unknown, district?: unknown): string {
  const cityText = typeof city === "string" ? city.trim() : "";
  const districtText = typeof district === "string" ? district.trim() : "";
  let cityName = cityText;
  let districtName = districtText;

  if (!districtName && cityName.includes(",")) {
    const [first, ...rest] = cityName.split(",");
    cityName = first.trim();
    districtName = rest.join(",").trim();
  }

  const canonicalCity = cityName ? canonicalPlace(cityName) : "";
  const canonicalDistrict = districtName ? canonicalPlace(districtName) : "";
  if (canonicalCity && canonicalDistrict && canonicalCity.toLowerCase() !== canonicalDistrict.toLowerCase()) {
    return `${canonicalCity}, ${canonicalDistrict}`;
  }
  return canonicalCity || canonicalDistrict || "Kerala";
}

const CATEGORY_LABELS: Record<string, string> = {
  photographer: "Photographers",
  photographers: "Photographers",
  "wedding photographer": "Photographers",
  "makeup artist": "Makeup Artists",
  "makeup artists": "Makeup Artists",
  makeup: "Makeup Artists",
  venue: "Wedding Venues",
  venues: "Wedding Venues",
  "wedding venue": "Wedding Venues",
  "bridal studio": "Bridal Studio",
  "bridal wear": "Bridal Studio",
  boutique: "Wedding Boutique",
};

export function formatCategory(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "Wedding Vendor";
  const normalized = value.trim().toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ");
  return CATEGORY_LABELS[normalized] || titleCase(normalized);
}
