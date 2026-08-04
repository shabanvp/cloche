import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

// GET /api/vendor/makeup/portfolio?vendor_id=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendor_id") || "makeup-riya-sharma";

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
    const body = await request.json();
    const { id, vendor_id, category, image_url, caption, sort_order } = body;

    if (!image_url) {
      return NextResponse.json({ error: "Portfolio image URL is required." }, { status: 400 });
    }

    const portfolioRecord = {
      ...(id ? { id } : {}),
      vendor_id: vendor_id || "makeup-riya-sharma",
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Portfolio ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_portfolio?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "Portfolio photo deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
