import { NextResponse } from "next/server";
import { requireAuthenticatedPhotographer } from "@/lib/photographerAuth";
import { uploadPhotographerMediaFile } from "@/lib/photographerData";

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const kindRaw = String(formData.get("kind") || "gallery").toLowerCase();
    const kind = (
      ["logo", "cover", "gallery", "service", "package", "album"].includes(kindRaw)
        ? kindRaw
        : "gallery"
    ) as "logo" | "cover" | "gallery" | "service" | "package" | "album";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Please attach an image file." }, { status: 400 });
    }

    const uploaded = await uploadPhotographerMediaFile(
      context.vendorId,
      context.userId,
      file,
      kind
    );
    return NextResponse.json({ success: true, data: uploaded }, { status: 201 });
  } catch (err: any) {
    console.error("[PHOTOGRAPHER_UPLOAD_POST]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to upload image." },
      { status: 400 }
    );
  }
}

