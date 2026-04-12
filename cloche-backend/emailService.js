const { google } = require("googleapis");

/**
 * Centralized email service for Cloche
 * Uses Gmail API directly (free, no SMTP timeouts, no cold start issues)
 */
const GMAIL_USER = process.env.GMAIL_USER || "cloche.luxury@gmail.com";
const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

let gmail;
let isSetup = false;

if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
  console.error("[EmailService] ❌ ERROR: Gmail OAuth credentials not set!");
  console.error("[EmailService] Required env variables:");
  console.error("  - GMAIL_CLIENT_ID");
  console.error("  - GMAIL_CLIENT_SECRET");
  console.error("  - GMAIL_REFRESH_TOKEN");
} else {
  console.log(`[EmailService] Configuring Gmail API for ${GMAIL_USER}`);
  
  const oauth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    "http://localhost:3000/oauth2callback" // Redirect URL (not used in refresh flow)
  );

  oauth2Client.setCredentials({
    refresh_token: GMAIL_REFRESH_TOKEN
  });

  gmail = google.gmail({ version: "v1", auth: oauth2Client });
  isSetup = true;

  console.log(`[EmailService] ✅ Gmail API ready`);
}

const encodeMessage = (message) => {
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const createEmailMessage = (to, subject, htmlBody) => {
  const emailLines = [
    `From: "${GMAIL_USER.split("@")[0]}" <${GMAIL_USER}>`,
    `To: ${to}`,
    "Content-Type: text/html; charset=UTF-8",
    "MIME-Version: 1.0",
    `Subject: ${subject}`,
    "",
    htmlBody
  ];
  return emailLines.join("\n");
};

const sendVerificationEmail = async (email, name, token, type) => {
  if (!isSetup) {
    console.error("[EmailService] Gmail API not configured");
    return { success: false, error: "Email service not configured. Missing Gmail OAuth credentials." };
  }

  const verificationUrl = `https://cloche-backend.onrender.com/api/auth/verify-email?token=${token}&type=${type}`;
  
  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #c1a671; color: #0d0d0d; background-color: #faf7f2;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #c1a671; font-weight: 300; letter-spacing: 5px; margin: 0;">CLOCHE</h1>
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #888; margin-top: 10px;">Atelier of Elegance</p>
      </div>
      
      <div style="line-height: 1.6; color: #333;">
        <p style="font-size: 18px; margin-bottom: 20px;">Welcome to the ecosystem, <strong>${name}</strong>.</p>
        <p>We are delighted to have you join Cloche Luxury. To complete your registration and begin your royal journey, please verify your email address by clicking the link below:</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationUrl}" style="background-color: #c1a671; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px;">Verify Account</a>
        </div>
        
        <p style="font-size: 13px; color: #666;">If you did not request this account, you can safely ignore this email.</p>
      </div>
      
      <div style="margin-top: 50px; border-top: 1px solid #eee; pt-20; text-align: center;">
        <p style="font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 2px;">© 2024 CLOCHE LUXURY. ALL RIGHTS RESERVED.</p>
      </div>
    </div>
  `;

  try {
    const rawMessage = createEmailMessage(email, "Verify Your Cloche Account", htmlBody);
    const encodedMessage = encodeMessage(rawMessage);

    const response = await gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: encodedMessage
      }
    });

    console.log(`[EmailService] ✅ Verification email sent to ${email}. MessageId: ${response.data.id}`);
    return { success: true };
  } catch (error) {
    console.error(`[EmailService] Gmail API Error for ${email}:`, error.message);
    
    let friendlyMessage = "Failed to send email.";
    if (error.message.includes("401")) friendlyMessage = "Authentication failed. Check Gmail OAuth credentials.";
    if (error.message.includes("403")) friendlyMessage = "Permission denied. Check GMAIL_CLIENT_ID and GMAIL_REFRESH_TOKEN.";
    if (error.message.includes("timeout")) friendlyMessage = "Request timeout. Try again.";
    
    return { success: false, error: friendlyMessage, raw: error.message };
  }
};

const sendEnquiryNotificationEmail = async (boutiqueEmail, boutiqueName, enquiry) => {
  if (!isSetup) {
    console.error("[EmailService] Gmail API not configured");
    return { success: false, error: "Email service not configured." };
  }

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #c1a671; color: #0d0d0d; background-color: #faf7f2;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #c1a671; font-weight: 300; letter-spacing: 5px; margin: 0;">CLOCHE</h1>
        <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #888; margin-top: 10px;">New Exclusive Opportunity</p>
      </div>
      
      <div style="line-height: 1.6; color: #333;">
        <p style="font-size: 18px; margin-bottom: 20px;">Greetings, <strong>${boutiqueName}</strong>.</p>
        <p>An exclusive enquiry has been matched to your boutique. Here are the details of the royal requirement:</p>
        
        <div style="background-color: #fff; padding: 25px; border-left: 3px solid #c1a671; margin: 30px 0;">
          <p style="margin: 5px 0;"><strong>Customer:</strong> ${enquiry.name || "Valued Client"}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${enquiry.wedding_date || "To be decided"}</p>
          <p style="margin: 5px 0;"><strong>Requirement:</strong> ${enquiry.requirement || "General Luxury Services"}</p>
          ${enquiry.special_requirement ? `<p style="margin: 5px 0;"><strong>Special Notes:</strong> ${enquiry.special_requirement}</p>` : ""}
        </div>
        
        <p>Please log in to your Cloche Partner Dashboard to view the full contact details and claim this lead.</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://cloche-backend.onrender.com/boutiquelogin.html" style="background-color: #c1a671; color: #fff; padding: 15px 30px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; border-radius: 4px;">Open Dashboard</a>
        </div>
      </div>
      
      <div style="margin-top: 50px; border-top: 1px solid #eee; pt-20; text-align: center;">
        <p style="font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 2px;">© 2024 CLOCHE LUXURY. CONFIDENTIAL PARTNER COMMUNICATION.</p>
      </div>
    </div>
  `;

  try {
    const rawMessage = createEmailMessage(boutiqueEmail, "New Luxury Enquiry Matched", htmlBody);
    const encodedMessage = encodeMessage(rawMessage);

    const response = await gmail.users.messages.send({
      userId: "me",
      resource: {
        raw: encodedMessage
      }
    });

    console.log(`[EmailService] ✅ Lead notification sent to ${boutiqueEmail}.`);
    return { success: true, messageId: response.data.id };
  } catch (error) {
    console.error(`[EmailService] Lead notification failed for ${boutiqueEmail}:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationEmail,
  sendEnquiryNotificationEmail
};
