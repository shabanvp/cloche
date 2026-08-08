import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

// GET /api/vendor/makeup/faqs?vendor_id=...
export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data } = await supabaseFetch(
      `makeup_faqs?vendor_id=eq.${encodeURIComponent(vendorId)}&order=sort_order.asc&select=*`
    );

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/vendor/makeup/faqs
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const body = await request.json();
    const { id, question, answer, sort_order } = body;

    if (!question || !answer) {
      return NextResponse.json({ error: "Question and Answer are required." }, { status: 400 });
    }

    if (id && !(await vendorOwnsRecord("makeup_faqs", id, auth.vendorId))) {
      return NextResponse.json({ error: "FAQ not found." }, { status: 404 });
    }

    const faqRecord = {
      ...(id ? { id } : {}),
      vendor_id: auth.vendorId,
      question,
      answer,
      sort_order: sort_order ? Number(sort_order) : 0
    };

    const { data, error } = await supabaseFetch("makeup_faqs", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(faqRecord)
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "FAQ saved successfully!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

// DELETE /api/vendor/makeup/faqs?id=...
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "FAQ ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_faqs?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "FAQ deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
