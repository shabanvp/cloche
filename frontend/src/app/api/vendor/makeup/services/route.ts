import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

// GET /api/vendor/makeup/services?vendor_id=...
export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data, error } = await supabaseFetch(
      `makeup_services?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.asc&select=*`
    );

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/vendor/makeup/services
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const body = await request.json();
    const { id, service_name, description, duration, price, image, active } = body;

    if (!service_name) {
      return NextResponse.json({ error: "Service name is required." }, { status: 400 });
    }
    if (price === undefined || isNaN(Number(price))) {
      return NextResponse.json({ error: "Price must be a valid number." }, { status: 400 });
    }

    if (id && !(await vendorOwnsRecord("makeup_services", id, auth.vendorId))) {
      return NextResponse.json({ error: "Service not found." }, { status: 404 });
    }

    const serviceRecord = {
      ...(id ? { id } : {}),
      vendor_id: auth.vendorId,
      service_name,
      description: description || "",
      duration: duration || "3 Hours",
      price: Number(price),
      image: image || "",
      active: active !== undefined ? Boolean(active) : true,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseFetch("makeup_services", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(serviceRecord)
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Service saved successfully!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

// DELETE /api/vendor/makeup/services?id=...
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Service ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_services?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`, {
      method: "DELETE"
    });

    return NextResponse.json({ success: true, message: "Service deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
