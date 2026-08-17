import { NextResponse } from "next/server";
import { incrementStoryViewCount } from "@/lib/realWeddings";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Slug is required" } },
        { status: 400 }
      );
    }

    const viewCount = await incrementStoryViewCount(slug);
    return NextResponse.json({
      success: true,
      view_count: viewCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: err?.message || "Failed to increment view count" },
      },
      { status: 500 }
    );
  }
}
