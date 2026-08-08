import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

// GET /api/vendor/makeup/portfolio?vendor_id=...
export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data } = await supabaseFetch(
      `makeup_portfolio?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc&select=*`
    );

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/vendor/makeup/portfolio
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const body = await request.json();
    const { id, category, image_url, caption, sort_order } = body;

    if (!image_url) {
      return NextResponse.json({ error: "Portfolio image URL is required." }, { status: 400 });
    }

    if (id && !(await vendorOwnsRecord("makeup_portfolio", id, auth.vendorId))) {
      return NextResponse.json({ error: "Portfolio item not found." }, { status: 404 });
    }

    const portfolioRecord = {
      ...(id ? { id } : {}),
      vendor_id: auth.vendorId,
      category: category || "Bridal",
      image_url,
      caption: caption || "",
      sort_order: sort_order ? Number(sort_order) : 0
    };

    const { data, error } = await supabaseFetch("makeup_portfolio", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(portfolioRecord)
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Portfolio photo saved successfully!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

// DELETE /api/vendor/makeup/portfolio?id=...
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Portfolio ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_portfolio?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "Portfolio photo deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
