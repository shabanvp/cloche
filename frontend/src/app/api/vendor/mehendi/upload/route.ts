import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import { uploadMehendiMediaFile } from "@/lib/mehendiData";

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const kindRaw = String(formData.get("kind") || "portfolio").toLowerCase();
    const kind = (
      ["logo", "cover", "profile", "portfolio", "service", "collection"].includes(kindRaw)
        ? kindRaw
        : "portfolio"
    ) as "logo" | "cover" | "profile" | "portfolio" | "service" | "collection";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Please attach an image file." }, { status: 400 });
    }

    const uploaded = await uploadMehendiMediaFile(
      context.vendorId,
      context.userId,
      file,
      kind
    );
    return NextResponse.json({ success: true, data: uploaded }, { status: 201 });
  } catch (err: any) {
    console.error("[MEHENDI_UPLOAD_POST]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to upload image." },
      { status: 400 }
    );
  }
}

