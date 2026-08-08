import { NextResponse } from "next/server";
import { fetchVendorLeadsFromDb, saveLeadToDb, saveLeadActivityToDb } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(req.url);
    const vendorId = auth.vendorId;
    const status = searchParams.get("status") || "all";

    const { data, error } = await fetchVendorLeadsFromDb(vendorId, status);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: data || [] },
      { status: 200 }
    );
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
    const { data, error } = await saveLeadToDb({ ...body, vendor_id: auth.vendorId });

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    const savedLead = Array.isArray(data) ? data[0] : data;
    if (savedLead?.id) {
      await saveLeadActivityToDb(savedLead.id, "lead_created", `Lead created manually for ${savedLead.customer_name}`);
    }

    return NextResponse.json(
      { success: true, statusCode: 201, message: "Lead saved successfully", data: savedLead },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
