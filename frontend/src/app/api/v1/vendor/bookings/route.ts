import { NextResponse } from "next/server";
import { fetchVendorBookingsFromDb, supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor } from "@/lib/vendorAuth";

export async function GET(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(req.url);
    const vendorId = auth.vendorId;
    const status = searchParams.get("status") || "all";

    const { data, error } = await fetchVendorBookingsFromDb(vendorId, status);

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
    const { clientName, eventDate, timeSlot, eventType, location, phone, amount } = body;

    if (!clientName || !eventDate) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Client name and event date are required." } },
        { status: 400 }
      );
    }

    const payload = {
      vendor_id: auth.vendorId,
      booking_number: `BKG-${Date.now().toString().slice(-6)}`,
      status: "confirmed",
      event_date: eventDate,
      event_location: location || "Client Venue",
      total_amount: typeof amount === "number" ? amount : parseFloat(String(amount || 0).replace(/[^0-9.]/g, "")) || 0,
      notes: `${eventType || "Wedding Event"} (${timeSlot || "Full Day"}) - Client: ${clientName}, Phone: ${phone || "N/A"}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseFetch("bookings", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    });

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 201, message: "Booking created successfully", data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
