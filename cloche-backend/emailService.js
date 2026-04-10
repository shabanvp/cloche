const nodemailer = require("nodemailer");

/**
 * Centeralized email service for Cloche
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cloche.luxury@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

// Verify connection on startup
if (!process.env.GMAIL_APP_PASSWORD) {
  console.warn("[EmailService] WARNING: GMAIL_APP_PASSWORD is not set. Emails will fail.");
} else {
  transporter.verify((error, success) => {
    if (error) {
      console.error("[EmailService] Transporter configuration error:", error);
    } else {
      console.log("[EmailService] Server is ready to take our messages");
    }
  });
}

const sendVerificationEmail = async (email, name, token, type) => {
  const verificationUrl = `https://cloche-backend.onrender.com/api/auth/verify-email?token=${token}&type=${type}`;
  
  const mailOptions = {
    from: '"CLOCHE LUXURY" <cloche.luxury@gmail.com>',
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
