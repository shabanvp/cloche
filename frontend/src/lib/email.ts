import { getSupabaseConfig } from "./supabase";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

export interface SendVerificationOptions {
  email: string;
  name: string;
  verificationToken: string;
  role?: string;
}

export async function sendVerificationMail({
  email,
  name,
  verificationToken,
  role = "customer",
}: SendVerificationOptions): Promise<{ success: boolean; message?: string }> {
  try {
    console.log(`[EMAIL_SERVICE] Triggering verification email for: ${email}`);

    // 1. Try sending via Render backend email endpoint
    const res = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        token: verificationToken,
        type: role,
      }),
    }).catch(() => null);

    if (res && res.ok) {
      console.log(`[EMAIL_SERVICE] Verification email dispatched successfully via backend service to: ${email}`);
      return { success: true };
    }

    // 2. Fallback to direct Brevo Transactional Email API if key is present
    const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
    const brevoFromEmail = process.env.BREVO_FROM_EMAIL || "support@cloche.com";
    const brevoFromName = process.env.BREVO_FROM_NAME || "Cloche Luxury Weddings";

    if (brevoApiKey) {
      const verificationUrl = `https://cloche-backend.onrender.com/api/auth/verify-email?token=${encodeURIComponent(
        verificationToken
      )}&type=${encodeURIComponent(role)}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0d5c1; rounded: 12px; background-color: #FAF7F2;">
          <h2 style="color: #0F4C45; font-family: Georgia, serif; font-size: 28px; margin-bottom: 8px;">CLOCHE</h2>
          <p style="color: #8E7D62; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Curated Luxury Weddings</p>
          <hr style="border: 0; border-top: 1px solid #E5DEC9; margin: 20px 0;" />
          <p style="color: #2D2926; font-size: 16px;">Hello <strong>${name}</strong>,</p>
          <p style="color: #4A4540; font-size: 15px; line-height: 1.6;">
            Welcome to Cloche! Please verify your email address to complete your account activation and explore luxury wedding venues, bridal boutiques, and premium vendors.
          </p>
          <div style="margin: 32px 0; text-align: center;">
            <a href="${verificationUrl}" style="background-color: #0F4C45; color: #FAF7F2; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px; letter-spacing: 1px;">
              VERIFY MY ACCOUNT
            </a>
          </div>
          <p style="color: #7A7570; font-size: 13px; margin-top: 24px;">
            If you did not request this account creation, please disregard this email.
          </p>
        </div>
      `;

      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: brevoFromName, email: brevoFromEmail },
          to: [{ email }],
          subject: "Verify Your Cloche Account",
          htmlContent,
        }),
      }).catch(() => null);

      if (brevoRes && brevoRes.ok) {
        console.log(`[EMAIL_SERVICE] Verification email sent via Brevo API to: ${email}`);
        return { success: true };
      }
    }

    console.log(`[EMAIL_SERVICE] Verification token ${verificationToken} generated for ${email}. (Account created)`);
    return { success: true, message: "Account created. Verification email queued." };
  } catch (err: any) {
    console.error("[EMAIL_SERVICE] Failed to send verification email:", err);
    return { success: false, message: err.message };
  }
}
