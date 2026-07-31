export type WishlistItem = {
  id: string | number;
  name: string;
  category?: string;
  price?: string | number;
  image?: string;
  boutique_name?: string;
  location?: string;
  rating?: number;
  href?: string;
};

const WISHLIST_KEY = "cloche_wishlist";

export function getWishlistItems(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isItemInWishlist(id: string | number): boolean {
  const items = getWishlistItems();
  return items.some((item) => String(item.id) === String(id));
}

export function toggleWishlistItem(item: WishlistItem): boolean {
  if (typeof window === "undefined") return false;
  const items = getWishlistItems();
  const exists = items.some((i) => String(i.id) === String(item.id));
  let updated: WishlistItem[];

  if (exists) {
    updated = items.filter((i) => String(i.id) !== String(item.id));
  } else {
    updated = [item, ...items];
  }

  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cloche_wishlist_updated"));
  } catch (e) {
    console.error("Error updating wishlist", e);
  }

  return !exists;
}

export function removeWishlistItem(id: string | number): WishlistItem[] {
  if (typeof window === "undefined") return [];
  const items = getWishlistItems();
  const updated = items.filter((i) => String(i.id) !== String(id));
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cloche_wishlist_updated"));
  } catch (e) {
    console.error("Error removing wishlist item", e);
  }
  return updated;
}
