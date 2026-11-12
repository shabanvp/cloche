import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  requireAuthenticatedPhotographer,
  verifyVendorOwnedRow,
} from "@/lib/photographerAuth";
import {
  createPhotographerFaqItem,
  deletePhotographerFaqItem,
  listPhotographerFaqs,
  moderateCustomerQuestion,
  reorderPhotographerFaqs,
  updatePhotographerFaqItem,
} from "@/lib/photographerData";

function revalidateStorefront(slug: string, vendorId: string) {
  try {
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
    const data = await listPhotographerFaqs(context.vendorId);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load FAQs." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();

    if (body?.questionId && body?.action) {
      await moderateCustomerQuestion(
        context.vendorId,
        context.userId,
        String(body.questionId),
        body.action,
        body.answer
      );
      revalidateStorefront(context.slug, context.vendorId);
      const data = await listPhotographerFaqs(context.vendorId);
      return NextResponse.json({ success: true, data });
    }

    const created = await createPhotographerFaqItem(context.vendorId, context.userId, {
      question: String(body?.question || ""),
      answer: String(body?.answer || ""),
      isPublished: body?.isPublished !== false,
    });
    revalidateStorefront(context.slug, context.vendorId);
    const data = await listPhotographerFaqs(context.vendorId);
    return NextResponse.json({ success: true, created, data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to save FAQ." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();

    if (Array.isArray(body?.orderedIds)) {
      await reorderPhotographerFaqs(context.vendorId, body.orderedIds.map(String));
      revalidateStorefront(context.slug, context.vendorId);
      const data = await listPhotographerFaqs(context.vendorId);
      return NextResponse.json({ success: true, data });
    }

    if (body?.questionId && body?.action) {
      await moderateCustomerQuestion(
        context.vendorId,
        context.userId,
        String(body.questionId),
        body.action,
        body.answer
      );
      revalidateStorefront(context.slug, context.vendorId);
      const data = await listPhotographerFaqs(context.vendorId);
      return NextResponse.json({ success: true, data });
    }

    const id = String(body?.id || "");
    if (!id) {
      return NextResponse.json({ error: "FAQ id is required." }, { status: 400 });
    }

    const owned = await verifyVendorOwnedRow("vendor_faqs", id, context.vendorId);
    if (!owned) {
      return NextResponse.json({ error: "Forbidden: FAQ not found for this photographer." }, { status: 403 });
    }

    await updatePhotographerFaqItem(context.vendorId, context.userId, id, body);
    revalidateStorefront(context.slug, context.vendorId);
    const data = await listPhotographerFaqs(context.vendorId);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update FAQ." },
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
    const questionId = searchParams.get("questionId") || body?.questionId;
    const id = searchParams.get("id") || body?.id;

    if (questionId) {
      await moderateCustomerQuestion(context.vendorId, context.userId, String(questionId), "delete");
      revalidateStorefront(context.slug, context.vendorId);
      const data = await listPhotographerFaqs(context.vendorId);
      return NextResponse.json({ success: true, data });
    }

    if (!id) {
      return NextResponse.json({ error: "FAQ id is required." }, { status: 400 });
    }

    const owned = await verifyVendorOwnedRow("vendor_faqs", String(id), context.vendorId);
    if (!owned) {
      return NextResponse.json({ error: "Forbidden: FAQ not found." }, { status: 403 });
    }

    await deletePhotographerFaqItem(context.vendorId, context.userId, String(id));
    revalidateStorefront(context.slug, context.vendorId);
    const data = await listPhotographerFaqs(context.vendorId);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete FAQ." },
      { status: 400 }
    );
  }
}

