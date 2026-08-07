import { NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs";

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const signaturePayload = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${signaturePayload}${apiSecret}`).digest("hex");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dycwsnzyd";
    const apiKey = process.env.CLOUDINARY_API_KEY || "";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "cloche_upload";
    const folder = (formData.get("folder") as string) || process.env.CLOUDINARY_FOLDER || "cloche";
    const useSignedUpload = process.env.CLOUDINARY_SIGNED_UPLOAD === "true";

    const cloudFormData = new FormData();
    cloudFormData.append("file", file);
    cloudFormData.append("folder", folder);

    if (useSignedUpload && apiKey && apiSecret) {
      const timestamp = Math.round(Date.now() / 1000).toString();
      const paramsToSign = { folder, timestamp };

      cloudFormData.append("api_key", apiKey);
      cloudFormData.append("timestamp", timestamp);
      cloudFormData.append("signature", signCloudinaryParams(paramsToSign, apiSecret));
    } else {
      cloudFormData.append("upload_preset", uploadPreset);
    }

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
    console.error("[Upload API] Cloudinary upload failed:", err);
    const message = err instanceof Error ? err.message : "Failed to upload image.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
