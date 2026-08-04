import { NextResponse } from "next/server";

export async function GET() {
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER || "cloche.luxury@gmail.com";
  const hasGmailPass = !!(process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS);
  const brevoKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
  const hasBrevoKey = !!brevoKey;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = process.env.SMTP_PORT || "465";

  return NextResponse.json({
    status: "ok",
    emailConfig: {
      smtpHost,
      smtpPort,
      gmailUser,
      hasGmailAppPassword: hasGmailPass,
      gmailAppPasswordLength: hasGmailPass ? (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "").length : 0,
      hasBrevoApiKey: hasBrevoKey,
      senderAddress: gmailUser,
      providerReady: hasGmailPass || hasBrevoKey,
    },
    message: hasGmailPass || hasBrevoKey
      ? "Email provider is configured."
      : "CRITICAL: No GMAIL_APP_PASSWORD or BREVO_API_KEY found in environment variables. Please set GMAIL_APP_PASSWORD in .env or deployment settings.",
  });
}
