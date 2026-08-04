import { GET as v1GetProfile, PUT as v1PutProfile } from "../../v1/vendor/profile/route";

export async function GET(req: Request) {
  return v1GetProfile(req);
}

export async function PUT(req: Request) {
  return v1PutProfile(req);
}
