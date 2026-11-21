import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import { listMehendiAppointments } from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const appointments = await listMehendiAppointments(context.vendorId);
    return NextResponse.json({ success: true, data: appointments });
  } catch (err: any) {
    console.error("[MEHENDI_LEADS_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load leads." },
      { status: 500 }
    );
  }
}

