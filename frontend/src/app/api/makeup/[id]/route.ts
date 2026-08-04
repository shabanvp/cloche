import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch vendor & profile by ID or Slug
    const { data: vData } = await supabaseFetch(
      `vendors?or=(id.eq.${encodeURIComponent(id)},slug.eq.${encodeURIComponent(id)})&select=*,makeup_profiles(*)`
    );

    const vendor = vData && vData.length > 0 ? vData[0] : null;
    const vendorId = vendor ? vendor.id : id;

    // Fetch associated normalized child tables in parallel
    const [
      { data: services },
      { data: packages },
      { data: portfolio },
      { data: videos },
      { data: reviews },
      { data: faqs },
      { data: awards }
    ] = await Promise.all([
      supabaseFetch(`makeup_services?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.asc`),
      supabaseFetch(`makeup_packages?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.asc`),
      supabaseFetch(`makeup_portfolio?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc`),
      supabaseFetch(`makeup_videos?vendor_id=eq.${encodeURIComponent(vendorId)}`),
      supabaseFetch(`makeup_reviews?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc`),
      supabaseFetch(`makeup_faqs?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc`),
      supabaseFetch(`makeup_awards?vendor_id=eq.${encodeURIComponent(vendorId)}`)
    ]);

    return NextResponse.json({
      success: true,
      vendor: vendor || {
        id: "makeup-riya-sharma",
        business_name: "Riya Sharma Makeovers",
        slug: "makeup-riya-sharma",
        rating: 4.9,
        reviews: 328,
        category: "Bridal Makeup Artist",
        location: "Delhi NCR & Destination Worldwide",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
        images: [
          "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80"
        ],
        about: "With over 8 years of luxury bridal experience, Riya Sharma is celebrated across India for creating timeless, radiant, and customized wedding looks.",
        phone: "9876543210",
        email: "appointments@riyasharmamakeup.com"
      },
      services: services || [],
      packages: packages || [],
      portfolio: portfolio || [],
      videos: videos || [],
      reviews: reviews || [],
      faqs: faqs || [],
      awards: awards || []
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
