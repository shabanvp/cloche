import { NextResponse } from "next/server";
import { toggleStoryLike } from "@/lib/realWeddings";

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

    const body = await req.json().catch(() => ({}));
    const increment = body.increment !== false;

    const likeCount = await toggleStoryLike(slug, increment);
    return NextResponse.json({
      success: true,
      like_count: likeCount,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVER_ERROR", message: err?.message || "Failed to toggle like" },
      },
      { status: 500 }
    );
  }
}
