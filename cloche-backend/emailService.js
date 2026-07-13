/**
 * CLOCHE Email Service
 * Uses Brevo's Transactional Email API over HTTPS.
 */

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

const BREVO_API_KEY = String(process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || "").trim();
const BREVO_FROM_EMAIL = String(process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM || "").trim();
const BREVO_FROM_NAME = String(process.env.BREVO_FROM_NAME || "Cloche Luxury").trim();

const hasBrevoSetup = !!(BREVO_API_KEY && BREVO_FROM_EMAIL);
const isSetup = hasBrevoSetup;
const USER_SAFE_EMAIL_ERROR = "We created your account, but couldn't send the verification email right now.";

console.log(`Email service configured: Brevo API=${hasBrevoSetup}`);

const escapeHeader = (value) => String(value || "").replace(/[\r\n]+/g, " ").trim();

const escapeHtml = (value) => String(value || "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const buildVerificationUrl = (token, type) => `${BACKEND_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(
  String(token || "")
)}&type=${encodeURIComponent(String(type || ""))}`;

const encodeMessage = (message) => Buffer
  .from(message, "utf8")
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

const createEmailMessage = (to, subject, html, fromName = "Cloche Luxury") => {
  const lines = [
    `From: "${escapeHeader(fromName)}" <${BREVO_FROM_EMAIL}>`,
    `To: ${escapeHeader(to)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${Math.random().toString(36).slice(2)}@cloche>`,
    "Content-Type: text/html; charset=UTF-8",
    "MIME-Version: 1.0",
    `Subject: ${escapeHeader(subject)}`,
    "",
    html
  ];

  return encodeMessage(lines.join("\r\n"));
};

const sendBrevoMessage = async ({ to, subject, html, fromName }) => {
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
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Brevo API failed with status ${response.status}`;
    throw new Error(message);
  }

  return { success: true, messageId: data?.messageId || data?.id || null, method: "brevo-api" };
};

const sendEmailMessage = async ({ to, subject, html, fromName }) => {
  if (!isSetup) {
    console.error("Email Error: Brevo API is not configured");
    return { success: false, error: USER_SAFE_EMAIL_ERROR, internalError: "Email provider is not configured" };
  }

  try {
    return await sendBrevoMessage({ to, subject, html, fromName });
  } catch (error) {
    console.error("[EmailService] Brevo API Error:", error.message);
    return { success: false, error: USER_SAFE_EMAIL_ERROR, internalError: error.message };
  }
};

// ===============================
// SEND VERIFICATION EMAIL
// ===============================
const sendVerificationEmail = async (email, name, token, type) => {
  const verificationUrl = buildVerificationUrl(token, type);
  const safeName = escapeHtml(name || "there");

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color:#c1a671;">CLOCHE</h2>
      <p>Hi <strong>${safeName}</strong>,</p>
      <p>Welcome to Cloche Luxury.</p>
      <p>Please verify your email to continue:</p>

      <div style="margin:20px 0;">
        <a href="${verificationUrl}"
           style="background:#c1a671;color:#fff;padding:12px 25px;text-decoration:none;border-radius:5px;">
          Verify Account
        </a>
      </div>

      <p style="font-size:12px;color:#888;">
        If you did not create this account, ignore this email.
      </p>
    </div>
  `;

  const result = await sendEmailMessage({
    to: email,
    subject: "Verify Your Cloche Account",
    html: htmlBody,
    fromName: "Cloche Luxury"
  });

  if (result.success) {
    console.log(`Verification email accepted for ${email} via ${result.method || "email provider"} (${result.messageId || "no-message-id"})`);
  } else {
    console.error(`Verification email failed for ${email}: ${result.error || "unknown email error"}`);
  }

  return { ...result, verificationUrl };
};

// ===============================
// SEND PASSWORD RESET EMAIL
// ===============================
const sendPasswordResetEmail = async (email, name, token, type) => {
  const resetUrl = `${FRONTEND_BASE_URL}/reset-password.html?token=${encodeURIComponent(
    token
  )}&type=${encodeURIComponent(type)}`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color:#c1a671;">CLOCHE</h2>
      <p>Hi <strong>${name || "there"}</strong>,</p>
      <p>We received a request to reset your Cloche password.</p>

      <div style="margin:20px 0;">
        <a href="${resetUrl}"
           style="background:#c1a671;color:#fff;padding:12px 25px;text-decoration:none;border-radius:5px;">
          Reset Password
        </a>
      </div>

      <p style="font-size:12px;color:#888;">
        This link expires in 30 minutes. If you did not request this, you can ignore this email.
      </p>
    </div>
  `;

  const result = await sendEmailMessage({
    to: email,
    subject: "Reset Your Cloche Password",
    html: htmlBody
  });

  if (result.success) {
    console.log(`Password reset email sent to ${email}`);
  }

  return result;
};

// ===============================
// SEND LEAD / ENQUIRY EMAIL
// ===============================
const sendEnquiryNotificationEmail = async (
  boutiqueEmail,
  boutiqueName,
  enquiry
) => {
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color:#c1a671;">New Lead Received</h2>

      <p>Hello <strong>${boutiqueName || "Partner"}</strong>,</p>
      <p>You received a new enquiry:</p>

      <ul>
        <li><strong>Name:</strong> ${enquiry.name || "Client"}</li>
        <li><strong>Date:</strong> ${enquiry.wedding_date || "N/A"}</li>
        <li><strong>Requirement:</strong> ${enquiry.requirement || "N/A"}</li>
      </ul>

      <div style="margin-top:20px;">
        <a href="${FRONTEND_BASE_URL}/boutiquelogin.html"
           style="background:#c1a671;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;">
          Open Dashboard
        </a>
      </div>
    </div>
  `;

  const result = await sendEmailMessage({
    to: boutiqueEmail,
    subject: "New Lead Received",
    html: htmlBody
  });

  if (result.success) {
    console.log(`Lead email sent to ${boutiqueEmail}`);
  }

  return result;
};

// ===============================
// DIAGNOSTICS
// ===============================
const getEmailServiceStatus = async () => {
  const fromPrefix = BREVO_FROM_EMAIL ? BREVO_FROM_EMAIL.substring(0, 3) : "???";
  const fromSuffix = BREVO_FROM_EMAIL ? BREVO_FROM_EMAIL.split("@")[1] : "???";

  const status = {
    configured: isSetup,
    from: `${fromPrefix}...@${fromSuffix}`,
    hasBrevoApiKey: !!BREVO_API_KEY,
    hasBrevoFromEmail: !!BREVO_FROM_EMAIL,
    brevoFromName: BREVO_FROM_NAME,
    method: hasBrevoSetup ? "Brevo API" : "Not configured",
    hasBrevoSetup,
    backendUrl: BACKEND_BASE_URL,
    frontendUrl: FRONTEND_BASE_URL,
  };

  return status;
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEnquiryNotificationEmail,
  getEmailServiceStatus,
  sendEmailMessage,
  createEmailMessage,
  encodeMessage,
  isSetup,
};
