const nodemailer = require("nodemailer");

/**
 * CLOCHE Email Service (FINAL - SMTP VERSION)
 * ✔ Real Gmail emails
 * ✔ Stable (no OAuth issues)
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

// ✅ Gmail SMTP credentials
const GMAIL_USER = process.env.GMAIL_USER || "cloche.luxury@gmail.com";
const GMAIL_APP_PASSWORD = String(process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

// ✅ Create transporter (Explicit config for cloud stability)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000, // 10s
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// ===============================
// ✅ SEND VERIFICATION EMAIL
// ===============================
const sendVerificationEmail = async (email, name, token, type) => {
  if (!GMAIL_APP_PASSWORD) {
    console.error("❌ SMTP Error: GMAIL_APP_PASSWORD is not set in environment variables.");
    return { success: false, error: "SMTP credentials missing" };
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
    console.error("❌ SMTP Error:", error.message);
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
    console.error("❌ SMTP Error:", error.message);
    return { success: false, error: error.message };
  }
};

// ===============================
// ✅ DIAGNOSTICS
// ===============================
const getEmailServiceStatus = () => {
  return {
    configured: !!GMAIL_APP_PASSWORD,
    user: GMAIL_USER,
    hasPassword: !!GMAIL_APP_PASSWORD,
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