import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import {
  requireAuthenticatedPhotographer,
  verifyVendorOwnedRow,
} from "@/lib/photographerAuth";
import {
  CRM_LEAD_STAGES,
  listPhotographerLeads,
  updatePhotographerLeadStage,
} from "@/lib/photographerData";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const stageFilter = (searchParams.get("stage") || "").trim();
    const q = (searchParams.get("q") || "").trim().toLowerCase();

    let leads = await listPhotographerLeads(context.vendorId);

    if (stageFilter && stageFilter !== "All") {
      leads = leads.filter((l) => l.stage.toLowerCase() === stageFilter.toLowerCase());
    }
    if (q) {
      leads = leads.filter(
        (l) =>
          (l.customerName || "").toLowerCase().includes(q) ||
          (l.customerEmail || "").toLowerCase().includes(q) ||
          (l.customerPhone || "").toLowerCase().includes(q) ||
          (l.location || "").toLowerCase().includes(q) ||
          (l.eventType || "").toLowerCase().includes(q) ||
          (l.message || "").toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      data: leads,
      stages: CRM_LEAD_STAGES,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load photographer leads." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const leadId = String(body?.leadId || body?.id || "");
    if (!leadId) {
      return NextResponse.json({ error: "leadId is required." }, { status: 400 });
    }

    const owned = await verifyVendorOwnedRow("leads", leadId, context.vendorId, "deleted_at=is.null");
    if (!owned) {
      return NextResponse.json({ error: "Forbidden: Lead not found for this photographer." }, { status: 403 });
    }

    if (body?.stage) {
      await updatePhotographerLeadStage(context.vendorId, context.userId, leadId, body.stage);
    }

    if (typeof body?.note === "string" && body.note.trim()) {
      await supabaseFetch("lead_notes", {
        method: "POST",
        body: JSON.stringify({
          lead_id: leadId,
          author_id: context.userId,
          note_text: body.note.trim(),
        }),
      });
    }

    const leads = await listPhotographerLeads(context.vendorId);
    return NextResponse.json({ success: true, data: leads });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update lead." },
      { status: 400 }
    );
  }
}

