import { POST as handleResend } from "../../auth/resend-verification/route";

export async function POST(req: Request) {
  return handleResend(req);
}
