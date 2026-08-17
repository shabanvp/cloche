import { NextResponse } from "next/server";
import { getStoryBySlug } from "@/lib/realWeddings";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
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

    const story = await getStoryBySlug(slug);
    if (!story || story.status !== "published") {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Wedding story not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      story,
    });
  } catch (err: any) {
    console.error("[GET /api/v1/public/real-weddings/[slug]] Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: err?.message || "Failed to fetch wedding story" },
      },
      { status: 500 }
    );
  }
}
