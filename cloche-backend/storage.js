const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");
const CLOUDINARY_CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const CLOUDINARY_UPLOAD_PRESET = String(process.env.CLOUDINARY_UPLOAD_PRESET || "").trim();
const CLOUDINARY_API_KEY = String(process.env.CLOUDINARY_API_KEY || "").trim();
const CLOUDINARY_API_SECRET = String(process.env.CLOUDINARY_API_SECRET || "").trim();
const CLOUDINARY_FOLDER = String(process.env.CLOUDINARY_FOLDER || "cloche").trim();

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

const hasCloudinaryUpload = () => Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_UPLOAD_PRESET);

const hasCloudinaryDestroy = () =>
  Boolean(CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET);

const buildCloudinaryFolder = (folder) => [CLOUDINARY_FOLDER, sanitizeFolder(folder)].filter(Boolean).join("/");

const extractCloudinaryPublicId = (publicUrl) => {
  const raw = String(publicUrl || "").trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    if (!/cloudinary\.com$/i.test(parsed.hostname)) return "";
    const uploadMarker = "/image/upload/";
    const uploadIdx = parsed.pathname.indexOf(uploadMarker);
    if (uploadIdx === -1) return "";

    let assetPath = parsed.pathname.slice(uploadIdx + uploadMarker.length);
    assetPath = assetPath.replace(/^v\d+\//, "");
    assetPath = decodeURIComponent(assetPath);
    return assetPath.replace(/\.[^.\/]+$/, "");
  } catch (_) {
    return "";
  }
};

const uploadBufferToCloudinary = async ({ folder, file }) => {
  if (!file?.buffer) throw new Error("File buffer missing");

  const targetFolder = buildCloudinaryFolder(folder);

  const formData = new FormData();
  formData.append("file", file.buffer, {
    filename: file.originalname || "upload",
    contentType: file.mimetype || "application/octet-stream"
  });
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  if (targetFolder) formData.append("folder", targetFolder);

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    formData,
    {
      headers: formData.getHeaders()
    }
  );

  const result = response?.data || {};
  if (!result?.secure_url) {
    throw new Error(result?.error?.message || "Cloudinary upload failed");
  }

  return {
    bucket: "cloudinary",
    objectPath: result.public_id || "",
    publicUrl: result.secure_url
  };
};

const destroyCloudinaryAsset = async (publicUrl) => {
  if (!hasCloudinaryDestroy()) return;

  const publicId = extractCloudinaryPublicId(publicUrl);
  if (!publicId) return;

  const timestamp = Math.floor(Date.now() / 1000);
  const signatureBase = `public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
  const signature = crypto.createHash("sha1").update(signatureBase).digest("hex");

  const body = new URLSearchParams();
  body.set("public_id", publicId);
  body.set("timestamp", String(timestamp));
  body.set("api_key", CLOUDINARY_API_KEY);
  body.set("signature", signature);

  await axios
    .post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`, body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .catch(() => undefined);
};

const uploadBufferToStorage = async ({ folder, file }) => {
  if (!file?.buffer) throw new Error("File buffer missing");

  if (!hasCloudinaryUpload()) {
    throw new Error("Cloudinary upload is not configured");
  }

  return uploadBufferToCloudinary({ folder, file });
};

const deleteStorageObjectByUrl = async (publicUrl) => {
  const raw = String(publicUrl || "").trim();
  if (!raw) return;

  if (/cloudinary\.com/i.test(raw)) {
    await destroyCloudinaryAsset(raw);
  }
};

module.exports = {
  deleteStorageObjectByUrl,
  uploadBufferToStorage
};
