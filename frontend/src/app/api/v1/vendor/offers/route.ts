import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

function normalizeOfferPayload(body: Record<string, any>, vendorId: string) {
  const title = body.title || body.name || "Promotional Offer";
  const code = (body.promo_code || body.code || body.coupon_code || "FESTIVE").toUpperCase();
  const discount = body.discount || body.discount_value || "15% OFF";

  return {
    id: body.id || `off-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    vendor_id: vendorId,
    title,
    name: title,
    promo_code: code,
    code,
    coupon_code: code,
    discount,
    discount_value: discount,
    description: body.description || "",
    validity: body.validity || "Valid for 30 days",
    is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
    status: body.status || (body.is_active !== false ? "active" : "inactive"),
    updated_at: new Date().toISOString(),
  };
}

export async function GET(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

    const { data, error } = await supabaseFetch(
      `offers?vendor_id=eq.${encodeURIComponent(auth.vendorId)}&order=created_at.desc&select=*`
    );

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, statusCode: 200, data: data || [] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

    const body = await req.json();
    if (body.id && !(await vendorOwnsRecord("offers", body.id, auth.vendorId))) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Offer not found." } },
        { status: 404 }
      );
    }

    const { data, error } = await supabaseFetch("offers", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(normalizeOfferPayload(body, auth.vendorId)),
    });

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, statusCode: body.id ? 200 : 201, data }, { status: body.id ? 200 : 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

    const body = await req.json();
    if (!body.id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "MISSING_ID", message: "Offer ID is required." } },
        { status: 400 }
      );
    }

    if (!(await vendorOwnsRecord("offers", body.id, auth.vendorId))) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Offer not found." } },
        { status: 404 }
      );
    }

    const { id, ...patchBody } = body;
    const { data, error } = await supabaseFetch(
      `offers?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify(normalizeOfferPayload(patchBody, auth.vendorId)),
      }
    );

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "UPDATE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, statusCode: 200, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "MISSING_ID", message: "Offer ID is required." } },
        { status: 400 }
      );
    }

    const { error } = await supabaseFetch(
      `offers?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`,
      { method: "DELETE" }
    );

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "DELETE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, statusCode: 200 }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
