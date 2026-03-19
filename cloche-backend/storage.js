const path = require("path");
const crypto = require("crypto");
const supabase = require("./supabase");

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "cloche-assets";

const sanitizeSegment = (value) =>
  String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "file";

const sanitizeFolder = (value) =>
  String(value || "")
    .split("/")
    .map((segment) => sanitizeSegment(segment))
    .filter(Boolean)
    .join("/");

const buildStoragePath = ({ folder, originalName }) => {
  const ext = path.extname(originalName || "").toLowerCase() || ".bin";
  const baseName = path.basename(originalName || "upload", ext);
  const unique = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const folderName = sanitizeFolder(folder);
  return `${folderName}/${sanitizeSegment(baseName)}-${unique}${ext}`;
};

const uploadBufferToStorage = async ({ folder, file }) => {
  if (!file?.buffer) throw new Error("File buffer missing");

  const objectPath = buildStoragePath({
    folder,
    originalName: file.originalname
  });

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(objectPath, file.buffer, {
      contentType: file.mimetype || "application/octet-stream",
      cacheControl: "3600",
      upsert: false
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Storage upload failed");
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(objectPath);
  return {
    bucket: STORAGE_BUCKET,
    objectPath,
    publicUrl: data?.publicUrl || ""
  };
};

const deleteStorageObjectByUrl = async (publicUrl) => {
  const raw = String(publicUrl || "").trim();
  if (!raw) return;

  try {
    const parsed = new URL(raw);
    const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
    const idx = parsed.pathname.indexOf(marker);
    if (idx === -1) return;

    const objectPath = decodeURIComponent(parsed.pathname.slice(idx + marker.length));
    if (!objectPath) return;

    await supabase.storage.from(STORAGE_BUCKET).remove([objectPath]);
  } catch (_) {
    // Ignore malformed or legacy URLs.
  }
};

module.exports = {
  STORAGE_BUCKET,
  deleteStorageObjectByUrl,
  uploadBufferToStorage
};
