import { NextResponse } from "next/server";
import { saveLeadToDb, saveLeadActivityToDb } from "@/lib/supabase";
import { notificationService } from "@/lib/notifications";
import { sendVerificationMail } from "@/lib/email";

export async function POST(req: Request) {
  const logPrefix = "[LEAD_CAPTURE_API]";

  try {
    const body = await req.json();
    const {
      vendor_id,
      customer_name,
      customer_phone,
      customer_email,
      event_type,
      event_date,
      city,
      pincode,
      venue_name,
      guest_count,
      estimated_budget,
      message,
    } = body;

    if (!vendor_id || !customer_name || !customer_phone || !event_date) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: { code: "VALIDATION_ERROR", message: "Vendor ID, customer name, phone number, and event date are required." },
        },
        { status: 400 }
      );
    }

    const payload = {
      vendor_id,
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email ? customer_email.trim().toLowerCase() : null,
      event_type: event_type || "Wedding",
      event_date,
      city: city ? city.trim() : null,
      pincode: pincode ? pincode.trim() : null,
      venue_name: venue_name ? venue_name.trim() : null,
      guest_count: guest_count ? Number(guest_count) : null,
      estimated_budget: estimated_budget ? Number(estimated_budget) : null,
      message: message ? message.trim() : null,
      source: "website",
      status: "new",
    };

    console.log(`${logPrefix} Saving lead for vendor ${vendor_id}...`);
    const { data, error } = await saveLeadToDb(payload);

    if (error) {
      console.error(`${logPrefix} Lead database write error:`, error);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    const createdLead = Array.isArray(data) ? data[0] : data;

    // Log Activity in Lead Audit Timeline & Dispatch Event via NotificationService
    if (createdLead?.id) {
      await saveLeadActivityToDb(createdLead.id, "lead_created", `Lead created by customer ${customer_name.trim()}`).catch(() => null);

      await notificationService.enqueueEvent({
        eventType: "LEAD_CREATED",
        recipientEmail: customer_email ? customer_email.trim().toLowerCase() : undefined,
        data: {
          leadId: createdLead.id,
          vendorId: vendor_id,
          customerName: customer_name.trim(),
          eventType: event_type || "Wedding",
          eventDate: event_date,
        },
      }).catch(() => null);
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 201,
        message: "Your inquiry has been submitted successfully! The vendor will contact you shortly.",
        data: createdLead,
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
