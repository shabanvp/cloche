import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import {
  getMehendiCustomizeStore,
  saveMehendiCustomizeStore,
} from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const data = await getMehendiCustomizeStore(context.vendorId);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("[MEHENDI_CUSTOMIZE_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load store customization." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    await saveMehendiCustomizeStore(context.vendorId, context.userId, body);

    try {
      revalidatePath("/mehendi-artists");
      revalidatePath(`/mehendi-artists/${context.slug}`);
      revalidatePath(`/mehendi-artists/${context.vendorId}`);
    } catch {}

    const updated = await getMehendiCustomizeStore(context.vendorId);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("[MEHENDI_CUSTOMIZE_PUT]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save store customization." },
      { status: 400 }
    );
  }
}

