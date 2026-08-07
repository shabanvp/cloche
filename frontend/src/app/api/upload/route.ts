import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    // Cloudinary Unsigned Upload
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dycwsnzyd";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "cloche_uploads";
    const folder = (formData.get("folder") as string) || "cloche/makeup";

    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("upload_preset", uploadPreset);
    cloudFormData.append("folder", folder);

    const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: cloudFormData,
    });

    if (cloudRes.ok) {
      const cloudData = await cloudRes.json();
      return NextResponse.json({
        success: true,
        url: cloudData.secure_url,
        public_id: cloudData.public_id,
      });
    }

    const errorText = await cloudRes.text();
    return NextResponse.json(
      { success: false, error: errorText || "Cloudinary upload failed." },
      { status: 502 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
