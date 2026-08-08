import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

function normalizeImageUrl(value: any): string {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  let fullUrl = raw;
  if (!/^https?:\/\//i.test(raw) && !/^data:image\//i.test(raw)) {
    if (raw.startsWith("/") && !raw.startsWith("//")) {
      fullUrl = raw;
    } else {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dycwsnzyd";
      const cleanPath = raw.replace(/^\/+/, "");
      fullUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${cleanPath}`;
    }
  }

  return fullUrl;
}

function resolveDetailHref(id: string | number, category: string): string {
  const cat = (category || "").toLowerCase();
  const idStr = String(id);
  if (cat.includes("venue")) return `/venues/${idStr}`;
  if (cat.includes("photo")) return `/photographers/${idStr}`;
  if (cat.includes("makeup")) return `/makeup-artists/${idStr}`;
  if (cat.includes("decor") || cat.includes("planner")) return `/decor-planning/${idStr}`;
  if (cat.includes("cater")) return `/catering/${idStr}`;
  if (cat.includes("jewel")) return `/jewellery/${idStr}`;
  if (cat.includes("invitat")) return `/invitations/${idStr}`;
  if (cat.includes("mehendi")) return `/mehendi-artists/${idStr}`;
  if (cat.includes("bridal")) return `/bridal-wear/${idStr}`;
  if (cat.includes("groom")) return `/groom-wear/${idStr}`;
  return `/boutiques/${idStr}`;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") || "").trim().toLowerCase();

    if (!query) {
      return NextResponse.json({ success: true, results: [], groups: {}, totalMatches: 0 });
    }

    const itemsMap = new Map<string, any>();

    // 1. Query Supabase 'boutiques' table
    try {
      const { data: boutiques } = await supabaseFetch("boutiques?select=*&order=created_at.desc");
      if (Array.isArray(boutiques)) {
        boutiques.forEach((b: any) => {
          const bName = (b.boutique_name || b.name || b.business_name || b.title || "").trim();
          if (!bName) return;

          const category = b.category || b.tags || "Bridal Wear";
          const city = b.city || b.area || b.district || b.location || "Kochi";
          const rawLogo = b.logo_url || b.logo || b.profile_logo || b.cover_image || "";
          const logo = normalizeImageUrl(rawLogo);
          const href = resolveDetailHref(b.id, category);

          itemsMap.set(`boutique-${b.id}`, {
            id: b.id,
            name: bName,
            category: category,
            city: city,
            logo: logo,
            href: href,
          });
        });
      }
    } catch (e) {
      console.error("[AUTOCOMPLETE_API] Boutiques fetch error:", e);
    }

    // 2. Query Supabase 'vendors' & 'vendor_profiles' tables
    try {
      const { data: vendors } = await supabaseFetch("vendors?select=*,vendor_categories(id,name,slug),vendor_profiles(*)");
      if (Array.isArray(vendors)) {
        vendors.forEach((v: any) => {
          const p = Array.isArray(v.vendor_profiles) && v.vendor_profiles.length > 0 ? v.vendor_profiles[0] : {};
          const catObj = v.vendor_categories || {};
          const bName = (p.business_name || v.boutique_name || v.name || p.name || "").trim();
          if (!bName) return;

          const vKey = `vendor-${v.id}`;
          if (itemsMap.has(vKey)) return;

          const category = catObj.name || p.category || v.category || "Wedding Vendor";
          const city = p.city || v.city || "Kochi";
          const rawLogo = p.logo_url || v.logo_url || v.logo || p.cover_image || "";
          const logo = normalizeImageUrl(rawLogo);
          const href = resolveDetailHref(p.slug || v.vendor_code || v.id, category);

          itemsMap.set(vKey, {
            id: v.id,
            name: bName,
            category: category,
            city: city,
            logo: logo,
            href: href,
          });
        });
      }
    } catch (e) {
      console.error("[AUTOCOMPLETE_API] Vendors fetch error:", e);
    }

    const allItems = Array.from(itemsMap.values());

    // 3. Partial / Contains Substring Matching & Ranking
    const scoredResults = allItems.map((item) => {
      const nameLower = item.name.toLowerCase();
      const catLower = item.category.toLowerCase();
      const cityLower = item.city.toLowerCase();

      let score = 0;

      // Exact name match
      if (nameLower === query) score += 100;
      // Prefix name match
      else if (nameLower.startsWith(query)) score += 80;
      // Partial / Contains name match
      else if (nameLower.includes(query)) score += 60;

      // Partial / Contains category match
      if (catLower.includes(query)) score += 40;

      // Partial / Contains city match
      if (cityLower.includes(query)) score += 30;

      return { item, score };
    });

    const matchingItems = scoredResults.filter((res) => res.score > 0);
    const filteredAndSorted = matchingItems
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((res) => res.item);

    // 4. Group Results
    const groups: { [key: string]: any[] } = {
      Venues: [],
      Boutiques: [],
      "Vendors & Studios": [],
    };

    filteredAndSorted.forEach((item) => {
      const catLower = item.category.toLowerCase();
      if (catLower.includes("venue")) {
        groups.Venues.push(item);
      } else if (
        catLower.includes("boutique") ||
        catLower.includes("bridal") ||
        catLower.includes("groom") ||
        catLower.includes("jewel") ||
        catLower.includes("store") ||
        catLower.includes("wear")
      ) {
        groups.Boutiques.push(item);
      } else {
        groups["Vendors & Studios"].push(item);
      }
    });

    // Remove empty groups completely
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) delete groups[key];
    });

    return NextResponse.json({
      success: true,
      results: filteredAndSorted,
      groups: groups,
      totalMatches: matchingItems.length,
    });
  } catch (err: any) {
    console.error("[AUTOCOMPLETE_API] Critical Error:", err);
    return NextResponse.json({ success: false, error: err.message, results: [], groups: {}, totalMatches: 0 }, { status: 500 });
  }
}
