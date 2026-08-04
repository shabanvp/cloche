import { POST as v1Logout } from "../../v1/auth/logout/route";

export async function POST() {
  return v1Logout();
}
