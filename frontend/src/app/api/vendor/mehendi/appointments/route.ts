import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import {
  listMehendiAppointments,
  updateMehendiAppointmentStatus,
} from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const appointments = await listMehendiAppointments(context.vendorId);
    return NextResponse.json({ success: true, data: appointments });
  } catch (err: any) {
    console.error("[MEHENDI_APPOINTMENTS_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load appointments." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const { id, status, proposedTime, proposedDate, reason } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Appointment ID and status are required." },
        { status: 400 }
      );
    }

    await updateMehendiAppointmentStatus(context.vendorId, context.userId, id, status, {
      proposedTime,
      proposedDate,
      reason,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_APPOINTMENTS_PATCH]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update appointment status." },
      { status: 400 }
    );
  }
}

