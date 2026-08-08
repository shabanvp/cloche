import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase";

export async function GET(req: Request) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || "";
    const city = searchParams.get("city") || "";
    const search = searchParams.get("search") || "";
    const minRating = Number(searchParams.get("rating") || 0);
    const limit = Number(searchParams.get("limit") || 24);
    const offset = Number(searchParams.get("offset") || 0);

    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey || anonKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database credentials unconfigured." } },
        { status: 500 }
      );
    }

    // Build PostgREST query
    let filter = `deleted_at=is.null&status=eq.active`;
    
    // Add category filter if provided
    if (categorySlug && categorySlug.toLowerCase() !== "all") {
      const catRes = await supabaseFetch(`vendor_categories?slug=ilike.${encodeURIComponent(categorySlug)}&select=id`);
      if (catRes.data && Array.isArray(catRes.data) && catRes.data.length > 0) {
        filter += `&category_id=eq.${encodeURIComponent(catRes.data[0].id)}`;
      }
    }

    const endpoint = `vendors?${filter}&select=id,vendor_code,status,publication_status,is_verified,is_kyc_verified,created_at,vendor_categories(id,name,slug),vendor_profiles(*),vendor_contacts(*),vendor_services(id,name,base_price,pricing_type),vendor_gallery(id,media(cdn_url,file_path))&order=created_at.desc&limit=${limit}&offset=${offset}`;

    const res = await supabaseFetch(endpoint);
    console.log(`[DB:FETCH] public_vendors filter=${filter} rows=${Array.isArray(res.data) ? res.data.length : 0} ms=${Date.now() - startTime}`);

    if (res.error || !Array.isArray(res.data)) {
      return NextResponse.json(
        { success: true, statusCode: 200, data: [], count: 0 },
        { status: 200 }
      );
    }

    let items = res.data.map((v: any) => {
      const profile = Array.isArray(v.vendor_profiles) && v.vendor_profiles.length > 0 ? v.vendor_profiles[0] : {};
      const contact = Array.isArray(v.vendor_contacts) && v.vendor_contacts.length > 0 ? v.vendor_contacts[0] : {};
      const gallery = Array.isArray(v.vendor_gallery) ? v.vendor_gallery : [];
      const services = Array.isArray(v.vendor_services) ? v.vendor_services : [];

      const logoImg = profile.logo_media?.cdn_url || profile.logo_url || "";
      const coverImg = profile.cover_media?.cdn_url || profile.cover_image || gallery.find((g: any) => g.media?.cdn_url)?.media?.cdn_url || "";
      const startingPrice = services.length > 0 ? Math.min(...services.map((s: any) => Number(s.base_price || 0)).filter((p: number) => p > 0)) : (profile.starting_price || 0);

      return {
        id: v.id,
        vendorCode: v.vendor_code,
        slug: profile.slug || v.vendor_code || v.id,
        name: profile.business_name || "Unnamed Vendor",
        category: v.vendor_categories?.name || "Vendor",
        categorySlug: v.vendor_categories?.slug || "general",
        city: profile.city || "Kochi",
        state: profile.state || "Kerala",
        rating: Number(profile.rating || 5.0),
        reviewCount: Number(profile.review_count || 0),
        startingPrice: startingPrice > 0 ? `₹${startingPrice.toLocaleString("en-IN")}` : "Contact for pricing",
        logo: logoImg,
        logoUrl: logoImg,
        coverImage: coverImg,
        about: profile.about || "",
        tagline: profile.tagline || "",
        isVerified: Boolean(v.is_verified || v.is_kyc_verified),
        phone: contact.phone || "",
        whatsapp: contact.whatsapp || "",
      };
    });

    // In-memory filters for search and rating
    if (city) {
      items = items.filter((item: any) => item.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (search) {
      items = items.filter(
        (item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()) ||
          item.city.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (minRating > 0) {
      items = items.filter((item: any) => item.rating >= minRating);
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: items,
        count: items.length,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[PUBLIC_VENDORS_API] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
