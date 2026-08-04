import { POST as v1Login } from "../../v1/auth/login/route";

export async function POST(req: Request) {
  return v1Login(req);
}
