/**
 * Transactional Email Helper Module for Cloche
 */

export interface SendVerificationOptions {
  email: string;
  name: string;
  verificationToken?: string;
  role?: string;
}

export async function sendVerificationMail({
  email,
  name,
}: SendVerificationOptions): Promise<{ success: boolean; message?: string }> {
  console.log(`[EMAIL_SERVICE] Verification skipped for ${email}. Email verification is disabled.`);
  return { success: true, message: "Email verification is disabled." };
}

export async function sendEmail({
  to,
  subject,
}: {
  to: string;
  subject: string;
  html?: string;
}): Promise<{ success: boolean }> {
  console.log(`[EMAIL_SERVICE] Transactional email log for ${to} | Subject: ${subject}`);
  return { success: true };
}
