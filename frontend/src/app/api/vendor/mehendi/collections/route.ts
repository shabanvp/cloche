import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import {
  createMehendiCollection,
  deleteMehendiCollection,
  listMehendiCollections,
  updateMehendiCollection,
} from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const collections = await listMehendiCollections(context.vendorId);
    return NextResponse.json({ success: true, data: collections });
  } catch (err: any) {
    console.error("[MEHENDI_COLLECTIONS_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load collections." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const collection = await createMehendiCollection(context.vendorId, context.userId, body);
    return NextResponse.json({ success: true, data: collection }, { status: 201 });
  } catch (err: any) {
    console.error("[MEHENDI_COLLECTIONS_POST]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create collection." },
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
      return NextResponse.json({ error: "Collection ID is required." }, { status: 400 });
    }
    await updateMehendiCollection(context.vendorId, context.userId, id, patch);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_COLLECTIONS_PUT]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update collection." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("id");
    if (!collectionId) {
      return NextResponse.json({ error: "Collection ID is required." }, { status: 400 });
    }
    await deleteMehendiCollection(context.vendorId, collectionId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_COLLECTIONS_DELETE]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete collection." },
      { status: 400 }
    );
  }
}

