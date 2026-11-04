export type AuraLanguage = "en" | "ml" | "ml-en";

export function normalizeMessage(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000);
}

const MALAYALAM_SCRIPT = /[\u0d00-\u0d7f]/;
const MALAYALAM_TRANSLITERATION = /\b(ente|enikku|venam|vendi|kaanikku|kanikkamo|evide|ethra|nalla|kalyanam|vivaham|photographer|makeup artist|kochi|kozhikode|malayalam)\b/i;

export function detectLanguage(text: string): AuraLanguage {
  if (MALAYALAM_SCRIPT.test(text)) return "ml";
  if (MALAYALAM_TRANSLITERATION.test(text)) return "ml-en";
  return "en";
}

