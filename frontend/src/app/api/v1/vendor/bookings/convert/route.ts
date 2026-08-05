import { NextResponse } from "next/server";
import { convertQuoteToBookingInDb } from "@/lib/supabase";
import { notificationService } from "@/lib/notifications";

export async function POST(req: Request) {
  const logPrefix = "[QUOTE_TO_BOOKING_CONVERT_API]";

  try {
    const body = await req.json();
    const { quotation_id, vendor_id, user_id } = body;

    if (!quotation_id || !vendor_id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Quotation ID and Vendor ID are required." } },
        { status: 400 }
      );
    }

    console.log(`${logPrefix} Converting quotation ${quotation_id} for vendor ${vendor_id}...`);
    const { data, error } = await convertQuoteToBookingInDb(quotation_id, vendor_id, user_id);

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
        vendorId: vendor_id,
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
