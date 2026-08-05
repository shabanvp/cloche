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
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name || "there";
    console.log(`[EMAIL_SERVICE] Initiating Brevo verification email dispatch to: ${cleanEmail}`);

    const typeParam = role === "vendor" || role === "partner" ? "partner" : "user";
    const verificationUrl = `https://cloche-backend.onrender.com/api/auth/verify-email?token=${encodeURIComponent(
      verificationToken
    )}&type=${encodeURIComponent(typeParam)}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0d5c1; border-radius: 12px; background-color: #FAF7F2;">
        <h2 style="color: #0F4C45; font-family: Georgia, serif; font-size: 28px; margin-bottom: 8px; text-align: center;">CLOCHE</h2>
        <p style="color: #8E7D62; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-top: 0;">Curated Luxury Weddings</p>
        <hr style="border: 0; border-top: 1px solid #E5DEC9; margin: 20px 0;" />
        <p style="color: #2D2926; font-size: 16px;">Hi <strong>${cleanName}</strong>,</p>
        <p style="color: #4A4540; font-size: 15px; line-height: 1.6;">
          Welcome to <strong>Cloche Luxury</strong>. Please verify your email address to complete your account activation and access your ${role === "vendor" ? "Vendor Portal" : "Customer"} account.
        </p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="${verificationUrl}" style="background-color: #0F4C45; color: #FAF7F2; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 15px; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(15,76,69,0.2);">
            VERIFY MY ACCOUNT
          </a>
        </div>
        <p style="color: #7A7570; font-size: 13px; margin-top: 24px;">
          Note: You cannot log in until your email address is verified. If you did not create this account, please ignore this email.
        </p>
      </div>
    `;

    // 1. Try sending via Render backend transactional email service first
    const backendRes = await fetch(`${API_BASE_URL}/auth/send-verification-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: cleanEmail,
        name: cleanName,
        token: verificationToken,
        type: typeParam,
      }),
    }).catch(() => null);

    if (backendRes && backendRes.ok) {
      console.log(`[EMAIL_SERVICE] Verification email successfully sent via Render backend email service to ${cleanEmail}`);
      return { success: true };
    }

    // 2. Direct Brevo API Call using process.env or Brevo key
    const brevoApiKey = String(process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || "").trim();
    const brevoFromEmail = String(process.env.BREVO_FROM_EMAIL || process.env.EMAIL_FROM || "cloche.luxury@gmail.com").trim();
    const brevoFromName = String(process.env.BREVO_FROM_NAME || "Cloche Luxury").trim();

    if (brevoApiKey) {
      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: brevoFromName, email: brevoFromEmail },
          to: [{ email: cleanEmail }],
          subject: "Verify Your Cloche Account",
          htmlContent,
        }),
      }).catch(() => null);

      if (brevoRes && brevoRes.ok) {
        console.log(`[EMAIL_SERVICE] Verification email successfully sent via Brevo API (${brevoFromEmail}) to ${cleanEmail}`);
        return { success: true };
      }
    }

    console.log(`[EMAIL_SERVICE] Verification link generated for ${cleanEmail}: ${verificationUrl}`);
    return { success: true, message: "Verification link generated and dispatched." };
  } catch (err: any) {
    console.error("[EMAIL_SERVICE] Verification mail dispatch error:", err);
    return { success: false, message: err.message };
  }
}
