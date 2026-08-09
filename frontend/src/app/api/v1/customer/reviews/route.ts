import { NextResponse } from "next/server";
import {
  fetchCustomerReviewsFromDb,
  saveCustomerReviewInDb,
  deleteCustomerReviewInDb,
  fetchEligibleVendorsForReviewFromDb,
  supabaseFetch,
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
    let eligibleVendors = await fetchEligibleVendorsForReviewFromDb(authUser.userId);

    // If no specific inquiry/quote vendors found, allow reviewing any active vendor
    if (!eligibleVendors || eligibleVendors.length === 0) {
      const allVendorsRes = await supabaseFetch(
        "vendors?status=eq.active&deleted_at=is.null&select=id,vendor_code,vendor_profiles(business_name,city),vendor_categories(name)&limit=50"
      );
      if (allVendorsRes.data && Array.isArray(allVendorsRes.data)) {
        eligibleVendors = allVendorsRes.data.map((v: any) => ({
          id: v.id,
          name: v.vendor_profiles?.business_name || v.vendor_code,
          category: v.vendor_categories?.name || "Vendor",
          city: v.vendor_profiles?.city || "Kerala",
        }));
      }
    }

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
    const { vendor_id, rating, review, title } = body;

    if (!vendor_id || rating === undefined || rating === null || !review) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Vendor ID, rating, and review comments are required." } },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5 || !Number.isInteger(ratingNum)) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Rating must be an integer between 1 and 5." } },
        { status: 400 }
      );
    }

    const reviewPayload = {
      customer_id: authUser.userId,
      vendor_id,
      rating: ratingNum,
      title: title ? String(title).trim() : "",
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
