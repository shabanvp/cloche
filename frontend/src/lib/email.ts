import tls from "tls";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  fromName?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string | null;
  error?: string;
  method?: string;
}

const DEFAULT_SENDER_EMAIL = "cloche.luxury@gmail.com";
const DEFAULT_SENDER_NAME = "Cloche Luxury";

/**
 * Sends transactional email using Gmail Direct TLS SMTP or Brevo API.
 */
export async function sendEmail({
  to,
  subject,
  html,
  fromName = DEFAULT_SENDER_NAME,
}: SendEmailOptions): Promise<SendEmailResult> {
  const recipient = (to || "").trim();
  if (!recipient || !recipient.includes("@")) {
    return { success: false, error: "Invalid recipient email address" };
  }

  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "").trim();
  const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || DEFAULT_SENDER_EMAIL).trim();
  const brevoApiKey = (process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || "").trim();
  const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  console.log(`[EmailService] Preparing email for ${recipient} | Subject: "${subject}"`);

  // 1. Try Direct TLS SMTP if Gmail / SMTP password is available
  if (gmailPass) {
    try {
      console.log(`[EmailService] Attempting SMTP dispatch via ${smtpHost}:${smtpPort} (User: ${gmailUser})...`);
      const result = await sendViaSmtpTls({
        host: smtpHost,
        port: smtpPort,
        user: gmailUser,
        pass: gmailPass,
        fromName,
        fromEmail: gmailUser,
        to: recipient,
        subject,
        html,
      });

      if (result.success) {
        console.log(`[EmailService] SUCCESS: Email delivered via SMTP to ${recipient} (msgId: ${result.messageId})`);
        return { success: true, method: "smtp-tls", messageId: result.messageId };
      } else {
        console.warn(`[EmailService] SMTP Dispatch Failed: ${result.error}. Attempting Brevo API fallback if configured...`);
      }
    } catch (smtpErr: any) {
      console.error(`[EmailService] SMTP Exception: ${smtpErr.message}`);
    }
  }

  // 2. Fallback to Brevo HTTP API
  if (brevoApiKey) {
    try {
      console.log(`[EmailService] Attempting Brevo HTTPS API dispatch...`);
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: fromName, email: process.env.BREVO_FROM_EMAIL || DEFAULT_SENDER_EMAIL },
          to: [{ email: recipient }],
          subject,
          htmlContent: html,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const msgId = data?.messageId || data?.id || "brevo-" + Date.now();
        console.log(`[EmailService] SUCCESS: Email delivered via Brevo API to ${recipient} (msgId: ${msgId})`);
        return { success: true, method: "brevo-api", messageId: msgId };
      }

      const brevoErrMsg = data?.message || data?.error || `Brevo status ${response.status}`;
      console.error(`[EmailService] Brevo API Failed: ${brevoErrMsg}`);
      return { success: false, error: brevoErrMsg, method: "brevo-api" };
    } catch (brevoErr: any) {
      console.error(`[EmailService] Brevo API Exception: ${brevoErr.message}`);
      return { success: false, error: brevoErr.message, method: "brevo-api" };
    }
  }

  // If no credentials configured
  const noConfigMsg = "SMTP credentials missing. Please configure GMAIL_APP_PASSWORD or BREVO_API_KEY in environment variables.";
  console.error(`[EmailService] CRITICAL: ${noConfigMsg}`);
  return { success: false, error: noConfigMsg };
}

/**
 * Direct SMTPS (TLS Port 465) socket implementation for Node.js
 */
function sendViaSmtpTls({
  host,
  port,
  user,
  pass,
  fromName,
  fromEmail,
  to,
  subject,
  html,
}: {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return new Promise((resolve) => {
    const messageId = `<${Date.now()}.${Math.random().toString(36).substring(2, 8)}@cloche.in>`;
    let responseLog = "";
    let step = 0;

    const socket = tls.connect(port, host, { rejectUnauthorized: false }, () => {
      // Socket connected
    });

    socket.setTimeout(12000);

    const clean = (str: string) => str.replace(/[\r\n]+/g, " ").trim();

    const rawMessage = [
      `From: "${clean(fromName)}" <${clean(fromEmail)}>`,
      `To: <${clean(to)}>`,
      `Subject: ${clean(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: ${messageId}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=UTF-8",
      "",
      html,
      ".",
    ].join("\r\n");

    socket.on("data", (data) => {
      const resp = data.toString();
      responseLog += resp;

      const code = parseInt(resp.substring(0, 3), 10);

      if (step === 0 && code === 220) {
        step = 1;
        socket.write("EHLO cloche.in\r\n");
      } else if (step === 1 && code === 250) {
        step = 2;
        socket.write("AUTH LOGIN\r\n");
      } else if (step === 2 && code === 334) {
        step = 3;
        socket.write(Buffer.from(user).toString("base64") + "\r\n");
      } else if (step === 3 && code === 334) {
        step = 4;
        socket.write(Buffer.from(pass).toString("base64") + "\r\n");
      } else if (step === 4 && code === 235) {
        step = 5;
        socket.write(`MAIL FROM:<${fromEmail}>\r\n`);
      } else if (step === 5 && code === 250) {
        step = 6;
        socket.write(`RCPT TO:<${to}>\r\n`);
      } else if (step === 6 && code === 250) {
        step = 7;
        socket.write("DATA\r\n");
      } else if (step === 7 && code === 354) {
        step = 8;
        socket.write(rawMessage + "\r\n");
      } else if (step === 8 && code === 250) {
        socket.write("QUIT\r\n");
        socket.end();
        resolve({ success: true, messageId });
      } else if (code >= 400) {
        socket.destroy();
        resolve({ success: false, error: `SMTP server returned error ${code}: ${resp.trim()}` });
      }
    });

    socket.on("error", (err) => {
      resolve({ success: false, error: err.message });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ success: false, error: "SMTP connection timed out after 12s" });
    });
  });
}

/**
 * Sends Vendor Verification Email with 24h expiration link
 */
export async function sendVendorVerificationEmail(
  email: string,
  businessName: string,
  token: string,
  verificationUrl: string
): Promise<SendEmailResult> {
  const safeName = businessName || "Valued Vendor";
  const subject = "Verify Your Cloche Vendor Account";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FBF8F1; margin: 0; padding: 0; color: #2D2520; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; border: 1px solid rgba(200, 169, 106, 0.25); overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background: #0B3B2D; padding: 32px 24px; text-align: center; color: #ffffff; }
        .logo-text { font-family: Georgia, serif; font-size: 28px; font-weight: bold; letter-spacing: 2px; color: #F7F3EC; margin: 0; }
        .subtitle { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #C8A96A; margin-top: 6px; }
        .content { padding: 36px 32px; text-align: left; }
        .h1 { font-family: Georgia, serif; font-size: 22px; color: #0F4C45; margin-top: 0; margin-bottom: 16px; }
        .p { font-size: 14px; line-height: 1.6; color: #4A403A; margin-bottom: 20px; }
        .btn-wrapper { text-align: center; margin: 32px 0; }
        .btn { background-color: #0F4C45; color: #ffffff !important; padding: 14px 32px; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 30px; display: inline-block; box-shadow: 0 4px 12px rgba(15, 76, 69, 0.25); }
        .warning-box { background: #FAF7F2; border: 1px solid rgba(200, 169, 106, 0.3); border-radius: 12px; padding: 16px; font-size: 12px; color: #66584F; margin-top: 24px; text-align: center; }
        .footer { background: #FAF7F2; border-t: 1px solid #F0EAD9; padding: 20px; text-align: center; font-size: 11px; color: #8A7B70; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="logo-text">CLOCHE</h1>
          <div class="subtitle">Curated Luxury For Your Wedding</div>
        </div>
        <div class="content">
          <h2 class="h1">Welcome, ${safeName}!</h2>
          <p class="p">Thank you for registering your business with Cloche Luxury Wedding Marketplace.</p>
          <p class="p">Please verify your email address to activate your vendor profile and unlock access to your vendor portal dashboard.</p>
          
          <div class="btn-wrapper">
            <a href="${verificationUrl}" class="btn" target="_blank">Verify Vendor Email</a>
          </div>

          <p class="p" style="font-size:12px; color:#776B61;">Or copy and paste this verification URL into your browser:</p>
          <p class="p" style="font-size:11px; word-break:break-all; color:#0F4C45; background:#FBF8F1; padding:10px; border-radius:8px;">${verificationUrl}</p>

          <div class="warning-box">
            ⏰ <strong>Note:</strong> This verification link will expire in <strong>24 hours</strong>. If it expires, you can request a new link from the vendor login page.
          </div>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} Cloche Luxury Weddings. All rights reserved.<br>
          If you did not initiate this registration, please ignore this email.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: email, subject, html, fromName: DEFAULT_SENDER_NAME });
}

export async function sendVerificationMail({
  email,
  name,
  verificationToken,
  role = "vendor",
}: {
  email: string;
  name: string;
  verificationToken: string;
  role?: string;
}): Promise<SendEmailResult> {
  const appUrl = (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.FRONTEND_BASE_URL ||
    process.env.PUBLIC_BASE_URL ||
    "https://cloche.in"
  ).trim().replace(/\/+$/, "");

  const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(verificationToken)}&type=${encodeURIComponent(role)}`;
  return sendVendorVerificationEmail(email, name, verificationToken, verificationUrl);
}
