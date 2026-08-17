import { NextResponse } from "next/server";
import { updateAdminStoryStatus, deleteAdminStory } from "@/lib/realWeddings";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Story ID is required" } },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, rejection_reason, is_featured, is_trending } = body;

    const updated = await updateAdminStoryStatus(id, {
      status,
      rejection_reason,
      is_featured,
      is_trending,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Story not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Story status updated to ${updated.status}`,
      story: updated,
    });
  } catch (err: any) {
    console.error("[PATCH /api/v1/admin/real-weddings/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err?.message || "Failed to update story" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: { code: "BAD_REQUEST", message: "Story ID is required" } },
        { status: 400 }
      );
    }

    const ok = await deleteAdminStory(id);
    if (!ok) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Story not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (err: any) {
    console.error("[DELETE /api/v1/admin/real-weddings/[id]] Error:", err);
    return NextResponse.json(
      { success: false, error: { code: "SERVER_ERROR", message: err?.message || "Failed to delete story" } },
      { status: 500 }
    );
  }
}
