import { NextResponse } from "next/server";
import { saveLeadNoteToDb, saveLeadActivityToDb } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsLead } from "@/lib/vendorAuth";

export async function POST(req: Request) {
  try {
    const auth = await requireAuthenticatedVendor(req);
    if (auth.response) return auth.response;
    const body = await req.json();
    const { lead_id, author_name, note_text } = body;

    if (!lead_id || !note_text) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Lead ID and note text are required." } },
        { status: 400 }
      );
    }

    if (!(await vendorOwnsLead(lead_id, auth.vendorId))) {
      return NextResponse.json(
        { success: false, statusCode: 404, error: { code: "NOT_FOUND", message: "Lead not found." } },
        { status: 404 }
      );
    }

    const { data, error } = await saveLeadNoteToDb({
      lead_id,
      author_name: author_name || "Vendor Staff",
      note_text: note_text.trim(),
    });

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "SAVE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    // Automatically log activity timeline
    await saveLeadActivityToDb(lead_id, "note_added", `Internal note added by ${author_name || "Vendor Staff"}`);

    return NextResponse.json(
      { success: true, statusCode: 201, message: "Note added successfully", data },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
