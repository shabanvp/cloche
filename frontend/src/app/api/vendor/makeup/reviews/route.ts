import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

// GET /api/vendor/makeup/reviews?vendor_id=...
export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data } = await supabaseFetch(
      `makeup_reviews?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.desc&select=*`
    );

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/vendor/makeup/reviews (Add review or Vendor Reply)
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const body = await request.json();
    const { id, customer_name, customer_avatar, rating, review, wedding_date, images, vendor_reply } = body;

    if (!customer_name || !review) {
      return NextResponse.json({ error: "Customer name and review text are required." }, { status: 400 });
    }

    if (id && !(await vendorOwnsRecord("makeup_reviews", id, auth.vendorId))) {
      return NextResponse.json({ error: "Review not found." }, { status: 404 });
    }

    const reviewRecord = {
      ...(id ? { id } : {}),
      vendor_id: auth.vendorId,
      customer_name,
      customer_avatar: customer_avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
      rating: rating ? Number(rating) : 5,
      review,
      wedding_date: wedding_date || "March 2026",
      images: images || [],
      vendor_reply: vendor_reply || null,
      verified_bride: true
    };

    const { data, error } = await supabaseFetch("makeup_reviews", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(reviewRecord)
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Review saved successfully!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

// DELETE /api/vendor/makeup/reviews?id=...
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Review ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_reviews?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "Review deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
