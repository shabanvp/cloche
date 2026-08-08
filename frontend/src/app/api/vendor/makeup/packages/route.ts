import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

// GET /api/vendor/makeup/packages?vendor_id=...
export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data } = await supabaseFetch(
      `makeup_packages?vendor_id=eq.${encodeURIComponent(vendorId)}&order=created_at.asc&select=*`
    );

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/vendor/makeup/packages
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const body = await request.json();
    const { id, package_name, description, price, includes, travel, assistant, trial, hair, draping } = body;

    if (!package_name) {
      return NextResponse.json({ error: "Package name is required." }, { status: 400 });
    }
    if (price === undefined || isNaN(Number(price))) {
      return NextResponse.json({ error: "Price must be a valid number." }, { status: 400 });
    }

    if (id && !(await vendorOwnsRecord("makeup_packages", id, auth.vendorId))) {
      return NextResponse.json({ error: "Package not found." }, { status: 404 });
    }

    const packageRecord = {
      ...(id ? { id } : {}),
      vendor_id: auth.vendorId,
      package_name,
      description: description || "",
      price: Number(price),
      includes: includes || [],
      travel: travel || "Travel charges extra as applicable",
      assistant: assistant || "Senior assistant team included",
      trial: trial || "Complimentary trial session on confirmation",
      hair: hair || "Hair styling included",
      draping: draping || "Lehenga & Dupatta draping included",
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseFetch("makeup_packages", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(packageRecord)
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Package saved successfully!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

// DELETE /api/vendor/makeup/packages?id=...
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Package ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_packages?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`, {
      method: "DELETE"
    });

    return NextResponse.json({ success: true, message: "Package deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
