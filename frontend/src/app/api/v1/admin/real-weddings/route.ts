import { NextResponse } from "next/server";
import { getAdminSubmissions } from "@/lib/realWeddings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "all";
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

    const { stories, total } = await getAdminSubmissions({ status, limit, offset });

    return NextResponse.json({
      success: true,
      stories,
      total,
    });
  } catch (err: any) {
    console.error("[GET /api/v1/admin/real-weddings] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err?.message || "Failed to fetch submissions" } },
      { status: 500 }
    );
  }
}
