import { NextResponse } from "next/server";
import { requireAuthenticatedMehendi } from "@/lib/mehendiAuth";
import { supabaseFetch } from "@/lib/supabase";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const { data: userRows } = await supabaseFetch<any[]>(
      `users?id=eq.${encodeURIComponent(context.userId)}&select=id,email,full_name,name,phone,created_at&limit=1`
    );
    const user = Array.isArray(userRows) && userRows[0] ? userRows[0] : null;

    return NextResponse.json({
      success: true,
      data: {
        userId: context.userId,
        vendorId: context.vendorId,
        email: user?.email || "",
        fullName: user?.full_name || user?.name || context.ownerName,
        phone: user?.phone || "",
        createdAt: user?.created_at,
      },
    });
  } catch (err: any) {
    console.error("[MEHENDI_SETTINGS_GET]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to load settings." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedMehendi(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const { fullName, phone, currentPassword, newPassword } = body;

    const userPatch: Record<string, any> = { updated_at: new Date().toISOString() };
    if (fullName) {
      userPatch.full_name = fullName.trim();
      userPatch.name = fullName.trim();
    }
    if (phone !== undefined) userPatch.phone = phone.trim();

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password." },
          { status: 400 }
        );
      }
      const { data: uRows } = await supabaseFetch<any[]>(
        `users?id=eq.${encodeURIComponent(context.userId)}&select=password_hash&limit=1`
      );
      const user = Array.isArray(uRows) && uRows[0] ? uRows[0] : null;
      if (!user?.password_hash || !verifyPassword(currentPassword, user.password_hash)) {
        return NextResponse.json(
          { error: "Incorrect current password." },
          { status: 400 }
        );
      }
      userPatch.password_hash = hashPassword(newPassword);
    }

    await supabaseFetch(`users?id=eq.${encodeURIComponent(context.userId)}`, {
      method: "PATCH",
      body: JSON.stringify(userPatch),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[MEHENDI_SETTINGS_PATCH]", err);
    return NextResponse.json(
      { error: err?.message || "Failed to update settings." },
      { status: 400 }
    );
  }
}

