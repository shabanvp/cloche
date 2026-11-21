import { NextResponse } from "next/server";
import {
  listMehendiReviews,
  resolveMehendiVendorByIdentifier,
} from "@/lib/mehendiData";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Props) {
  try {
    const { id } = await params;
    const vendorRow = await resolveMehendiVendorByIdentifier(id);
    if (!vendorRow?.id) {
      return NextResponse.json({ error: "Mehendi artist not found." }, { status: 404 });
    }

    const bundle = await listMehendiReviews(vendorRow.id);
    return NextResponse.json({ success: true, data: bundle });
  } catch (err: any) {
    console.error("[PUBLIC_MEHENDI_REVIEWS_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load reviews." },
      { status: 500 }
    );
  }
}

