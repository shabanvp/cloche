import { NextResponse } from "next/server";
import { updateCustomerUserProfileInDb, supabaseFetch } from "@/lib/supabase";
import { getAuthenticatedCustomerUser } from "@/lib/customerAuth";
import { hashPassword, verifyPassword } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const { data: users, error } = await supabaseFetch(
      `users?id=eq.${encodeURIComponent(authUser.userId)}&select=id,email,full_name,name,phone,avatar_url,preferences,created_at`
    );

    if (error || !users || users.length === 0) {
      return NextResponse.json(
        {
          success: true,
          statusCode: 200,
          data: {
            id: authUser.userId,
            email: authUser.email,
            full_name: authUser.fullName,
            phone: authUser.phone || "",
            city: authUser.city || "Kochi",
            wedding_date: authUser.weddingDate || "",
          },
        },
        { status: 200 }
      );
    }

    const u = users[0];
    const prefs = u.preferences || {};
    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          ...u,
          city: prefs.city || u.city || authUser.city || "",
          wedding_date: prefs.wedding_date || u.wedding_date || authUser.weddingDate || "",
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const authUser = await getAuthenticatedCustomerUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, statusCode: 401, error: { code: "UNAUTHORIZED", message: "Customer login required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action, profile, passwordData, preferences, is_active } = body;

    // 1. Password Change Action
    if (action === "change_password") {
      const { currentPassword, newPassword } = passwordData || {};
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, statusCode: 400, error: { code: "VALIDATION_ERROR", message: "Current and new password required." } },
          { status: 400 }
        );
      }

      // Fetch user password_hash
      const { data: userRows } = await supabaseFetch(`users?id=eq.${encodeURIComponent(authUser.userId)}&select=password_hash`);
      if (userRows && userRows.length > 0 && userRows[0].password_hash) {
        const isValid = verifyPassword(currentPassword, userRows[0].password_hash);
        if (!isValid) {
          return NextResponse.json(
            { success: false, statusCode: 400, error: { code: "INVALID_PASSWORD", message: "Current password is incorrect." } },
            { status: 400 }
          );
        }
      }

      const newHash = hashPassword(newPassword);
      await updateCustomerUserProfileInDb(authUser.userId, { password_hash: newHash });

      return NextResponse.json(
        { success: true, statusCode: 200, message: "Password updated successfully!" },
        { status: 200 }
      );
    }

    // 2. Account Deactivation / Danger Zone Action
    if (action === "deactivate_account" || is_active === false) {
      await updateCustomerUserProfileInDb(authUser.userId, { is_active: false });
      return NextResponse.json(
        { success: true, statusCode: 200, message: "Account deactivated successfully." },
        { status: 200 }
      );
    }

    // 3. Profile & Preferences Update Action
    const updatePayload: Record<string, any> = {};

    if (profile) {
      if (profile.full_name !== undefined) updatePayload.full_name = String(profile.full_name).trim();
      if (profile.name !== undefined) updatePayload.name = String(profile.name).trim();
      if (profile.phone !== undefined) updatePayload.phone = String(profile.phone).trim();
      if (profile.avatar_url !== undefined) updatePayload.avatar_url = profile.avatar_url;
    }

    const currentPrefs = preferences || {};
    const updatedPrefs = {
      ...currentPrefs,
      ...(profile?.city !== undefined ? { city: String(profile.city).trim() } : {}),
      ...(profile?.wedding_date !== undefined ? { wedding_date: profile.wedding_date } : {}),
    };
    if (Object.keys(updatedPrefs).length > 0) {
      updatePayload.preferences = updatedPrefs;
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "NO_FIELDS", message: "No profile fields to update." } },
        { status: 400 }
      );
    }

    const { data, error } = await updateCustomerUserProfileInDb(authUser.userId, updatePayload);

    if (error) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "UPDATE_FAILED", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Profile settings saved successfully!", data },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
