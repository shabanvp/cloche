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

    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("upload_preset", uploadPreset);
    cloudFormData.append("folder", "cloche/makeup");

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

    // Fallback: Convert to Base64 Data URL if Cloudinary fails or is unconfigured
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Url = `data:${file.type};base64,${buffer.toString("base64")}`;

    return NextResponse.json({
      success: true,
      url: base64Url,
      note: "Local base64 fallback",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to upload image." }, { status: 500 });
  }
}
