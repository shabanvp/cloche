// cloche-backend/middleware/adminAuth.js
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-session-secure-token";

const getBearerToken = (req) => {
  const raw = String(req.headers.authorization || "").trim();
  if (!raw) return "";
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
};

const requireAdmin = (req, res, next) => {
  const token = getBearerToken(req) || String(req.headers["x-admin-token"] || "").trim();
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ success: false, message: "Unauthorized admin access" });
  }
  next();
};

module.exports = { requireAdmin, ADMIN_TOKEN };
