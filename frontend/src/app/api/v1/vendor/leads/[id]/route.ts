import { NextResponse } from "next/server";
import { updateLeadStatusInDb, saveLeadActivityToDb, supabaseFetch } from "@/lib/supabase";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseFetch(
      `leads?id=eq.${encodeURIComponent(id)}&select=*,lead_notes(*),lead_tasks(*),lead_activities(*),quotations(*)`
    );

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Lead not found." } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, data: data[0] },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Status parameter is required." } },
        { status: 400 }
      );
    }

    const { data, error } = await updateLeadStatusInDb(id, status);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "UPDATE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    // Automatically log activity in audit timeline
    await saveLeadActivityToDb(id, "status_changed", `Lead status updated to '${status}'${note ? `: ${note}` : ""}`);

    return NextResponse.json(
      { success: true, statusCode: 200, message: `Lead status updated to ${status}`, data },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
