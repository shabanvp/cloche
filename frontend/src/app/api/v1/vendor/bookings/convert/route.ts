import { NextResponse } from "next/server";
import { convertQuoteToBookingInDb } from "@/lib/supabase";
import { notificationService } from "@/lib/notifications";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

export async function POST(req: Request) {
  const logPrefix = "[QUOTE_TO_BOOKING_CONVERT_API]";

  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const body = await req.json();
    const { quotation_id, user_id } = body;

    if (!quotation_id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Quotation ID is required." } },
        { status: 400 }
      );
    }

    if (!(await vendorOwnsRecord("quotations", quotation_id, auth.vendorId))) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Quotation not found." } },
        { status: 404 }
      );
    }

    console.log(`${logPrefix} Converting quotation ${quotation_id} for vendor ${auth.vendorId}...`);
    const { data, error } = await convertQuoteToBookingInDb(quotation_id, auth.vendorId, user_id || auth.user.userId);

    if (error) {
      const errMsg = error.message || "Quote-to-booking conversion failed.";
      console.warn(`${logPrefix} Conversion rejected: ${errMsg}`);
      return NextResponse.json(
        {
          success: false,
          statusCode: errMsg.includes("Calendar Conflict") ? 409 : 400,
          error: { code: errMsg.includes("Calendar Conflict") ? "CALENDAR_CONFLICT" : "CONVERSION_FAILED", message: errMsg },
        },
        { status: errMsg.includes("Calendar Conflict") ? 409 : 400 }
      );
    }

    const conversionResult = typeof data === "string" ? JSON.parse(data) : data;

    // Dispatch BOOKING_CONFIRMED Event via NotificationService
    await notificationService.enqueueEvent({
      eventType: "BOOKING_CONFIRMED",
      data: {
        bookingId: conversionResult.booking_id,
        bookingNumber: conversionResult.booking_number,
        quotationId: quotation_id,
        vendorId: auth.vendorId,
      },
    }).catch(() => null);

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: `Quotation successfully converted to Booking ${conversionResult.booking_number}!`,
        data: conversionResult,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} Unhandled error:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
