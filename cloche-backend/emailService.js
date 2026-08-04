/**
 * CLOCHE Email Service
 * Supports Gmail SMTP (Nodemailer / TLS) & Brevo Transactional Email API.
 */

const nodemailer = require("nodemailer");
const tls = require("tls");

const DEFAULT_BASE_URL = "https://cloche-backend.onrender.com";

const BACKEND_BASE_URL = String(
  process.env.BACKEND_BASE_URL ||
  process.env.RENDER_EXTERNAL_URL ||
  DEFAULT_BASE_URL
).trim().replace(/\/+$/, "");

const FRONTEND_BASE_URL = String(
  process.env.FRONTEND_BASE_URL ||
  process.env.PUBLIC_BASE_URL ||
  BACKEND_BASE_URL ||
  DEFAULT_BASE_URL
).trim().replace(/\/+$/, "");

const DEFAULT_SENDER_EMAIL = "cloche.luxury@gmail.com";

const GMAIL_USER = String(process.env.GMAIL_USER || process.env.SMTP_USER || DEFAULT_SENDER_EMAIL).trim();
const GMAIL_APP_PASSWORD = String(process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "").trim();
const SMTP_HOST = String(process.env.SMTP_HOST || "smtp.gmail.com").trim();
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;

const BREVO_API_KEY = String(process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || "").trim();
const BREVO_FROM_EMAIL = String(process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM || GMAIL_USER).trim();
const BREVO_FROM_NAME = String(process.env.BREVO_FROM_NAME || "Cloche Luxury").trim();

const hasSmtpSetup = !!(GMAIL_USER && GMAIL_APP_PASSWORD);
const hasBrevoSetup = !!(BREVO_API_KEY && BREVO_FROM_EMAIL);
const isSetup = hasSmtpSetup || hasBrevoSetup;

const USER_SAFE_EMAIL_ERROR = "Verification email delivery failed. Please check SMTP configuration or try resending.";

console.log(`[EmailService] Configuration Status: SMTP (${hasSmtpSetup ? "Active - " + GMAIL_USER : "Not Configured"}), Brevo API (${hasBrevoSetup ? "Active" : "Not Configured"})`);

const escapeHeader = (value) => String(value || "").replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (value) => String(value || "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const buildVerificationUrl = (token, type) => `${FRONTEND_BASE_URL}/verify-email?token=${encodeURIComponent(
  String(token || "")
)}&type=${encodeURIComponent(String(type || ""))}`;

const sendBrevoMessage = async ({ to, subject, html, fromName }) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": BREVO_API_KEY,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: fromName || BREVO_FROM_NAME,
        email: BREVO_FROM_EMAIL,
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Brevo API failed with status ${response.status}`;
    throw new Error(message);
  }

  return { success: true, messageId: data?.messageId || data?.id || null, method: "brevo-api" };
};

const sendSmtpMessage = async ({ to, subject, html, fromName }) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const info = await transporter.sendMail({
    from: `"${escapeHeader(fromName || "Cloche Luxury")}" <${GMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return { success: true, messageId: info.messageId, method: "smtp" };
};

const sendEmailMessage = async ({ to, subject, html, fromName }) => {
  if (!isSetup) {
    console.error("[EmailService] CRITICAL: Neither Gmail SMTP nor Brevo API is configured with valid credentials.");
    return { success: false, error: "SMTP_NOT_CONFIGURED", internalError: "No email provider credentials found." };
  }

  // Try SMTP first if available
  if (hasSmtpSetup) {
    try {
      console.log(`[EmailService] Sending email to ${to} via Nodemailer SMTP (${SMTP_HOST}:${SMTP_PORT})...`);
      const res = await sendSmtpMessage({ to, subject, html, fromName });
      console.log(`[EmailService] SUCCESS: Email delivered to ${to} via SMTP (Message-ID: ${res.messageId})`);
      return res;
    } catch (smtpErr) {
      console.error("[EmailService] SMTP Error:", smtpErr.message);
      if (!hasBrevoSetup) {
        return { success: false, error: smtpErr.message, internalError: smtpErr.message };
      }
      console.warn("[EmailService] Falling back to Brevo HTTP API...");
    }
  }

  // Fallback to Brevo
  if (hasBrevoSetup) {
    try {
      console.log(`[EmailService] Sending email to ${to} via Brevo API...`);
      const res = await sendBrevoMessage({ to, subject, html, fromName });
      console.log(`[EmailService] SUCCESS: Email delivered to ${to} via Brevo API (Message-ID: ${res.messageId})`);
      return res;
    } catch (brevoErr) {
      console.error("[EmailService] Brevo API Error:", brevoErr.message);
      return { success: false, error: brevoErr.message, internalError: brevoErr.message };
    }
  }

  return { success: false, error: USER_SAFE_EMAIL_ERROR };
};

// ===============================
// SEND VERIFICATION EMAIL
// ===============================
const sendVerificationEmail = async (email, name, token, type) => {
  const verificationUrl = buildVerificationUrl(token, type);
  const safeName = escapeHtml(name || "there");

  console.log(`[EmailService] Generating verification link for ${email}: ${verificationUrl} (Token: ${token})`);

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color:#0F4C45; font-family: Georgia, serif;">CLOCHE LUXURY</h2>
      <p>Hi <strong>${safeName}</strong>,</p>
      <p>Welcome to Cloche Luxury Wedding Marketplace.</p>
      <p>Please verify your email address to activate your vendor account and access your dashboard:</p>

      <div style="margin: 25px 0; text-align: center;">
        <a href="${verificationUrl}"
           style="background:#0F4C45; color:#ffffff; padding:14px 30px; text-decoration:none; border-radius:30px; font-weight:bold; font-size:13px; text-transform:uppercase; letter-spacing:1px; display:inline-block;">
          Verify Vendor Account
        </a>
      </div>

      <p style="font-size: 12px; color: #666; background: #fafa001a; padding: 10px; border-radius: 6px;">
        ⏰ <strong>Note:</strong> This verification link will expire in <strong>24 hours</strong>.
      </p>

      <p style="font-size: 11px; color: #888; word-break: break-all;">
        Or paste this URL into your browser: <br>${verificationUrl}
      </p>
    </div>
  `;

  const result = await sendEmailMessage({
    to: email,
    subject: "Verify Your Cloche Vendor Account",
    html: htmlBody,
    fromName: "Cloche Luxury"
  });

  return { ...result, verificationUrl };
};

// ===============================
// SEND PASSWORD RESET EMAIL
// ===============================
const sendPasswordResetEmail = async (email, name, token, type) => {
  const resetUrl = `${FRONTEND_BASE_URL}/reset-password?token=${encodeURIComponent(
    token
  )}&type=${encodeURIComponent(type)}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color:#0F4C45;">CLOCHE</h2>
      <p>Hi <strong>${name || "there"}</strong>,</p>
      <p>We received a request to reset your Cloche password.</p>

      <div style="margin:20px 0;">
        <a href="${resetUrl}"
           style="background:#0F4C45;color:#fff;padding:12px 25px;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
      </div>

      <p style="font-size:12px;color:#888;">
        This link expires in 24 hours. If you did not request this, you can ignore this email.
      </p>
    </div>
  `;

  const result = await sendEmailMessage({
    to: email,
    subject: "Reset Your Cloche Password",
    html: htmlBody
  });

  return result;
};

// ===============================
// DIAGNOSTICS
// ===============================
const getEmailServiceStatus = async () => {
  return {
    smtpConfigured: hasSmtpSetup,
    smtpUser: GMAIL_USER,
    smtpHost: SMTP_HOST,
    smtpPort: SMTP_PORT,
    hasBrevoApiKey: !!BREVO_API_KEY,
    brevoFromEmail: BREVO_FROM_EMAIL,
    backendUrl: BACKEND_BASE_URL,
    frontendUrl: FRONTEND_BASE_URL,
  };
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  getEmailServiceStatus,
  sendEmailMessage,
  isSetup,
};
