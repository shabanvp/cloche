import { NextResponse } from "next/server";
import { fetchCustomerReviewsFromDb, saveCustomerReviewInDb, supabaseFetch } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const customerId = searchParams.get("customer_id") || "c-demo-user";
    const { data, error } = await fetchCustomerReviewsFromDb(customerId);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: data || [] },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customer_id, vendor_id, rating, review } = body;

    if (!customer_id || !vendor_id || !rating || !review) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "All fields are required." } },
        { status: 400 }
      );
    }

    const { data, error } = await saveCustomerReviewInDb({
      customer_id,
      vendor_id,
      rating: Number(rating),
      review: review.trim(),
      status: "published",
    });

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 201, message: "Review published successfully!", data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Review ID required." } },
        { status: 400 }
      );
    }

    await supabaseFetch(`customer_review_drafts?id=eq.${encodeURIComponent(reviewId)}`, {
      method: "DELETE",
    });

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Review deleted successfully." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
