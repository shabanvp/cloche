import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import { getMehendiAnalytics } from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const range = (searchParams.get("range") || "30d") as "7d" | "30d" | "90d";
    const analytics = await getMehendiAnalytics(context.vendorId, range);
    return NextResponse.json({ success: true, data: analytics });
  } catch (err: any) {
    console.error("[MEHENDI_ANALYTICS_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load analytics." },
      { status: 500 }
    );
  }
}

