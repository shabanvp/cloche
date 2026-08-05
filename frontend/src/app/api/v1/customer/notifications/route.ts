import { NextResponse } from "next/server";
import {
  fetchCustomerNotificationsFromDb,
  markCustomerNotificationReadInDb,
  markAllCustomerNotificationsReadInDb,
  deleteCustomerNotificationInDb,
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

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "all";
    const limit = Number(searchParams.get("limit")) || 20;
    const offset = Number(searchParams.get("offset")) || 0;

    const { data, error } = await fetchCustomerNotificationsFromDb(authUser.userId, category, limit, offset);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "FETCH_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: data || [], pagination: { limit, offset } },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { notification_id, mark_all } = body;

    if (mark_all) {
      await markAllCustomerNotificationsReadInDb(authUser.userId);
      return NextResponse.json(
        { success: true, statusCode: 200, message: "All notifications marked as read." },
        { status: 200 }
      );
    }

    if (!notification_id) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Notification ID required." } },
        { status: 400 }
      );
    }

    await markCustomerNotificationReadInDb(notification_id, authUser.userId);

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Notification marked as read." },
      { status: 200 }
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
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Notification ID required." } },
        { status: 400 }
      );
    }

    await deleteCustomerNotificationInDb(notificationId, authUser.userId);

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Notification deleted." },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
