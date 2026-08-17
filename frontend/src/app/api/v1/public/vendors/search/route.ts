import { NextResponse } from "next/server";
import { searchRegisteredVendors } from "@/lib/realWeddings";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || searchParams.get("search") || "";

    const vendors = await searchRegisteredVendors(q);

    return NextResponse.json({
      success: true,
      vendors,
    });
  } catch (err: any) {
    console.error("[GET /api/v1/public/vendors/search] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: "Failed to search vendors" } },
      { status: 500 }
    );
  }
}
