import { Boutique } from "@/types";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";

export function getAllSystemVendors(): Boutique[] {
  const list: Boutique[] = [];
  const seenNames = new Set<string>();

  Object.values(VENDOR_CATEGORIES_DATA).forEach((categoryConfig) => {
    categoryConfig.vendors.forEach((v) => {
      const normName = v.name.toLowerCase().trim();
      if (!seenNames.has(normName)) {
        seenNames.add(normName);
        const locParts = v.location.split(",");
        const city = locParts[0]?.trim() || "Kochi";
        const area = locParts[1]?.trim() || "Kerala";

        list.push({
          id: v.slug || v.id,
          boutique_name: v.name,
          image_url: v.image,
          rating: v.rating,
          city: city,
          area: area,
          district: area,
          state: "Kerala",
          tags: categoryConfig.title,
          starting_price: v.startingPrice,
          verified: v.verified,
          logo_url: v.image,
          profile_logo: v.image,
          coverImage: v.image,
          description: v.specialtyTag || `${categoryConfig.title} partner in ${city}`,
        } as any);
      }
    });
  });

  return list;
}
