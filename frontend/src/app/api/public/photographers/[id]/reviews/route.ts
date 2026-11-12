import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAuthenticatedUser } from "@/lib/rbac";
import { supabaseFetch } from "@/lib/supabase";
import {
  listPhotographerReviews,
  recalculateRatingAfterCustomerReview,
  resolvePhotographerVendorByIdentifier,
} from "@/lib/photographerData";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vendor = await resolvePhotographerVendorByIdentifier(decodeURIComponent(id));
  if (!vendor) {
    return NextResponse.json({ error: "Photographer not found." }, { status: 404 });
  }

  const data = await listPhotographerReviews(vendor.id);
  return NextResponse.json({ success: true, data });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = getAuthenticatedUser(req as any);
  const customerId = auth?.userId || auth?.id;

  if (!auth || !customerId) {
    return NextResponse.json(
      { error: "Please log in to submit a review." },
      { status: 401 }
    );
  }

  const vendor = await resolvePhotographerVendorByIdentifier(decodeURIComponent(id));
  if (!vendor) {
    return NextResponse.json({ error: "Photographer not found." }, { status: 404 });
  }

  if (vendor.user_id === customerId) {
    return NextResponse.json(
      { error: "Photographers cannot submit reviews on their own listing." },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const rating = Number(body?.rating);
    const title = String(body?.title || "").trim();
    const reviewText = String(body?.reviewText || body?.review || "").trim();

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Please select a rating between 1 and 5 stars." },
        { status: 400 }
      );
    }
    if (reviewText.length < 10) {
      return NextResponse.json(
        { error: "Review text must be at least 10 characters." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseFetch<any[]>(
      `reviews?vendor_id=eq.${encodeURIComponent(vendor.id)}&customer_id=eq.${encodeURIComponent(customerId)}&select=id&limit=1`
    );
    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "You have already submitted a review for this photographer." },
        { status: 409 }
      );
    }

    const { data: bookingRows } = await supabaseFetch<any[]>(
      `bookings?vendor_id=eq.${encodeURIComponent(vendor.id)}&customer_id=eq.${encodeURIComponent(customerId)}&select=id&limit=1`
    );
    const bookingId =
      Array.isArray(bookingRows) && bookingRows[0]?.id ? bookingRows[0].id : null;

    const { data: inserted, error } = await supabaseFetch<any[]>("reviews", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        vendor_id: vendor.id,
        customer_id: customerId,
        booking_id: bookingId,
        rating,
        title: title || null,
        review_text: reviewText,
        status: "published",
      }),
    });

    if (error || !Array.isArray(inserted) || !inserted[0]?.id) {
      throw new Error(error?.message || "Could not submit review.");
    }

    await recalculateRatingAfterCustomerReview(vendor.id);

    try {
      revalidatePath("/photographers");
      revalidatePath(`/photographers/${vendor.id}`);
      revalidatePath(`/photographers/${id}`);
    } catch {
      // non-fatal
    }

    const updated = await listPhotographerReviews(vendor.id);
    return NextResponse.json({ success: true, data: updated }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to submit review." },
      { status: 400 }
    );
  }
}
