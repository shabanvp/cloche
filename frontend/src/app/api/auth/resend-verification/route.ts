import { POST as handleResendVerification } from "../../v1/auth/resend-verification/route";

export async function POST(req: Request) {
  return handleResendVerification(req);
}
