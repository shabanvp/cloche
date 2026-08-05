export type WishlistItem = {
  id: string | number;
  name: string;
  category?: string;
  price?: string | number;
  image?: string;
  boutique_name?: string;
  location?: string;
  city?: string;
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

export async function syncWishlistWithServer(): Promise<WishlistItem[]> {
  if (typeof window === "undefined") return [];
  try {
    const res = await fetch("/api/v1/customer/favorites", { cache: "no-store" }).then((r) => r.json());
    if (res.success && Array.isArray(res.data)) {
      const serverItems: WishlistItem[] = res.data.map((item: any) => ({
        id: item.vendor_id || item.vendors?.id || item.id,
        name: item.vendors?.name || item.vendors?.boutique_name || item.name || "Saved Vendor",
        category: item.vendors?.category || item.category || "Vendor",
        price: item.vendors?.price_range || item.price || "Contact for pricing",
        image: item.vendors?.cover_image || item.vendors?.image || item.image || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
        boutique_name: item.vendors?.city || item.vendors?.location || item.city || "Kerala",
        location: item.vendors?.city || item.location || "Kerala",
        city: item.vendors?.city || item.city || "Kerala",
        rating: item.vendors?.rating || item.rating || 4.9,
        href: `/vendors`,
      }));

      localStorage.setItem(WISHLIST_KEY, JSON.stringify(serverItems));
      window.dispatchEvent(new Event("cloche_wishlist_updated"));
      return serverItems;
    }
  } catch (e) {
    console.error("Failed to sync wishlist with server:", e);
  }

  return getWishlistItems();
}

export function toggleWishlistItem(item: WishlistItem): boolean {
  if (typeof window === "undefined") return false;
  const items = getWishlistItems();
  const exists = items.some((i) => String(i.id) === String(item.id));
  let updated: WishlistItem[];

  if (exists) {
    updated = items.filter((i) => String(i.id) !== String(item.id));
    // Background server call
    fetch(`/api/v1/customer/favorites?vendor_id=${encodeURIComponent(item.id)}`, {
      method: "DELETE",
    }).catch(() => null);
  } else {
    updated = [item, ...items];
    // Background server call
    fetch("/api/v1/customer/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendor_id: item.id }),
    }).catch(() => null);
  }

  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cloche_wishlist_updated"));
  } catch (e) {
    console.error("Error updating wishlist store", e);
  }

  return !exists;
}

export function removeWishlistItem(id: string | number): WishlistItem[] {
  if (typeof window === "undefined") return [];
  const items = getWishlistItems();
  const updated = items.filter((i) => String(i.id) !== String(id));

  // Background server removal call
  fetch(`/api/v1/customer/favorites?vendor_id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  }).catch(() => null);

  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("cloche_wishlist_updated"));
  } catch (e) {
    console.error("Error removing wishlist item", e);
  }
  return updated;
}
