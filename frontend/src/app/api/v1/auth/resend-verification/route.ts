import { NextResponse } from "next/server";
import { resendSupabaseAuthEmail } from "@/lib/supabase";

export async function POST(req: Request) {
  const logPrefix = "[RESEND_VERIFICATION_API]";

  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Email address is required." } },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    console.log(`${logPrefix} Triggering Supabase Auth email confirmation resend for ${cleanEmail}...`);

    const result = await resendSupabaseAuthEmail(cleanEmail, "https://cloche-six.vercel.app/auth/callback");

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          error: { code: "RESEND_FAILED", message: result.error.message },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        message: `A new confirmation email has been sent to ${cleanEmail}. Please check your inbox and click the confirmation link.`,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error(`${logPrefix} Error resending verification email:`, err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
