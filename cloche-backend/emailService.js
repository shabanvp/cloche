const nodemailer = require("nodemailer");

/**
 * Centralized email service for Cloche
 * Uses Gmail SMTP directly (no third-party services)
 */
const GMAIL_USER = process.env.GMAIL_USER || "cloche.luxury@gmail.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

let transporter;

if (!GMAIL_APP_PASSWORD) {
  console.error("[EmailService] ❌ ERROR: GMAIL_APP_PASSWORD environment variable is NOT set!");
  console.error("[EmailService] Please add GMAIL_APP_PASSWORD to Render environment variables");
  console.error("[EmailService] Generate it at: https://myaccount.google.com/apppasswords");
} else {
  console.log(`[EmailService] Configuring Gmail SMTP for ${GMAIL_USER}`);
  
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,  // TLS port (more reliable on Render than 465)
    secure: false, // Use STARTTLS
    family: 4, // Force IPv4 only (Render has better IPv4 support)
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD
    },
    connectionTimeout: 25000,
    socketTimeout: 30000,
    tls: {
      rejectUnauthorized: false // For Render compatibility
    },
    logger: true, // Enable logging for debugging
    debug: process.env.DEBUG_EMAIL === "true" // Set DEBUG_EMAIL=true for verbose logs
  });

  // Verify connection on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error("[EmailService] ❌ SMTP Verification failed:", error.message);
    } else {
      console.log(`[EmailService] ✅ Gmail SMTP verified and ready`);
    }
  });
}

const sendVerificationEmail = async (email, name, token, type) => {
  const verificationUrl = `https://cloche-backend.onrender.com/api/auth/verify-email?token=${token}&type=${type}`;
  
  const mailOptions = {
    from: `"CLOCHE LUXURY" <${GMAIL_USER}>`,
    to: email,
    subject: "Verify Your Cloche Account",
    html: `
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
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Verification email sent to ${email}. MessageId: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error(`[EmailService] SMTP Error for ${email}:`, error);
    // Return specific error message to help debugging
    let friendlyMessage = "Failed to send email.";
    if (error.code === 'EAUTH') friendlyMessage = "Authentication failed. Check GMAIL_APP_PASSWORD.";
    if (error.code === 'ESOCKET') friendlyMessage = "Network timeout. Check server connectivity.";
    
    return { success: false, error: friendlyMessage, raw: error.message };
  }
};

module.exports = {
  sendVerificationEmail
};
