import { NextResponse } from "next/server";
import {
  fetchCustomerFavoritesFromDb,
  fetchRecentlyViewedFromDb,
  fetchCustomerNotificationsFromDb,
  fetchCustomerReviewsFromDb,
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

    const customerId = authUser.userId;

    // Fetch favorites
    const { data: favorites } = await fetchCustomerFavoritesFromDb(customerId);
    // Fetch recently viewed (deduplicated)
    const { data: recentlyViewed } = await fetchRecentlyViewedFromDb(customerId);
    // Fetch notifications
    const { data: notifications } = await fetchCustomerNotificationsFromDb(customerId);
    // Fetch reviews
    const { data: reviews } = await fetchCustomerReviewsFromDb(customerId);

    // Fetch submitted inquiries
    const { data: inquiries } = await supabaseFetch(
      `leads?customer_id=eq.${encodeURIComponent(customerId)}&deleted_at=is.null&order=created_at.desc&select=*,vendors(*)`
    );

    // Fetch received quotations
    const { data: quotations } = await supabaseFetch(
      `quotations?select=*,quotation_items(*),leads!inner(customer_id)&leads.customer_id=eq.${encodeURIComponent(customerId)}&order=created_at.desc`
    );

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          kpis: {
            savedVendorsCount: (favorites || []).length,
            submittedInquiriesCount: (inquiries || []).length,
            quotationsReceivedCount: (quotations || []).length,
            unreadNotificationsCount: (notifications || []).filter((n: any) => !n.is_read).length,
          },
          user: authUser,
          favorites: favorites || [],
          recentlyViewed: recentlyViewed || [],
          inquiries: inquiries || [],
          quotations: quotations || [],
          notifications: notifications || [],
          reviews: reviews || [],
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
