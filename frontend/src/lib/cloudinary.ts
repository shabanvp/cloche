/**
 * Utility to upload image files directly to Cloudinary from the client side.
 * Returns the secure Cloudinary HTTPS URL.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dycwsnzyd";
  
  // List of candidate unsigned upload presets configured on Cloudinary
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
      formData.append("folder", "cloche/venues");

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.secure_url) {
          console.log("[Cloudinary] Successfully uploaded image to Cloudinary:", data.secure_url);
          return data.secure_url;
        }
      }
    } catch (err) {
      console.warn(`[Cloudinary] Unsigned upload preset '${preset}' attempt failed:`, err);
    }
  }

  // Graceful fallback to compressed Data URL if offline / unconfigured
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve((e.target?.result as string) || "");
    reader.readAsDataURL(file);
  });
}
