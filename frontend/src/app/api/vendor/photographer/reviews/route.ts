import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedPhotographer } from "@/lib/photographerAuth";
import {
  listPhotographerReviews,
  replyToPhotographerReview,
  reportPhotographerReview,
} from "@/lib/photographerData";

function revalidateStorefront(slug: string, vendorId: string) {
  try {
    revalidatePath("/photographers");
    revalidatePath(`/photographers/${slug}`);
    revalidatePath(`/photographers/${vendorId}`);
  } catch {
    // non-fatal
  }
}

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const data = await listPhotographerReviews(context.vendorId);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load photographer reviews." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const action = String(body?.action || "reply").toLowerCase();
    const reviewId = String(body?.reviewId || "");

    if (!reviewId) {
      return NextResponse.json({ error: "reviewId is required." }, { status: 400 });
    }

    if (action === "report") {
      await reportPhotographerReview(
        context.vendorId,
        context.userId,
        reviewId,
        String(body?.reason || "Inappropriate or spam content"),
        String(body?.details || "")
      );
    } else if (action === "reply") {
      await replyToPhotographerReview(
        context.vendorId,
        reviewId,
        String(body?.replyText || "")
      );
      revalidateStorefront(context.slug, context.vendorId);
    } else {
      return NextResponse.json(
        { error: "Vendors cannot edit or delete genuine customer reviews." },
        { status: 403 }
      );
    }

    const data = await listPhotographerReviews(context.vendorId);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process review action." },
      { status: 400 }
    );
  }
}

// Explicitly forbid DELETE/PATCH on customer reviews
export async function DELETE() {
  return NextResponse.json(
    { error: "Forbidden: Genuine customer reviews cannot be deleted by vendors." },
    { status: 403 }
  );
}

