import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/rbac";
import {
  bookMehendiAppointment,
  checkAppointmentAvailability,
  resolveMehendiVendorByIdentifier,
} from "@/lib/mehendiData";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const vendorRow = await resolveMehendiVendorByIdentifier(id);
    if (!vendorRow?.id) {
      return NextResponse.json({ error: "Mehendi artist not found." }, { status: 404 });
    }

    const body = await req.json();
    const cookieStore = await cookies();
    const authUser = getAuthenticatedUser({ cookies: cookieStore });
    const customerId = authUser?.userId || authUser?.id || body.customerId || null;

    // Check availability first
    if (body.appointmentDate) {
      const avail = await checkAppointmentAvailability(vendorRow.id, body.appointmentDate, body.preferredTime);
      if (!avail.isAvailable) {
        return NextResponse.json(
          { error: avail.conflictReason || "Selected date is not available for appointments." },
          { status: 409 }
        );
      }
    }

    const result = await bookMehendiAppointment(vendorRow.id, {
      customerId,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      serviceName: body.serviceName,
      serviceId: body.serviceId,
      packageName: body.packageName,
      designTitle: body.designTitle,
      appointmentDate: body.appointmentDate,
      preferredTime: body.preferredTime,
      locationType: body.locationType,
      eventAddress: body.eventAddress,
      peopleCount: Number(body.peopleCount) || 1,
      specialRequirements: body.specialRequirements,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          leadId: result.leadId,
          bookingRef: result.bookingRef,
          message: "Appointment request submitted successfully! The artist will review and confirm your slot.",
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[PUBLIC_MEHENDI_BOOK_POST]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to submit appointment request." },
      { status: 400 }
    );
  }
}

