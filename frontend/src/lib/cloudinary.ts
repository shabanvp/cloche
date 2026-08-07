export interface CloudinaryUploadResult {
  secure_url: string;
  public_id?: string;
  width?: number;
  height?: number;
  format?: string;
}

/**
 * Utility to upload image files directly to Cloudinary from the client side.
 * Returns the secure Cloudinary HTTPS URL.
 */
export async function uploadImageToCloudinary(file: File | string, folder = "cloche/uploads"): Promise<string> {
  const result = await uploadImageToCloudinaryDetailed(file, folder);
  return result.secure_url;
}

/**
 * Detailed uploader returning secure_url, public_id, and dimensions.
 */
export async function uploadImageToCloudinaryDetailed(
  file: File | string,
  folder = "cloche/uploads"
): Promise<CloudinaryUploadResult> {
  if (typeof file === "string") {
    if (file.startsWith("http://") || file.startsWith("https://")) {
      return { secure_url: file };
    }
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dycwsnzyd";
  const presets = [
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "cloche_uploads",
    "cloche_uploads",
    "ml_default",
    "unsigned_preset",
    "cloche",
    "cloche_preset",
  ];

  for (const preset of presets) {
    if (!preset) continue;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);
      formData.append("folder", folder);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.secure_url) {
          console.log("[Cloudinary] Uploaded image successfully:", data.secure_url);
          return {
            secure_url: data.secure_url,
            public_id: data.public_id,
            width: data.width,
            height: data.height,
            format: data.format,
          };
        }
      }
    } catch (err) {
      console.warn(`[Cloudinary] Unsigned upload preset '${preset}' attempt failed:`, err);
    }
  }

  if (typeof file === "string") {
    return { secure_url: file };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ secure_url: (e.target?.result as string) || "" });
    reader.readAsDataURL(file);
  });
}

/**
 * Deletes an image from Cloudinary by its public_id via backend upload endpoint.
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  if (!publicId) return true;
  try {
    const res = await fetch(`/api/upload?public_id=${encodeURIComponent(publicId)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (e) {
    console.error("[Cloudinary] Delete image failed:", e);
    return false;
  }
}
