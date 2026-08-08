import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";

// GET /api/vendor/makeup/profile?vendor_id=... or slug=...
export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    let query = "vendors?select=*,makeup_profiles(*)";
    query += `&id=eq.${encodeURIComponent(vendorId)}`;

    const { data, error } = await supabaseFetch(query);

    if (error || !data || data.length === 0) {
      return NextResponse.json({ success: false, error: "Vendor profile not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST / PUT /api/vendor/makeup/profile - Create or Update Vendor & Profile
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const body = await request.json();
    const {
      slug,
      business_name,
      owner_name,
      email,
      phone,
      whatsapp,
      city,
      state,
      country,
      cover_image,
      logo,
      about,
      philosophy,
      experience_years,
      response_time,
      team_size,
      languages,
      cities_served,
      destination_wedding,
      products_used,
      starting_price,
      instagram,
      facebook,
      youtube,
      website,
      studio_address
    } = body;

    // Validation
    if (!business_name) {
      return NextResponse.json({ error: "Business name is required." }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    const vendorSlug = slug || business_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    // 1. Save or Update Vendor record
    const vendorRecord = {
      id: auth.vendorId,
      business_name,
      owner_name: owner_name || business_name,
      slug: vendorSlug,
      email: email || "vendor@cloche.luxury",
      phone,
      whatsapp: whatsapp || phone,
      city: city || "Delhi NCR",
      state: state || "Delhi",
      country: country || "India",
      cover_image,
      logo,
      category: "Bridal Makeup Artist",
      updated_at: new Date().toISOString()
    };

    const { data: vData, error: vErr } = await supabaseFetch("vendors", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(vendorRecord)
    });

    const targetVendorId = auth.vendorId;

    // 2. Save or Update Makeup Profile metadata record
    if (targetVendorId) {
      const profileRecord = {
        vendor_id: targetVendorId,
        about,
        philosophy,
        experience_years: experience_years ? Number(experience_years) : 8,
        response_time: response_time || "Within 2 Hours",
        team_size: team_size ? Number(team_size) : 6,
        languages: languages || ["English", "Hindi"],
        cities_served: cities_served || ["Delhi NCR", "Mumbai"],
        destination_wedding: Boolean(destination_wedding),
        products_used: products_used || ["MAC", "Charlotte Tilbury"],
        starting_price: starting_price ? Number(starting_price) : 25000,
        instagram,
        facebook,
        youtube,
        website,
        studio_address,
        updated_at: new Date().toISOString()
      };

      await supabaseFetch("makeup_profiles", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(profileRecord)
      });
    }

    return NextResponse.json({
      success: true,
      message: "Makeup artist profile saved successfully!",
      vendor_id: targetVendorId
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

// DELETE /api/vendor/makeup/profile
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(request.url);
    const vendorId = auth.vendorId;

    await supabaseFetch(`vendors?id=eq.${encodeURIComponent(vendorId)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "Vendor profile deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
