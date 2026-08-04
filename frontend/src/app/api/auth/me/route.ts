import { GET as v1Me } from "../../v1/auth/me/route";

export async function GET(req: Request) {
  return v1Me(req);
}
