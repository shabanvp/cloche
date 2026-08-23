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
      `users?id=eq.${encodeURIComponent(authUser.userId)}&select=id,email,full_name,name,phone,avatar_url,created_at`
    );

    const { data: userPrefs } = await supabaseFetch(
      `user_preferences?user_id=eq.${encodeURIComponent(authUser.userId)}&select=preferred_city,wedding_date`
    );

    const prefRecord = Array.isArray(userPrefs) && userPrefs.length > 0 ? userPrefs[0] : null;

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
            city: prefRecord?.preferred_city || authUser.city || "Kochi",
            wedding_date: prefRecord?.wedding_date || authUser.weddingDate || "",
          },
        },
        { status: 200 }
      );
    }

    const u = users[0];
    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          ...u,
          city: prefRecord?.preferred_city || authUser.city || "",
          wedding_date: prefRecord?.wedding_date || authUser.weddingDate || "",
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
    const { action, profile, passwordData, is_active } = body;

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

    // 3. Profile Update Action (Core users table: full_name, name, phone, avatar_url)
    const userUpdatePayload: Record<string, any> = {};
    if (profile) {
      if (profile.full_name !== undefined) userUpdatePayload.full_name = String(profile.full_name).trim();
      if (profile.name !== undefined) userUpdatePayload.name = String(profile.name).trim();
      if (profile.phone !== undefined) userUpdatePayload.phone = String(profile.phone).trim();
      if (profile.avatar_url !== undefined) userUpdatePayload.avatar_url = profile.avatar_url;
    }

    if (Object.keys(userUpdatePayload).length > 0) {
      await updateCustomerUserProfileInDb(authUser.userId, userUpdatePayload);
    }

    // 4. Wedding City & Date Update Action (user_preferences table)
    if (profile?.city !== undefined || profile?.wedding_date !== undefined) {
      const { data: existingPrefs } = await supabaseFetch(
        `user_preferences?user_id=eq.${encodeURIComponent(authUser.userId)}&select=id`
      );

      const prefPayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (profile.city !== undefined) prefPayload.preferred_city = String(profile.city).trim();
      if (profile.wedding_date !== undefined) prefPayload.wedding_date = String(profile.wedding_date).trim();

      if (Array.isArray(existingPrefs) && existingPrefs.length > 0) {
        await supabaseFetch(`user_preferences?id=eq.${encodeURIComponent(existingPrefs[0].id)}`, {
          method: "PATCH",
          body: JSON.stringify(prefPayload),
        });
      } else {
        prefPayload.user_id = authUser.userId;
        await supabaseFetch(`user_preferences`, {
          method: "POST",
          body: JSON.stringify(prefPayload),
        });
      }
    }

    return NextResponse.json(
      { success: true, statusCode: 200, message: "Profile settings saved successfully!" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}
