import { NextResponse } from "next/server";
import { getPublishedStories } from "@/lib/realWeddings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const style = searchParams.get("style") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = (searchParams.get("sortBy") as "newest" | "popular" | "views") || "newest";
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const offset = Math.max(0, parseInt(searchParams.get("offset") || "0", 10));

    const { stories, total } = await getPublishedStories({
      style,
      search,
      sortBy,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      stories,
      total,
      limit,
      offset,
    });
  } catch (err: any) {
    console.error("[GET /api/v1/public/real-weddings] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: err?.message || "Failed to fetch real wedding stories",
        },
      },
      { status: 500 }
    );
  }
}
