import { NextResponse } from "next/server";
import {
  fetchCustomerReviewsFromDb,
  saveCustomerReviewInDb,
  deleteCustomerReviewInDb,
  fetchEligibleVendorsForReviewFromDb,
} from "@/lib/supabase";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const { data: reviews, error } = await fetchCustomerReviewsFromDb(authUser.userId);
    const eligibleVendors = await fetchEligibleVendorsForReviewFromDb(authUser.userId);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: reviews || [], eligibleVendors: eligibleVendors || [] },
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
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { vendor_id, rating, review } = body;

    if (!vendor_id || !rating || !review) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Vendor ID, rating, and review required." } },
        { status: 400 }
      );
    }

    const reviewPayload = {
      customer_id: authUser.userId,
      vendor_id,
      rating: Number(rating),
      review: String(review).trim(),
      status: "published",
    };

    const { data, error } = await saveCustomerReviewInDb(reviewPayload);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "REVIEW_FAILED", message: error.message } },
        { status: 400 }
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
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("id");

    if (!reviewId) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Review ID required." } },
        { status: 400 }
      );
    }

    await deleteCustomerReviewInDb(reviewId, authUser.userId);

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Review deleted." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
