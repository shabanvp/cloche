import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import { listMehendiReviews, replyToMehendiReview } from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const reviews = await listMehendiReviews(context.vendorId);
    return NextResponse.json({ success: true, data: reviews });
  } catch (err: any) {
    console.error("[MEHENDI_REVIEWS_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load reviews." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const { reviewId, replyText } = body;
    if (!reviewId || !replyText) {
      return NextResponse.json(
        { error: "Review ID and reply text are required." },
        { status: 400 }
      );
    }
    await replyToMehendiReview(context.vendorId, context.userId, reviewId, replyText);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_REVIEWS_POST]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to post reply." },
      { status: 400 }
    );
  }
}

