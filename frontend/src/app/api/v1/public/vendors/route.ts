import { NextResponse } from "next/server";
import { getSupabaseConfig, supabaseFetch } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  venues: ["venues", "wedding-venue", "wedding-venues"],
  "wedding-venue": ["venues", "wedding-venue", "wedding-venues"],
  "wedding-venues": ["venues", "wedding-venue", "wedding-venues"],
  makeup: ["makeup", "makeup-artist", "bridal-makeup", "makeup-artists"],
  "makeup-artists": ["makeup", "makeup-artist", "bridal-makeup", "makeup-artists"],
  "makeup-artist": ["makeup", "makeup-artist", "bridal-makeup", "makeup-artists"],
  photographers: ["photographers", "photographer", "videographer"],
  photographer: ["photographers", "photographer", "videographer"],
  catering: ["catering", "caterer", "caterers"],
  caterer: ["catering", "caterer", "caterers"],
  "decor-planning": ["decorators", "decorator", "planners", "wedding-planner", "flower-decoration", "decor-planning"],
  decorators: ["decorators", "decorator", "planners", "wedding-planner", "flower-decoration", "decor-planning"],
  decorator: ["decorators", "decorator", "planners", "wedding-planner", "flower-decoration", "decor-planning"],
  "bridal-wear": ["bridal-wear", "bridal-boutique", "boutiques"],
  "bridal-boutique": ["bridal-wear", "bridal-boutique", "boutiques"],
  boutiques: ["bridal-wear", "bridal-boutique", "boutiques"],
  jewellery: ["jewellery", "jewellery-store", "jewelry"],
  "jewellery-store": ["jewellery", "jewellery-store", "jewelry"],
  "mehendi-artists": ["mehndi", "mehendi-artist", "mehendi-artists", "mehendi"],
  "mehendi-artist": ["mehndi", "mehendi-artist", "mehendi-artists", "mehendi"],
  mehendi: ["mehndi", "mehendi-artist", "mehendi-artists", "mehendi"],
  mehndi: ["mehndi", "mehendi-artist", "mehendi-artists", "mehendi"],
  invitations: ["invitations", "invitation-designer"],
  "invitation-designer": ["invitations", "invitation-designer"],
  "groom-wear": ["groom-wear"],
  "djs-bands": ["djs-bands", "entertainment", "wedding-entertainment-legacy", "choreographer"],
  entertainment: ["djs-bands", "entertainment", "wedding-entertainment-legacy", "choreographer"],
  "cake-designer": ["cake-designer", "cakes"],
  "car-rental": ["car-rental"],
};

function getMatchingSlugs(inputSlug: string): string[] {
  const norm = (inputSlug || "").toLowerCase().trim();
  if (CATEGORY_SYNONYMS[norm]) return CATEGORY_SYNONYMS[norm];
  for (const [key, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (key === norm || synonyms.includes(norm) || norm.includes(key)) {
      return synonyms;
    }
  }
  return [norm];
}

export async function GET(req: Request) {
  const startTime = Date.now();
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category") || searchParams.get("categorySlug") || searchParams.get("category_slug") || "";
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
      const matchingSlugs = getMatchingSlugs(categorySlug);
      const catRes = await supabaseFetch(`vendor_categories?select=id,name,slug`);
      const allCats = Array.isArray(catRes.data) ? catRes.data : [];
      const matchedCatIds = allCats
        .filter((c: any) => {
          const cSlug = (c.slug || "").toLowerCase();
          const cName = (c.name || "").toLowerCase();
          return matchingSlugs.includes(cSlug) || matchingSlugs.some((ms) => cSlug.includes(ms) || cName.includes(ms));
        })
        .map((c: any) => c.id);

      if (matchedCatIds.length > 0) {
        filter += `&category_id=in.(${matchedCatIds.map((id: string) => encodeURIComponent(id)).join(",")})`;
      } else {
        filter += `&category_id=eq.00000000-0000-0000-0000-000000000000`;
      }
    }

    const vendorIdParam = searchParams.get("id") || "";
    if (vendorIdParam) {
      filter += `&id=eq.${encodeURIComponent(vendorIdParam)}`;
    }

    const endpoint = `vendors?${filter}&select=id,vendor_code,status,publication_status,is_verified,is_kyc_verified,created_at,vendor_categories(id,name,slug),vendor_profiles(*,logo_media:media!logo_media_id(cdn_url),cover_media:media!cover_media_id(cdn_url)),vendor_contacts(*),vendor_services(id,name,base_price,pricing_type),vendor_gallery(id,media(cdn_url,file_path)),vendor_social_links(*),catering_details(*)&order=created_at.desc&limit=${limit}&offset=${offset}`;

    const res = await supabaseFetch(endpoint);
    console.log(`[DB:FETCH] public_vendors filter=${filter} rows=${Array.isArray(res.data) ? res.data.length : 0} ms=${Date.now() - startTime}`);

    if (res.error || !Array.isArray(res.data)) {
      return NextResponse.json(
        { success: true, statusCode: 200, data: [], count: 0 },
        { status: 200 }
      );
    }

    let items = res.data.map((v: any) => {
      const profile =
        Array.isArray(v.vendor_profiles) && v.vendor_profiles.length > 0
          ? v.vendor_profiles[0]
          : v.vendor_profiles && typeof v.vendor_profiles === "object"
          ? v.vendor_profiles
          : {};
      const contact =
        Array.isArray(v.vendor_contacts) && v.vendor_contacts.length > 0
          ? v.vendor_contacts[0]
          : v.vendor_contacts && typeof v.vendor_contacts === "object"
          ? v.vendor_contacts
          : {};
      const gallery = Array.isArray(v.vendor_gallery) ? v.vendor_gallery : [];
      const services = Array.isArray(v.vendor_services) ? v.vendor_services : [];
      const socialList = Array.isArray(v.vendor_social_links) ? v.vendor_social_links : [];
      const cateringDetail = Array.isArray(v.catering_details) && v.catering_details.length > 0 ? v.catering_details[0] : {};

      const logoImg = profile.logo_media?.cdn_url || profile.logo_url || "";
      const coverImg = profile.cover_media?.cdn_url || profile.cover_image || gallery.find((g: any) => g.media?.cdn_url)?.media?.cdn_url || "";
      const startingPrice = services.length > 0 ? Math.min(...services.map((s: any) => Number(s.base_price || 0)).filter((p: number) => p > 0)) : (profile.starting_price || 0);

      const instagram = socialList.find((s: any) => s.platform === "instagram")?.url || contact.instagram || "";
      const facebook = socialList.find((s: any) => s.platform === "facebook")?.url || contact.facebook || "";
      const youtube = socialList.find((s: any) => s.platform === "youtube")?.url || contact.youtube || "";
      const website = socialList.find((s: any) => s.platform === "website")?.url || contact.website || "";

      return {
        id: v.id,
        vendorCode: v.vendor_code,
        slug: profile.slug || v.vendor_code || v.id,
        name: profile.business_name || "Unnamed Vendor",
        category: v.vendor_categories?.name || "Vendor",
        categorySlug: v.vendor_categories?.slug || "general",
        city: profile.city || "Kochi",
        state: profile.state || "Kerala",
        rating: Number(profile.rating ?? 0),
        reviewCount: Number(profile.review_count ?? 0),
        startingPrice: startingPrice > 0 ? `₹${startingPrice.toLocaleString("en-IN")}` : "Contact for pricing",
        logo: logoImg,
        logoUrl: logoImg,
        coverImage: coverImg,
        about: profile.about || "",
        tagline: profile.tagline || "",
        colorTheme: profile.color_theme || "emerald",
        galleryLayout: profile.gallery_layout || "grid",
        introVideo: profile.intro_video_url || "",
        instagram,
        facebook,
        youtube,
        website,
        cuisineTypes: cateringDetail.cuisine_types || profile.cuisine_types || [],
        serviceTypes: cateringDetail.service_types || profile.service_types || [],
        serviceLocations: cateringDetail.service_locations || profile.service_locations || [],
        guestCapacity: cateringDetail.guest_capacity || profile.guest_capacity || "",
        cateringSpecialities: cateringDetail.catering_specialities || profile.catering_specialities || [],
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
