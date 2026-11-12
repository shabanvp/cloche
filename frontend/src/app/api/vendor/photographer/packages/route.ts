import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  requireAuthenticatedPhotographer,
  verifyVendorOwnedRow,
} from "@/lib/photographerAuth";
import {
  createPhotographerPackage,
  deletePhotographerPackage,
  listPhotographerPackages,
  updatePhotographerPackage,
} from "@/lib/photographerData";

function revalidateStorefront(slug: string, vendorId: string) {
  try {
    revalidatePath("/photographers");
    revalidatePath(`/photographers/${slug}`);
    revalidatePath(`/photographers/${vendorId}`);
  } catch {
    // non-fatal
  }
}

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const packages = await listPhotographerPackages(context.vendorId);
    return NextResponse.json({ success: true, data: packages });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load photography packages." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const created = await createPhotographerPackage(context.vendorId, context.userId, body);
    revalidateStorefront(context.slug, context.vendorId);
    const packages = await listPhotographerPackages(context.vendorId);
    return NextResponse.json({ success: true, created, data: packages }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to create package." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const id = String(body?.id || "");
    if (!id) {
      return NextResponse.json({ error: "Package id is required." }, { status: 400 });
    }

    const owned = await verifyVendorOwnedRow(
      "vendor_service_packages",
      id,
      context.vendorId,
      "deleted_at=is.null"
    );
    if (!owned) {
      return NextResponse.json({ error: "Forbidden: Package not found for this vendor." }, { status: 403 });
    }

    await updatePhotographerPackage(context.vendorId, context.userId, id, body);
    revalidateStorefront(context.slug, context.vendorId);
    const packages = await listPhotographerPackages(context.vendorId);
    return NextResponse.json({ success: true, data: packages });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update package." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const id = searchParams.get("id") || String(body?.id || "");
    if (!id) {
      return NextResponse.json({ error: "Package id is required." }, { status: 400 });
    }

    const owned = await verifyVendorOwnedRow(
      "vendor_service_packages",
      id,
      context.vendorId,
      "deleted_at=is.null"
    );
    if (!owned) {
      return NextResponse.json({ error: "Forbidden: Package not found for this vendor." }, { status: 403 });
    }

    await deletePhotographerPackage(context.vendorId, context.userId, id);
    revalidateStorefront(context.slug, context.vendorId);
    const packages = await listPhotographerPackages(context.vendorId);
    return NextResponse.json({ success: true, data: packages });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete package." },
      { status: 400 }
    );
  }
}

