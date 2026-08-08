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

  if (fullUrl.includes("res.cloudinary.com") && fullUrl.includes("/image/upload/") && !fullUrl.includes("w_")) {
    fullUrl = fullUrl.replace("/image/upload/", "/image/upload/w_200,c_limit,f_auto,q_auto/");
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
      return NextResponse.json({ success: true, results: [], groups: {} });
    }

    // 1. Fetch logo media map
    const logoMediaMap = new Map<string, string>();
    try {
      const { data: mediaRows } = await supabaseFetch("media?select=*&order=created_at.desc");
      if (Array.isArray(mediaRows)) {
        mediaRows.forEach((m: any) => {
          const url = m.cdn_url || m.file_path;
          if (!url) return;
          const pathLower = (
            (m.file_path || "") + " " +
            (m.original_name || "") + " " +
            (m.bucket_name || "") + " " +
            (m.media_type || "")
          ).toLowerCase();

          if (pathLower.includes("logo")) {
            const targets = [m.vendor_id, m.user_id, m.boutique_id].filter(Boolean);
            targets.forEach((t) => {
              const tStr = String(t);
              if (!logoMediaMap.has(tStr)) {
                logoMediaMap.set(tStr, normalizeImageUrl(url));
              }
            });
          }
        });
      }
    } catch (e) {}

    const itemsMap = new Map<string, any>();

    // 2. Query Supabase 'boutiques' table
    const { data: boutiques } = await supabaseFetch("boutiques?select=*&order=created_at.desc");

    if (Array.isArray(boutiques)) {
      boutiques.forEach((b: any) => {
        const bName = (b.boutique_name || b.name || "").trim();
        if (!bName) return;

        const category = b.category || b.tags || "Bridal Wear";
        const city = b.city || b.area || b.district || "Kochi";
        const rawLogo = b.logo_url || b.logo || b.profile_logo || logoMediaMap.get(String(b.id)) || "";
        const logo = normalizeImageUrl(rawLogo);
        const href = resolveDetailHref(b.id, category);

        itemsMap.set(String(b.id), {
          id: b.id,
          name: bName,
          category: category,
          city: city,
          logo: logo,
          href: href,
        });
      });
    }

    // 3. Query Supabase 'vendors' & 'vendor_profiles' tables
    const { data: vendors } = await supabaseFetch("vendors?select=*,vendor_profiles(*),vendor_addresses(*)");

    if (Array.isArray(vendors)) {
      vendors.forEach((v: any) => {
        const p = Array.isArray(v.vendor_profiles) && v.vendor_profiles.length > 0 ? v.vendor_profiles[0] : {};
        const a = Array.isArray(v.vendor_addresses) && v.vendor_addresses.length > 0 ? v.vendor_addresses[0] : {};
        const bName = (p.business_name || v.boutique_name || v.name || "").trim();
        if (!bName) return;

        const vKey = String(v.id);
        if (itemsMap.has(vKey)) return;

        const category = v.category || p.category || "Bridal Wear";
        const city = a.city || p.city || v.city || "Kochi";
        const rawLogo = p.logo_url || v.logo_url || v.logo || logoMediaMap.get(vKey) || (v.user_id ? logoMediaMap.get(String(v.user_id)) : "") || "";
        const logo = normalizeImageUrl(rawLogo);
        const href = resolveDetailHref(p.slug || v.id, category);

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

    const allItems = Array.from(itemsMap.values());

    // 4. Intelligent Ranking Logic
    const scoredResults = allItems.map((item) => {
      const nameLower = item.name.toLowerCase();
      const catLower = item.category.toLowerCase();
      const cityLower = item.city.toLowerCase();

      let score = 0;

      if (nameLower === query) score += 100;
      else if (nameLower.startsWith(query)) score += 80;
      else if (nameLower.includes(query)) score += 60;

      if (catLower.includes(query)) score += 40;
      if (cityLower.includes(query)) score += 30;

      return { item, score };
    });

    const filteredAndSorted = scoredResults
      .filter((res) => res.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((res) => res.item);

    // 5. Group Results into Venues, Boutiques, Vendors & Studios
    const groups: { [key: string]: any[] } = {
      Venues: [],
      Boutiques: [],
      "Vendors & Studios": [],
    };

    filteredAndSorted.forEach((item) => {
      const catLower = item.category.toLowerCase();
      if (catLower.includes("venue")) {
        groups.Venues.push(item);
      } else if (catLower.includes("boutique") || catLower.includes("bridal") || catLower.includes("groom") || catLower.includes("jewel") || catLower.includes("store")) {
        groups.Boutiques.push(item);
      } else {
        groups["Vendors & Studios"].push(item);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
      if (groups[key].length === 0) delete groups[key];
    });

    return NextResponse.json({
      success: true,
      results: filteredAndSorted,
      groups: groups,
      totalMatches: scoredResults.filter((res) => res.score > 0).length,
    });
  } catch (err: any) {
    console.error("[AUTOCOMPLETE_API] Error:", err);
    return NextResponse.json({ success: false, results: [], groups: {}, totalMatches: 0 }, { status: 500 });
  }
}
