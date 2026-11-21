import { NextResponse } from "next/server";
import { resolveMehendiVendorByIdentifier, trackMehendiEvent } from "@/lib/mehendiData";

interface Props {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const vendorRow = await resolveMehendiVendorByIdentifier(id);
    if (!vendorRow?.id) {
      return NextResponse.json({ error: "Vendor not found." }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const eventType = body?.type || "profile_view";
    await trackMehendiEvent(vendorRow.id, eventType, {
      targetId: body?.targetId,
      sessionId: body?.sessionId,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true }); // non-fatal for analytics
  }
}

