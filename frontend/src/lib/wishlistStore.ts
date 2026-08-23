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
    if (res.statusCode === 401) {
      localStorage.removeItem(WISHLIST_KEY);
      window.dispatchEvent(new Event("cloche_wishlist_updated"));
      return [];
    }

    if (res.success && Array.isArray(res.data)) {
      const serverItems: WishlistItem[] = res.data.map((item: any) => {
        const vendor = item.vendors || item;
        const profile = Array.isArray(vendor.vendor_profiles)
          ? vendor.vendor_profiles[0]
          : vendor.vendor_profiles && typeof vendor.vendor_profiles === "object"
          ? vendor.vendor_profiles
          : {};
        const categoryObj = Array.isArray(vendor.vendor_categories)
          ? vendor.vendor_categories[0]
          : vendor.vendor_categories && typeof vendor.vendor_categories === "object"
          ? vendor.vendor_categories
          : {};

        const rawName = profile.business_name || vendor.name || vendor.boutique_name || item.name || "Saved Vendor";
        const name = rawName.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const category = categoryObj.name || vendor.category || "Vendor";
        const image = profile.cover_media?.cdn_url || profile.logo_media?.cdn_url || profile.cover_image || vendor.image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=800";
        const rawCity = profile.city || vendor.city || "Kerala";
        const city = rawCity ? (rawCity.charAt(0).toUpperCase() + rawCity.slice(1)) : "Kerala";
        const rating = Number(profile.rating || vendor.rating || 4.9);
        const price = profile.starting_price ? `₹${Number(profile.starting_price).toLocaleString("en-IN")}` : (vendor.price || "Contact for pricing");
        const slug = profile.slug || vendor.slug || vendor.id;

        return {
          id: vendor.id || item.vendor_id || item.id,
          name,
          category,
          price,
          image,
          boutique_name: name,
          location: city,
          city,
          rating,
          href: `/boutiques/${slug}`,
        };
      });

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
  const initialItems = getWishlistItems();
  const exists = initialItems.some((i) => String(i.id) === String(item.id));
  let optimisticItems: WishlistItem[];

  if (exists) {
    optimisticItems = initialItems.filter((i) => String(i.id) !== String(item.id));
  } else {
    optimisticItems = [item, ...initialItems];
  }

  // 1. Apply Optimistic Update locally
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(optimisticItems));
    window.dispatchEvent(new Event("cloche_wishlist_updated"));
  } catch (e) {
    console.error("Error setting local wishlist", e);
  }

  // 2. Perform Server Request & Rollback on failure
  if (exists) {
    fetch(`/api/v1/customer/favorites?vendor_id=${encodeURIComponent(item.id)}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) {
          // Rollback to initialItems
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(initialItems));
          window.dispatchEvent(new Event("cloche_wishlist_updated"));
        }
      })
      .catch(() => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(initialItems));
        window.dispatchEvent(new Event("cloche_wishlist_updated"));
      });
  } else {
    fetch("/api/v1/customer/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vendor_id: item.id }),
    })
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) {
          // Rollback optimistic update
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(initialItems));
          window.dispatchEvent(new Event("cloche_wishlist_updated"));
          if (res.statusCode === 401) {
            alert("Please log in to save vendors to your wishlist.");
          }
        }
      })
      .catch(() => {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(initialItems));
        window.dispatchEvent(new Event("cloche_wishlist_updated"));
      });
  }

  return !exists;
}

export function removeWishlistItem(id: string | number): WishlistItem[] {
  if (typeof window === "undefined") return [];
  const initialItems = getWishlistItems();
  const updatedItems = initialItems.filter((i) => String(i.id) !== String(id));

  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cloche_wishlist_updated"));
  } catch (e) {
    console.error("Error removing wishlist item", e);
  }

  fetch(`/api/v1/customer/favorites?vendor_id=${encodeURIComponent(id)}`, { method: "DELETE" })
    .then((r) => r.json())
    .then((res) => {
      if (!res.success) {
        // Rollback
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(initialItems));
        window.dispatchEvent(new Event("cloche_wishlist_updated"));
      }
    })
    .catch(() => {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(initialItems));
      window.dispatchEvent(new Event("cloche_wishlist_updated"));
    });

  return updatedItems;
}
