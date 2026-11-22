import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  requireAuthenticatedPhotographer,
  verifyVendorOwnedRow,
} from "@/lib/photographerAuth";
import {
  PHOTOGRAPHY_SERVICE_PRESETS,
  createPhotographerService,
  listPhotographerServices,
  softDeletePhotographerService,
  updatePhotographerService,
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
    const services = await listPhotographerServices(context.vendorId);
    return NextResponse.json({
      success: true,
      data: services,
      presets: PHOTOGRAPHY_SERVICE_PRESETS,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load photography services." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const created = await createPhotographerService(context.vendorId, body);
    revalidateStorefront(context.slug, context.vendorId);
    const services = await listPhotographerServices(context.vendorId);
    return NextResponse.json({ success: true, created, data: services }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to add service." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const serviceId = String(body?.id || "");
    if (!serviceId) {
      return NextResponse.json({ error: "Service id is required." }, { status: 400 });
    }

    const owned = await verifyVendorOwnedRow(
      "vendor_services",
      serviceId,
      context.vendorId,
      "deleted_at=is.null"
    );
    if (!owned) {
      return NextResponse.json({ error: "Forbidden: Service not found for this vendor." }, { status: 403 });
    }

    await updatePhotographerService(context.vendorId, serviceId, body);
    revalidateStorefront(context.slug, context.vendorId);
    const services = await listPhotographerServices(context.vendorId);
    return NextResponse.json({ success: true, data: services });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update service." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const { searchParams } = new URL(req.url);
    let serviceId = searchParams.get("id") || "";
    if (!serviceId) {
      const body = await req.json().catch(() => ({}));
      serviceId = String(body?.id || "");
    }
    if (!serviceId) {
      return NextResponse.json({ error: "Service id is required." }, { status: 400 });
    }

    const owned = await verifyVendorOwnedRow(
      "vendor_services",
      serviceId,
      context.vendorId,
      "deleted_at=is.null"
    );
    if (!owned) {
      return NextResponse.json({ error: "Forbidden: Service not found for this vendor." }, { status: 403 });
    }

    await softDeletePhotographerService(context.vendorId, serviceId);
    revalidateStorefront(context.slug, context.vendorId);
    const services = await listPhotographerServices(context.vendorId);
    return NextResponse.json({ success: true, data: services });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete service." },
      { status: 400 }
    );
  }
}

