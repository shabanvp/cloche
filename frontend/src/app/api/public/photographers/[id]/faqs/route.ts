import { NextResponse } from "next/server";
import {
  listPhotographerFaqs,
  resolvePhotographerVendorByIdentifier,
  submitCustomerQuestionPublic,
} from "@/lib/photographerData";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vendor = await resolvePhotographerVendorByIdentifier(decodeURIComponent(id));
  if (!vendor) {
    return NextResponse.json({ error: "Photographer not found." }, { status: 404 });
  }

  const data = await listPhotographerFaqs(vendor.id);
  return NextResponse.json({
    success: true,
    data: data.photographerFaqs.filter((f) => f.isPublished),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vendor = await resolvePhotographerVendorByIdentifier(decodeURIComponent(id));
  if (!vendor) {
    return NextResponse.json({ error: "Photographer not found." }, { status: 404 });
  }

  try {
    const body = await req.json();
    const record = await submitCustomerQuestionPublic(vendor.id, {
      customerName: String(body?.customerName || body?.name || "Wedding Client"),
      customerEmail: String(body?.customerEmail || body?.email || ""),
      question: String(body?.question || ""),
    });
    return NextResponse.json(
      {
        success: true,
        data: record,
        message: "Your question has been sent to the photographer for review.",
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to submit question." },
      { status: 400 }
    );
  }
}
