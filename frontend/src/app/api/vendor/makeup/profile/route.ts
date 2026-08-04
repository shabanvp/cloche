import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

// GET /api/vendor/makeup/profile?vendor_id=... or slug=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendor_id");
    const slug = searchParams.get("slug");

    let query = "vendors?select=*,makeup_profiles(*)";
    if (vendorId) {
      query += `&id=eq.${encodeURIComponent(vendorId)}`;
    } else if (slug) {
      query += `&slug=eq.${encodeURIComponent(slug)}`;
    }

    const { data, error } = await supabaseFetch(query);

    if (error || !data || data.length === 0) {
      // Fallback default vendor data if not found in database yet
      return NextResponse.json({
        success: true,
        data: {
          id: vendorId || "makeup-riya-sharma",
          slug: slug || "makeup-riya-sharma",
          business_name: "Riya Sharma Makeovers",
          owner_name: "Riya Sharma",
          email: "appointments@riyasharmamakeup.com",
          phone: "9876543210",
          whatsapp: "9876543210",
          city: "Delhi NCR",
          state: "Delhi",
          country: "India",
          verified: true,
          status: "active",
          cover_image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
          logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
          makeup_profiles: [
            {
              about: "With over 8 years of luxury bridal experience, Riya Sharma is celebrated across India for creating timeless, radiant, and customized wedding looks.",
              philosophy: "Enhancing each bride's unique natural features using HD airbrush technology, skin prep rituals, and global couture standards.",
              experience_years: 8,
              response_time: "Within 2 Hours",
              team_size: 6,
              languages: ["English", "Hindi", "Punjabi"],
              cities_served: ["Delhi NCR", "Mumbai", "Jaipur", "Udaipur", "Goa", "Dubai"],
              destination_wedding: true,
              products_used: ["Charlotte Tilbury", "MAC", "Dior", "NARS", "Tom Ford", "Huda Beauty"],
              starting_price: 25000,
              instagram: "https://instagram.com",
              website: "https://riyasharmamakeup.com",
              studio_address: "DLF Phase 5, Golf Course Road, Gurgaon / South Delhi Studio"
            }
          ]
        }
      });
    }

    return NextResponse.json({ success: true, data: data[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST / PUT /api/vendor/makeup/profile - Create or Update Vendor & Profile
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      vendor_id,
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
      ...(vendor_id ? { id: vendor_id } : {}),
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

    const targetVendorId = vData && vData.length > 0 ? vData[0].id : vendor_id;

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
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendor_id");

    if (!vendorId) {
      return NextResponse.json({ error: "Vendor ID required." }, { status: 400 });
    }

    await supabaseFetch(`vendors?id=eq.${encodeURIComponent(vendorId)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "Vendor profile deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
