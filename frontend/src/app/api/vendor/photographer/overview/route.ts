import { NextResponse } from "next/server";
import { requireAuthenticatedPhotographer } from "@/lib/photographerAuth";
import { getPhotographerOverviewData } from "@/lib/photographerData";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const overview = await getPhotographerOverviewData(context);
    return NextResponse.json({ success: true, data: overview });
  } catch (err: any) {
    console.error("[PHOTOGRAPHER_OVERVIEW_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load photographer overview." },
      { status: 500 }
    );
  }
}

