import { POST as v1Signup } from "../../v1/auth/signup/route";

export async function POST(req: Request) {
  return v1Signup(req);
}
