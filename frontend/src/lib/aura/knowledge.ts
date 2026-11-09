export interface KnowledgeEntry { id: string; terms: string[]; answer: string; language?: "en" | "ml" | "ml-en"; }

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  { id: "wedding-budget", terms: ["wedding budget", "budget wedding", "budget planning"], answer: "A practical wedding budget starts with your total limit, guest count, venue and catering, then reserves a contingency. Shares vary by location and priorities, so Aura can draft a transparent sample allocation when you share a total budget." },
  { id: "cloche-services", terms: ["cloche services", "what services does cloche offer", "what can aura do"], answer: "Aura can search Cloche's registered wedding-vendor listings, compare vendors you name, draft illustrative wedding-budget allocations, and provide wedding-planning checklists and maintained planning guidance. Listing availability and final prices must be confirmed directly with vendors." },
  { id: "vendor-selection", terms: ["choose vendor", "select vendor", "vendor selection", "book vendor"], answer: "Compare vendors on the same criteria: service scope, itemized price, location, portfolio, verified reviews and written terms. Confirm dates and inclusions directly with the vendor; Aura cannot verify live availability." },
  { id: "wedding-checklist", terms: ["wedding checklist", "planning checklist", "checklist"], answer: "Start with the date and budget, shortlist venue and key vendors, confirm guest count, book services, plan outfits and invitations, then review final timings and payments. Timing depends on your wedding date and local arrangements." },
  { id: "python-limitation", terms: ["what is python", "python programming", "python language"], answer: "I can answer a few maintained wedding-planning topics and search Cloche’s vendor directory, but I don’t have a curated knowledge entry about Python. I won’t guess. You can ask me about wedding budgets, checklists, vendor selection or Cloche vendors." },
  { id: "react-limitation", terms: ["write a react application", "react application", "build a react app", "react app"], answer: "I’m a deterministic Cloche wedding assistant, not a general code-generation tool. I don’t have a maintained knowledge entry to write a React application, so I can’t reliably generate one. I can help with wedding planning, budgeting and Cloche vendor discovery." },
];

export function retrieveKnowledge(query: string): KnowledgeEntry | undefined {
  const normalized = query.toLocaleLowerCase();
  return KNOWLEDGE_BASE
    .map((entry) => ({ entry, score: entry.terms.reduce((score, term) => score + (normalized.includes(term) ? Math.max(1, term.split(/\s+/).length) : 0), 0) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)[0]?.entry;
}
