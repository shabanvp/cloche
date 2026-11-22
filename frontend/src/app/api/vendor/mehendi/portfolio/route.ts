import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import {
  createMehendiPortfolioDesign,
  deleteMehendiPortfolioDesign,
  listMehendiPortfolio,
  updateMehendiPortfolioDesign,
} from "@/lib/mehendiData";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const portfolio = await listMehendiPortfolio(context.vendorId);
    return NextResponse.json({ success: true, data: portfolio });
  } catch (err: any) {
    console.error("[MEHENDI_PORTFOLIO_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load portfolio." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const design = await createMehendiPortfolioDesign(context.vendorId, context.userId, body);
    return NextResponse.json({ success: true, data: design }, { status: 201 });
  } catch (err: any) {
    console.error("[MEHENDI_PORTFOLIO_POST]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create portfolio design." },
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
      return NextResponse.json({ error: "Design ID is required." }, { status: 400 });
    }
    await updateMehendiPortfolioDesign(context.vendorId, context.userId, id, patch);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_PORTFOLIO_PUT]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update portfolio design." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const designId = searchParams.get("id");
    if (!designId) {
      return NextResponse.json({ error: "Design ID is required." }, { status: 400 });
    }
    await deleteMehendiPortfolioDesign(context.vendorId, designId);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_PORTFOLIO_DELETE]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to delete portfolio design." },
      { status: 400 }
    );
  }
}

