import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { mapPublicVendor } from "@/lib/vendorMapper";

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

  // Inject Cloudinary auto-formatting and resizing parameters (w_600, f_auto, q_auto)
  if (fullUrl.includes("res.cloudinary.com") && fullUrl.includes("/image/upload/") && !fullUrl.includes("w_")) {
    fullUrl = fullUrl.replace("/image/upload/", "/image/upload/w_600,c_limit,f_auto,q_auto/");
  }

  return fullUrl;
}

export async function GET() {
  try {
    // 1. Fetch ONLY logo media from Supabase media table (Do NOT query boutique_showcase or cover media)
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
            targets.forEach((targetId) => {
              const idStr = String(targetId);
              if (!logoMediaMap.has(idStr)) {
                logoMediaMap.set(idStr, normalizeImageUrl(url));
              }
            });
          }
        });
      }
    } catch (e) {}

    const resultList: any[] = [];
    const seenIds = new Set<string>();

    // 2. Query Supabase 'boutiques' table directly using select=* to prevent PostgREST column missing errors
    const { data: boutiques, error: bErr } = await supabaseFetch("boutiques?status=eq.active&select=*&order=created_at.desc");

    if (!bErr && Array.isArray(boutiques) && boutiques.length > 0) {
      boutiques.forEach((b: any) => {
        if (b.status && b.status !== "active") return;
        const rawLogoPic = b.logo_url || b.logo || b.profile_logo || logoMediaMap.get(String(b.id)) || "";
        const logoPic = normalizeImageUrl(rawLogoPic);
        const bId = String(b.id);
        seenIds.add(bId);
        const mapped = mapPublicVendor({
          ...b,
          id: b.id,
          name: b.boutique_name || b.name,
          logo: logoPic,
          category: b.category || b.category_id || b.tags,
          district: b.district || b.area,
        });
        resultList.push({
          ...mapped,
          logo_url: logoPic,
          profile_logo: logoPic,
          image_url: logoPic,
          tags: b.tags || mapped.category,
          plan: b.plan || "Premium Partner",
          is_verified: Boolean(b.is_verified),
        });
      });
    }

    // 3. Query Supabase 'vendors' & 'vendor_profiles' for registered vendor accounts using select=*
    const { data: vendors, error: vErr } = await supabaseFetch(
      "vendors?deleted_at=is.null&or=(status.eq.active,publication_status.eq.published)&select=*,vendor_categories(id,name,slug),vendor_profiles(*),vendor_addresses(*),vendor_gallery(media(cdn_url))"
    );

    if (!vErr && Array.isArray(vendors) && vendors.length > 0) {
      vendors.forEach((v: any) => {
        if (v.status && v.status !== "active" && v.publication_status !== "published") return;
        if (v.deleted_at) return;
        const vId = String(v.id);
        if (seenIds.has(vId)) return;

        const p = Array.isArray(v.vendor_profiles) && v.vendor_profiles.length > 0 ? v.vendor_profiles[0] : (v.vendor_profiles && typeof v.vendor_profiles === "object" ? v.vendor_profiles : {});
        const a = Array.isArray(v.vendor_addresses) && v.vendor_addresses.length > 0 ? v.vendor_addresses[0] : (v.vendor_addresses && typeof v.vendor_addresses === "object" ? v.vendor_addresses : {});
        const bName = p.business_name || v.boutique_name || v.name;
        if (!bName) return;

        const firstGalleryUrl = Array.isArray(v.vendor_gallery) && v.vendor_gallery.length > 0
          ? (v.vendor_gallery[0]?.media?.cdn_url || "")
          : "";
        const rawLogoPic = p.logo_url || v.logo_url || v.logo || p.cover_image || firstGalleryUrl ||
          logoMediaMap.get(vId) || (v.user_id ? logoMediaMap.get(String(v.user_id)) : "") || "";
        const logoPic = normalizeImageUrl(rawLogoPic);
        const mapped = mapPublicVendor({
          ...v,
          vendor_profiles: p,
          vendor_addresses: a,
          name: bName,
          logo: logoPic,
          city: a.city || p.city || v.city,
          district: a.district || p.district || v.district,
          state: a.state || p.state || v.state,
          rating: p.rating,
          startingPrice: p.starting_price,
        });
        resultList.push({
          ...mapped,
          logo_url: logoPic,
          profile_logo: logoPic,
          image_url: logoPic,
          tags: mapped.category,
          plan: v.plan || "Verified Vendor",
          is_verified: Boolean(v.is_verified || v.is_kyc_verified),
        });
      });
    }

    return NextResponse.json(resultList, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err: any) {
    console.error("[/api/boutiques] Error fetching database vendors:", err);
    return NextResponse.json([], { status: 500 });
  }
}
