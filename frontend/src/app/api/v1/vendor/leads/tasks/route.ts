import { NextResponse } from "next/server";
import { saveLeadTaskToDb, saveLeadActivityToDb } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lead_id, title, description, due_date, priority } = body;

    if (!lead_id || !title || !due_date) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Lead ID, task title, and due date are required." } },
        { status: 400 }
      );
    }

    const { data, error } = await saveLeadTaskToDb({
      lead_id,
      title: title.trim(),
      description: description ? description.trim() : null,
      due_date,
      priority: priority || "medium",
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    await saveLeadActivityToDb(lead_id, "task_created", `Task scheduled: '${title.trim()}' due on ${new Date(due_date).toLocaleDateString()}`);

    return NextResponse.json(
      { success: true, statusCode: 201, message: "Task created successfully", data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
