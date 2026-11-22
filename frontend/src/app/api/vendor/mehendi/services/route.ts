import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import {
  createMehendiService,
  deleteMehendiService,
  listMehendiServices,
  updateMehendiService,
} from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const services = await listMehendiServices(context.vendorId);
    return NextResponse.json({ success: true, data: services });
  } catch (err: any) {
    console.error("[MEHENDI_SERVICES_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load services." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const service = await createMehendiService(context.vendorId, body);
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (err: any) {
    console.error("[MEHENDI_SERVICES_POST]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create service." },
      { status: 400 }
    );
  }
}

export async function PUT(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const { id, ...patch } = body;
    if (!id) {
      return NextResponse.json({ error: "Service ID is required." }, { status: 400 });
    }
    await updateMehendiService(context.vendorId, id, patch);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_SERVICES_PUT]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update service." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("id");
    if (!serviceId) {
      return NextResponse.json({ error: "Service ID is required." }, { status: 400 });
    }
    await deleteMehendiService(context.vendorId, serviceId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_SERVICES_DELETE]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete service." },
      { status: 400 }
    );
  }
}

