import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: true,
      statusCode: 200,
      message: "Email verification is disabled. Accounts are active upon registration.",
    },
    { status: 200 }
  );
}
