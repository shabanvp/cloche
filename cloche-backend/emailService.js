const nodemailer = require("nodemailer");

/**
 * CLOCHE Email Service - Gmail OAuth2
 * ✔ Real Gmail emails via OAuth2
 * ✔ No IPv6 issues
 * ✔ Cloud-friendly (Render compatible)
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

// ✅ Gmail OAuth2 Credentials
const GMAIL_USER = process.env.GMAIL_USER || "cloche.luxury@gmail.com";
const GMAIL_CLIENT_ID = String(process.env.GMAIL_CLIENT_ID || "").trim();
const GMAIL_CLIENT_SECRET = String(process.env.GMAIL_CLIENT_SECRET || "").trim();
const GMAIL_REFRESH_TOKEN = String(process.env.GMAIL_REFRESH_TOKEN || "").trim();

// ✅ Create transporter with Gmail OAuth2
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: GMAIL_USER,
    clientId: GMAIL_CLIENT_ID,
    clientSecret: GMAIL_CLIENT_SECRET,
    refreshToken: GMAIL_REFRESH_TOKEN,
    accessUrl: "https://oauth.google.com/token",
  },
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Gmail OAuth2 transporter verification failed:", error.message);
  } else {
    console.log("✅ Gmail OAuth2 transporter verified and ready");
  }
});

// ===============================
// ✅ SEND VERIFICATION EMAIL
// ===============================
const sendVerificationEmail = async (email, name, token, type) => {
  // Check OAuth2 credentials
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    console.error("❌ Gmail OAuth2 Error: Missing credentials (CLIENT_ID, CLIENT_SECRET, or REFRESH_TOKEN)");
    return { success: false, error: "Gmail OAuth2 credentials not configured" };
  }

  const verificationUrl = `${BACKEND_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(
    token
  )}&type=${encodeURIComponent(type)}`;

  const htmlBody = `
    <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color:#c1a671;">CLOCHE</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Welcome to Cloche Luxury.</p>
      <p>Please verify your email to continue:</p>

      <div style="margin:20px 0;">
        <a href="${verificationUrl}" 
           style="background:#c1a671;color:#fff;padding:12px 25px;text-decoration:none;border-radius:5px;">
          Verify Account
        </a>
      </div>

      <p style="font-size:12px;color:#888;">
        If you didn’t create this account, ignore this email.
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Cloche Luxury" <${GMAIL_USER}>`,
      to: email,
      subject: "Verify Your Cloche Account",
      html: htmlBody,
    });

    console.log(`✅ Verification email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Gmail OAuth2 Error:", error.message);
    console.error("❌ Error Code:", error.code);
    return { success: false, error: error.message };
  }
};

// ===============================
// ✅ SEND LEAD / ENQUIRY EMAIL
// ===============================
const sendEnquiryNotificationEmail = async (
  boutiqueEmail,
  boutiqueName,
  enquiry
) => {
  const htmlBody = `
    <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px;">
      <h2 style="color:#c1a671;">New Lead Received</h2>

      <p>Hello <strong>${boutiqueName}</strong>,</p>
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

  try {
    await transporter.sendMail({
      from: `"Cloche Luxury" <${GMAIL_USER}>`,
      to: boutiqueEmail,
      subject: "New Lead Received",
      html: htmlBody,
    });

    console.log(`✅ Lead email sent to ${boutiqueEmail}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Gmail OAuth2 Error:", error.message);
    return { success: false, error: error.message };
  }
};

// ===============================
// ✅ DIAGNOSTICS
// ===============================
const getEmailServiceStatus = async () => {
  // Obfuscate user for safety but show enough to verify
  const userPrefix = GMAIL_USER ? GMAIL_USER.substring(0, 3) : "???";
  const userSuffix = GMAIL_USER ? GMAIL_USER.split("@")[1] : "???";

  const hasAllOAuth2Creds = !!(GMAIL_CLIENT_ID && GMAIL_CLIENT_SECRET && GMAIL_REFRESH_TOKEN);

  return {
    configured: hasAllOAuth2Creds,
    user: `${userPrefix}...@${userSuffix}`,
    hasClientId: !!GMAIL_CLIENT_ID,
    hasClientSecret: !!GMAIL_CLIENT_SECRET,
    hasRefreshToken: !!GMAIL_REFRESH_TOKEN,
    method: "Gmail OAuth2",
    backendUrl: BACKEND_BASE_URL,
    frontendUrl: FRONTEND_BASE_URL,
  };
};

// ===============================
// ✅ EXPORTS
// ===============================
module.exports = {
  sendVerificationEmail,
  sendEnquiryNotificationEmail,
  getEmailServiceStatus,
};