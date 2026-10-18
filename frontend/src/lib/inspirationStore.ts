export interface SavedInspirationItem {
  id: string;
  title: string;
  category: string;
  image: string;
  savedAt?: number;
}

const STORAGE_KEY = "cloche_saved_inspirations";
const EVENT_NAME = "cloche_saved_inspirations_updated";

export function getSavedInspirations(): SavedInspirationItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isItemSavedInspiration(id: string | number): boolean {
  const items = getSavedInspirations();
  const targetId = String(id);
  return items.some((i) => String(i.id) === targetId);
}

export function toggleSaveInspiration(item: SavedInspirationItem): boolean {
  if (typeof window === "undefined") return false;
  const current = getSavedInspirations();
  const targetId = String(item.id);
  const exists = current.some((i) => String(i.id) === targetId);
  let updated: SavedInspirationItem[];

  if (exists) {
    updated = current.filter((i) => String(i.id) !== targetId);
  } else {
    updated = [{ ...item, id: targetId, savedAt: Date.now() }, ...current];
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    console.error("Failed to save inspiration to localStorage:", e);
  }

  return !exists;
}

export function removeSavedInspiration(id: string | number): SavedInspirationItem[] {
  if (typeof window === "undefined") return [];
  const current = getSavedInspirations();
  const targetId = String(id);
  const updated = current.filter((i) => String(i.id) !== targetId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch (e) {
    console.error("Failed to remove inspiration from localStorage:", e);
  }
  return updated;
}
