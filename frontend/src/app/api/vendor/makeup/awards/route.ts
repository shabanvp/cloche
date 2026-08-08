import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

// GET /api/vendor/makeup/awards?vendor_id=...
export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data } = await supabaseFetch(
      `makeup_awards?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`
    );

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/vendor/makeup/awards
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const body = await request.json();
    const { id, title, organization, year, image } = body;

    if (!title) {
      return NextResponse.json({ error: "Award title is required." }, { status: 400 });
    }

    if (id && !(await vendorOwnsRecord("makeup_awards", id, auth.vendorId))) {
      return NextResponse.json({ error: "Award not found." }, { status: 404 });
    }

    const awardRecord = {
      ...(id ? { id } : {}),
      vendor_id: auth.vendorId,
      title,
      organization: organization || "Vogue / WedMeGood",
      year: year || "2025",
      image: image || ""
    };

    const { data, error } = await supabaseFetch("makeup_awards", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(awardRecord)
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Award saved successfully!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/vendor/makeup/awards?id=...
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Award ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_awards?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "Award deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
