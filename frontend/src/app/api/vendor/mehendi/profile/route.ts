import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import {
  getMehendiProfile,
  saveMehendiProfile,
  setMehendiPublicationStatus,
} from "@/lib/mehendiData";

function revalidateMehendiStorefront(slug?: string | null, vendorId?: string | null) {
  try {
    revalidatePath("/mehendi-artists");
    if (slug) {
      revalidatePath(`/mehendi-artists/${slug}`);
      revalidatePath(`/mehendi-artists/${slug}/gallery`);
      revalidatePath(`/vendors/mehendi/${slug}`);
    }
    if (vendorId) {
      revalidatePath(`/mehendi-artists/${vendorId}`);
      revalidatePath(`/mehendi-artists/${vendorId}/gallery`);
      revalidatePath(`/vendors/mehendi/${vendorId}`);
    }
  } catch {
    // Non-fatal
  }
}

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const profile = await getMehendiProfile(context.vendorId, context);
    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    console.error("[MEHENDI_PROFILE_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load Mehendi profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const result = await saveMehendiProfile(context, body);
    revalidateMehendiStorefront(result.profile.slug, context.vendorId);
    return NextResponse.json({
      success: true,
      data: result.profile,
      profileCompletion: result.completion,
    });
  } catch (err: any) {
    console.error("[MEHENDI_PROFILE_PUT]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save Mehendi profile." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const status = body?.publicationStatus === "draft" ? "draft" : "published";
    await setMehendiPublicationStatus(context.vendorId, status, context.userId);
    const profile = await getMehendiProfile(context.vendorId, context);
    revalidateMehendiStorefront(profile.slug, context.vendorId);
    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    console.error("[MEHENDI_PROFILE_PATCH]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update Mehendi publication status." },
      { status: 400 }
    );
  }
}

