/**
/**
 * CLOCHE WEDDING PLATFORM - PRODUCTION AUTHENTICATION & CRYPTOGRAPHY UTILS
 * File: frontend/src/lib/auth.ts
 * 
 * Implements PBKDF2 password hashing, JWT session token signing/verification,
 * and HTTP-Only cookie management using Node.js native crypto APIs.
 */

import crypto from "crypto";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_AUTH_SECRET || "cloche_master_jwt_secret_key_2026_super_secure_key_84920";
const AUTH_COOKIE_NAME = "cloche_auth_token";
const SESSION_EXPIRY_DAYS = 30;

export interface TokenPayload {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
  iat: number;
  exp: number;
}

/**
 * Hash password using PBKDF2 with 100,000 iterations and 64-byte salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify a plain-text password against a stored hash (PBKDF2 or Bcrypt)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || typeof storedHash !== "string") return false;

  // 1. Support legacy Bcrypt hashes ($2a$, $2b$, $2y$)
  if (storedHash.startsWith("$2a$") || storedHash.startsWith("$2b$") || storedHash.startsWith("$2y$")) {
    try {
      return bcrypt.compareSync(password, storedHash);
    } catch (e) {
      return false;
    }
  }

  // 2. Support PBKDF2 (salt:hash)
  if (storedHash.includes(":")) {
    try {
      const [salt, originalHash] = storedHash.split(":");
      const hashToVerify = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
      return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(hashToVerify, "hex"));
    } catch (e) {
      return false;
    }
  }

  return false;
}

/**
 * Sign JWT Token using HMAC-SHA256
 */
export function signJwtToken(payload: Omit<TokenPayload, "iat" | "exp">, expiresInDays = SESSION_EXPIRY_DAYS): string {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInDays * 24 * 60 * 60;
  
  const fullPayload: TokenPayload = { ...payload, iat, exp };
  
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  
  const signatureInput = `${header}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest("base64url");
  
  return `${signatureInput}.${signature}`;
}

/**
 * Verify & Decode JWT Token
 */
export function verifyJwtToken(token: string): TokenPayload | null {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  
  const [header, payload, signature] = parts;
  const signatureInput = `${header}.${payload}`;
  const expectedSignature = crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest("base64url");
  
  if (signature !== expectedSignature) {
    return null;
  }
  
  try {
    const decoded: TokenPayload = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      return null; // Expired token
    }
    return decoded;
  } catch (err) {
    return null;
  }
}

/**
 * Generate SHA-256 Hash of session token for DB lookup
 */
export function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export { AUTH_COOKIE_NAME, SESSION_EXPIRY_DAYS };
