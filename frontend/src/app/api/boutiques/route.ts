import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase";

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
          return NextResponse.json(data);
        }
      }
    } catch (e) {
      console.warn("[/api/boutiques] Express backend fetch failed, querying Supabase directly:", (e as any)?.message);
    }

    // 2. Query Supabase 'boutiques' table directly
    const { data: boutiques, error: bErr } = await supabaseFetch("boutiques?select=*&order=created_at.desc");

    const resultList: any[] = [];

    if (!bErr && Array.isArray(boutiques) && boutiques.length > 0) {
      boutiques.forEach((b: any) => {
        const logo = b.logo_url || b.logo || b.profile_logo || b.image_url || b.cover_url || b.coverImage || "";
        resultList.push({
          id: b.id,
          boutique_name: b.boutique_name || b.name || "Wedding Vendor",
          name: b.boutique_name || b.name || "Wedding Vendor",
          logo_url: logo,
          logo: logo,
          profile_logo: logo,
          image_url: b.image_url || logo,
          cover_url: b.cover_url || b.coverImage || logo,
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

    // 3. Query Supabase 'vendors' & 'vendor_profiles' tables directly for registered vendor accounts
    const { data: vendors, error: vErr } = await supabaseFetch(
      "vendors?select=*,vendor_profiles(*),vendor_addresses(*),vendor_categories(*)"
    );

    if (!vErr && Array.isArray(vendors) && vendors.length > 0) {
      vendors.forEach((v: any) => {
        const p = Array.isArray(v.vendor_profiles) && v.vendor_profiles.length > 0 ? v.vendor_profiles[0] : {};
        const a = Array.isArray(v.vendor_addresses) && v.vendor_addresses.length > 0 ? v.vendor_addresses[0] : {};
        const cat = v.vendor_categories?.name || v.category || "Bridal Wear";
        const bName = p.business_name || v.boutique_name || v.name;
        if (bName) {
          const logo = p.logo_url || v.logo_url || v.logo || p.cover_image || "";
          resultList.push({
            id: v.id,
            boutique_name: bName,
            name: bName,
            logo_url: logo,
            logo: logo,
            profile_logo: logo,
            image_url: logo,
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
