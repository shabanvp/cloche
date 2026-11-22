import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAuthenticatedPhotographer } from "@/lib/photographerAuth";
import {
  getPhotographerProfile,
  savePhotographerProfile,
  setPhotographerPublicationStatus,
} from "@/lib/photographerData";

function revalidateStorefront(slug?: string | null, vendorId?: string | null) {
  try {
    revalidatePath("/photographers");
    if (slug) {
      revalidatePath(`/photographers/${slug}`);
      revalidatePath(`/photographers/${slug}/gallery`);
    }
    if (vendorId) {
      revalidatePath(`/photographers/${vendorId}`);
      revalidatePath(`/photographers/${vendorId}/gallery`);
    }
  } catch {
    // non-fatal
  }
}

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const profile = await getPhotographerProfile(context.vendorId, context);
    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    console.error("[PHOTOGRAPHER_PROFILE_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load photographer business profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const result = await savePhotographerProfile(context, body);
    revalidateStorefront(result.profile.slug, context.vendorId);
    return NextResponse.json({
      success: true,
      data: result.profile,
      profileCompletion: result.completion,
    });
  } catch (err: any) {
    console.error("[PHOTOGRAPHER_PROFILE_PUT]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to save photographer business profile." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const status = body?.publicationStatus === "draft" ? "draft" : "published";
    await setPhotographerPublicationStatus(context.vendorId, status, context.userId);
    const profile = await getPhotographerProfile(context.vendorId, context);
    revalidateStorefront(profile.slug, context.vendorId);
    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    console.error("[PHOTOGRAPHER_PROFILE_PATCH]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update profile visibility." },
      { status: 400 }
    );
  }
}

