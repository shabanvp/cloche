import { POST as v1VendorRegister } from "../../v1/vendor/register/route";

export async function POST(req: Request) {
  return v1VendorRegister(req);
}
