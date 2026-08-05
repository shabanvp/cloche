import { NextResponse } from "next/server";
import { updateQuotationCustomerStatusInDb, supabaseFetch } from "@/lib/supabase";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const { data: quotations, error } = await supabaseFetch(
      `quotations?select=*,quotation_items(*),vendors(*),leads!inner(customer_id)&leads.customer_id=eq.${encodeURIComponent(authUser.userId)}&order=created_at.desc`
    );

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: quotations || [] },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { quotation_id, status, notes } = body;

    const allowedStatuses = ["customer_interested", "revision_requested", "archived"];
    if (!quotation_id || !status || !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: {
            code: "VALIDATION_ERROR",
            message: `Quotation ID and valid status (${allowedStatuses.join(", ")}) required.`,
          },
        },
        { status: 400 }
      );
    }

    const { data, error } = await updateQuotationCustomerStatusInDb(quotation_id, authUser.userId, status, notes);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "UPDATE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: `Quotation updated to '${status}'. Vendor notified.`,
        data,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
