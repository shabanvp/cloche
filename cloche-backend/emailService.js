const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const dns = require("dns");

/**
 * CLOCHE Email Service
 * Uses Resend over HTTPS first, then falls back to Gmail API/SMTP if configured.
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

const GMAIL_USER = process.env.GMAIL_USER || "cloche.luxury@gmail.com";
const GMAIL_CLIENT_ID = String(process.env.GMAIL_CLIENT_ID || "").trim();
const GMAIL_CLIENT_SECRET = String(process.env.GMAIL_CLIENT_SECRET || "").trim();
const GMAIL_REFRESH_TOKEN = String(process.env.GMAIL_REFRESH_TOKEN || "").trim();
const GMAIL_APP_PASSWORD = String(process.env.GMAIL_APP_PASSWORD || "").trim().replace(/\s+/g, "");
const RESEND_API_KEY = String(process.env.RESEND_API_KEY || "").trim();
const RESEND_FROM_EMAIL = String(process.env.RESEND_FROM_EMAIL || "CLOCHE <onboarding@resend.dev>").trim();

const hasResendSetup = !!RESEND_API_KEY;
const hasGmailApiSetup = !!(GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN);
const hasSmtpSetup = !!(GMAIL_USER && GMAIL_APP_PASSWORD);
const isSetup = hasResendSetup || hasGmailApiSetup || hasSmtpSetup;
let cachedSmtpIpv4 = null;

const oauth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

if (hasGmailApiSetup) {
  oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
}

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

console.log(`Email service configured: Resend=${hasResendSetup}, Gmail API=${hasGmailApiSetup}, SMTP app password=${hasSmtpSetup}`);

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
    `From: "${escapeHeader(fromName)}" <${GMAIL_USER}>`,
    `To: ${escapeHeader(to)}`,
    "Content-Type: text/html; charset=UTF-8",
    "MIME-Version: 1.0",
    `Subject: ${escapeHeader(subject)}`,
    "",
    html
  ];

  return encodeMessage(lines.join("\n"));
};

const resolveSmtpIpv4 = async () => {
  if (cachedSmtpIpv4) return cachedSmtpIpv4;

  const addresses = await dns.promises.resolve4("smtp.gmail.com");
  cachedSmtpIpv4 = addresses[0];
  return cachedSmtpIpv4;
};

const createSmtpTransporter = async () => {
  const smtpIpv4 = await resolveSmtpIpv4();

  return nodemailer.createTransport({
    host: smtpIpv4,
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    name: "smtp.gmail.com",
    tls: {
      servername: "smtp.gmail.com",
    },
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD,
    },
  });
};

const sendSmtpMessage = async ({ to, subject, html, fromName }) => {
  const smtpTransporter = await createSmtpTransporter();
  const info = await smtpTransporter.sendMail({
    from: `"${escapeHeader(fromName || "Cloche Luxury")}" <${GMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return { success: true, messageId: info?.messageId || null, method: "gmail-smtp-app-password" };
};

const sendGmailApiMessage = async ({ to, subject, html, fromName }) => {
  const response = await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: createEmailMessage(to, subject, html, fromName)
    }
  });

  return { success: true, messageId: response?.data?.id || null, method: "gmail-api" };
};

const sendResendMessage = async ({ to, subject, html }) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Resend API failed with status ${response.status}`;
    throw new Error(message);
  }

  return { success: true, messageId: data?.id || null, method: "resend" };
};

const sendEmailMessage = async ({ to, subject, html, fromName }) => {
  if (!isSetup) {
    console.error("Email Error: No email provider configured (Resend, SMTP, or Gmail OAuth2)");
    return { success: false, error: "Email provider is not configured" };
  }

  // 1. Try Gmail OAuth2 First (as requested)
  if (hasGmailApiSetup) {
    try {
      // Validate token before trying to send
      const { token } = await oauth2Client.getAccessToken();
      if (!token) throw new Error("Google Refresh Token is invalid or expired. Please generate a new one.");

      const rawMessage = createEmailMessage(to, subject, html, fromName);
      
      const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
          raw: rawMessage,
        },
      });

      if (response.data && response.data.id) {
        return { success: true, messageId: response.data.id, method: "gmail-api-https" };
      }
    } catch (error) {
      const apiError = error?.response?.data?.error?.message || error.message;
      console.error("[EmailService] Gmail API Error:", apiError);
      
      // If this is the only method, return the specific error
      if (!hasResendSetup && !hasSmtpSetup) {
        return { success: false, error: `Gmail API Error: ${apiError}` };
      }
    }
  }

  // 2. Fallback to Resend
  if (hasResendSetup) {
    try {
      return await sendResendMessage({ to, subject, html, fromName });
    } catch (error) {
      console.error("[EmailService] Resend Fallback Error:", error.message);
    }
  }

  // 3. Final Fallback to SMTP
  if (hasSmtpSetup) {
    try {
      return await sendSmtpMessage({ to, subject, html, fromName });
    } catch (error) {
      console.error("[EmailService] SMTP Fallback Error:", error.message);
      return { success: false, error: error.message };
    }
  }

  return { success: false, error: "All email methods failed" };
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
    console.log(`Verification email sent to ${email} via ${result.method || "email provider"}`);
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
  const userPrefix = GMAIL_USER ? GMAIL_USER.substring(0, 3) : "???";
  const userSuffix = GMAIL_USER ? GMAIL_USER.split("@")[1] : "???";

  return {
    configured: isSetup,
    user: `${userPrefix}...@${userSuffix}`,
    hasClientId: !!GMAIL_CLIENT_ID,
    hasClientSecret: !!GMAIL_CLIENT_SECRET,
    hasRefreshToken: !!GMAIL_REFRESH_TOKEN,
    hasAppPassword: !!GMAIL_APP_PASSWORD,
    hasResendApiKey: !!RESEND_API_KEY,
    resendFromEmail: RESEND_FROM_EMAIL.replace(/<.*>/, "<hidden>"),
    method: hasResendSetup ? "Resend API" : (hasSmtpSetup ? "Gmail SMTP app password" : "Gmail API OAuth2"),
    hasResendSetup,
    hasGmailApiSetup,
    hasSmtpSetup,
    backendUrl: BACKEND_BASE_URL,
    frontendUrl: FRONTEND_BASE_URL,
  };
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEnquiryNotificationEmail,
  getEmailServiceStatus,
  createEmailMessage,
  encodeMessage,
  gmail,
  isSetup,
};
