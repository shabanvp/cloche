const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "fallback_cloche_jwt_secret_key_2026";

/**
 * Middleware to verify JWT tokens
 * Expects header: Authorization: Bearer <token>
 */
const requireAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Unauthorized. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (err) {
        console.error("[Auth Middleware] Token error:", err.message);
        return res.status(401).json({ success: false, message: "Unauthorized. Invalid or expired token." });
    }
};

/**
 * Helper to generate JWT tokens
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

module.exports = {
    requireAuth,
    generateToken,
    JWT_SECRET
};
