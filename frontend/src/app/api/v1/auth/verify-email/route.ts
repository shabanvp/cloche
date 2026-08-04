import { GET as handleVerifyEmail } from "../../auth/verify-email/route";

export async function GET(req: Request) {
  return handleVerifyEmail(req);
}
