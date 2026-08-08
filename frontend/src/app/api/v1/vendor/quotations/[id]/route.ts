import { NextResponse } from "next/server";
import { saveQuotationToDb, updateLeadStatusInDb, saveLeadActivityToDb, supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const { id } = await params;
    const { data, error } = await supabaseFetch(
      `quotations?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}&select=*,quotation_items(*),leads(*)`
    );

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Quotation not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: data[0] },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Status is required." } },
        { status: 400 }
      );
    }

    if (!(await vendorOwnsRecord("quotations", id, auth.vendorId))) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Quotation not found." } },
        { status: 404 }
      );
    }

    const patchPayload: Record<string, any> = {
      id,
      vendor_id: auth.vendorId,
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "accepted") {
      patchPayload.accepted_at = new Date().toISOString();
    } else if (status === "declined" || status === "rejected") {
      patchPayload.declined_at = new Date().toISOString();
    }

    const { data, error } = await saveQuotationToDb(patchPayload);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "UPDATE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    const updatedQuotation = Array.isArray(data) ? data[0] : data;

    if (updatedQuotation?.lead_id) {
      if (status === "accepted") {
        await updateLeadStatusInDb(updatedQuotation.lead_id, "accepted", auth.vendorId).catch(() => null);
        await saveLeadActivityToDb(updatedQuotation.lead_id, "quote_accepted", `Quotation accepted by customer!`).catch(() => null);
      } else if (status === "declined" || status === "rejected") {
        await updateLeadStatusInDb(updatedQuotation.lead_id, "lost", auth.vendorId).catch(() => null);
        await saveLeadActivityToDb(updatedQuotation.lead_id, "quote_rejected", `Quotation declined by customer. Note: ${note || 'None'}`).catch(() => null);
      }
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: `Quotation status updated to ${status}`, data: updatedQuotation },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
