import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

function normalizeImageUrl(value: any): string {
  if (!value) return "";
  const raw = String(value).trim();
  if (!raw) return "";

  if (/^https?:\/\//i.test(raw) || /^data:image\//i.test(raw)) return raw;
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dycwsnzyd";
  const cleanPath = raw.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${cleanPath}`;
}

export async function GET() {
  try {
    const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
    const API_BASE_URL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

    // 1. First attempt fetching from backend API
    try {
      const backendRes = await fetch(`${API_BASE_URL}/boutiques?cache_bust=${Date.now()}`, {
        cache: "no-store",
      });
      if (backendRes.ok) {
        const data = await backendRes.json();
        if (Array.isArray(data) && data.length > 0) {
          const normalizedBackend = data.map((b: any) => {
            const logoRaw = b.logo_url || b.logo || b.profile_logo || "";
            const coverRaw = b.cover_url || b.coverImage || b.image_url || "";
            const normLogo = normalizeImageUrl(logoRaw);
            const normCover = normalizeImageUrl(coverRaw);
            return {
              ...b,
              logo_url: normLogo,
              logo: normLogo,
              profile_logo: normLogo,
              cover_url: normCover,
              image_url: normCover || normLogo,
            };
          });
          return NextResponse.json(normalizedBackend);
        }
      }
    } catch (e) {
      console.warn("[/api/boutiques] Backend API fetch failed, querying Supabase directly:", (e as any)?.message);
    }

    // 2. Fetch showcase data for cover/showcase images
    const showcaseMap = new Map<string, string>();
    try {
      const { data: showcases } = await supabaseFetch("boutique_showcase?select=*");
      if (Array.isArray(showcases)) {
        showcases.forEach((s: any) => {
          if (s.boutique_id && s.image_url && !showcaseMap.has(s.boutique_id)) {
            showcaseMap.set(s.boutique_id, normalizeImageUrl(s.image_url));
          }
        });
      }
    } catch (e) {}

    // 3. Fetch media table data for uploaded logos vs covers
    const logoMediaMap = new Map<string, string>();
    const coverMediaMap = new Map<string, string>();
    try {
      const { data: mediaRows } = await supabaseFetch("media?select=*&order=created_at.desc");
      if (Array.isArray(mediaRows)) {
        mediaRows.forEach((m: any) => {
          const url = m.cdn_url || m.file_path;
          if (url && m.vendor_id) {
            const isLogo =
              m.original_name?.toLowerCase().includes("logo") ||
              m.file_path?.toLowerCase().includes("logo") ||
              m.media_type === "logo";
            const isCover =
              m.original_name?.toLowerCase().includes("cover") ||
              m.file_path?.toLowerCase().includes("cover") ||
              m.media_type === "cover";

            if (isLogo && !logoMediaMap.has(m.vendor_id)) {
              logoMediaMap.set(m.vendor_id, normalizeImageUrl(url));
            } else if (isCover && !coverMediaMap.has(m.vendor_id)) {
              coverMediaMap.set(m.vendor_id, normalizeImageUrl(url));
            } else if (!logoMediaMap.has(m.vendor_id)) {
              logoMediaMap.set(m.vendor_id, normalizeImageUrl(url));
            }
          }
        });
      }
    } catch (e) {}

    const resultList: any[] = [];
    const seenIds = new Set<string>();

    // 4. Query Supabase 'boutiques' table directly
    const { data: boutiques, error: bErr } = await supabaseFetch("boutiques?select=*&order=created_at.desc");

    if (!bErr && Array.isArray(boutiques) && boutiques.length > 0) {
      boutiques.forEach((b: any) => {
        const rawLogoPic =
          b.logo_url ||
          b.logo ||
          b.profile_logo ||
          logoMediaMap.get(b.id) ||
          "";

        const rawCoverPic =
          b.cover_url ||
          b.coverImage ||
          showcaseMap.get(b.id) ||
          coverMediaMap.get(b.id) ||
          b.image_url ||
          "";

        const logoPic = normalizeImageUrl(rawLogoPic);
        const coverPic = normalizeImageUrl(rawCoverPic);

        const bId = String(b.id);
        seenIds.add(bId);

        resultList.push({
          id: b.id,
          boutique_name: b.boutique_name || b.name || "Wedding Vendor",
          name: b.boutique_name || b.name || "Wedding Vendor",
          logo_url: logoPic,
          logo: logoPic,
          profile_logo: logoPic,
          cover_url: coverPic,
          image_url: coverPic || logoPic,
          city: b.city || "Kochi",
          area: b.area || b.district || "Kerala",
          category: b.category || b.tags || "Bridal Wear",
          tags: b.tags || b.category || "Bridal Wear",
          rating: b.rating ? Number(b.rating) : 4.8,
          starting_price: b.starting_price || b.startingPrice || "₹50,000",
          plan: b.plan || "Premium Partner",
          is_verified: Boolean(b.is_verified),
        });
      });
    }

    // 5. Query Supabase 'vendors' & 'vendor_profiles' tables directly for registered vendor accounts
    const { data: vendors, error: vErr } = await supabaseFetch(
      "vendors?select=*,vendor_profiles(*),vendor_addresses(*),vendor_categories(*)"
    );

    if (!vErr && Array.isArray(vendors) && vendors.length > 0) {
      vendors.forEach((v: any) => {
        const vId = String(v.id);
        if (seenIds.has(vId)) return;

        const p = Array.isArray(v.vendor_profiles) && v.vendor_profiles.length > 0 ? v.vendor_profiles[0] : {};
        const a = Array.isArray(v.vendor_addresses) && v.vendor_addresses.length > 0 ? v.vendor_addresses[0] : {};
        const cat = v.vendor_categories?.name || v.category || "Bridal Wear";
        const bName = p.business_name || v.boutique_name || v.name;

        if (bName) {
          const rawLogoPic = p.logo_url || v.logo_url || v.logo || logoMediaMap.get(v.id) || "";
          const rawCoverPic = p.cover_image || v.cover_url || coverMediaMap.get(v.id) || "";

          const logoPic = normalizeImageUrl(rawLogoPic);
          const coverPic = normalizeImageUrl(rawCoverPic);

          resultList.push({
            id: v.id,
            boutique_name: bName,
            name: bName,
            logo_url: logoPic,
            logo: logoPic,
            profile_logo: logoPic,
            cover_url: coverPic,
            image_url: coverPic || logoPic,
            city: a.city || p.city || v.city || "Kochi",
            area: a.state || p.state || v.district || "Kerala",
            category: cat,
            tags: cat,
            rating: 4.9,
            starting_price: p.starting_price || "₹50,000",
            plan: v.plan || "Verified Vendor",
            is_verified: Boolean(v.is_verified || v.is_kyc_verified),
          });
        }
      });
    }

    return NextResponse.json(resultList);
  } catch (err: any) {
    console.error("[/api/boutiques] Error fetching database vendors:", err);
    return NextResponse.json([], { status: 500 });
  }
}
