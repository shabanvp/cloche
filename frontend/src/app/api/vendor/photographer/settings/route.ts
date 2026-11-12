import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { getSupabaseConfig, signInWithSupabaseAuth, supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedPhotographer } from "@/lib/photographerAuth";
import {
  getPhotographerProfile,
  savePhotographerProfile,
  setPhotographerPublicationStatus,
} from "@/lib/photographerData";

function revalidateStorefront(slug: string, vendorId: string) {
  try {
    revalidatePath("/photographers");
    revalidatePath(`/photographers/${slug}`);
    revalidatePath(`/photographers/${vendorId}`);
  } catch {
    // non-fatal
  }
}

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const profile = await getPhotographerProfile(context.vendorId, context);
    return NextResponse.json({
      success: true,
      data: {
        ownerName: profile.ownerName,
        businessName: profile.businessName,
        email: profile.email,
        phone: profile.phone,
        whatsapp: profile.whatsapp,
        city: profile.city,
        publicationStatus: profile.publicationStatus,
        slug: profile.slug,
        vendorCode: profile.vendorCode,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load settings." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();

    if (body?.publicationStatus === "draft" || body?.publicationStatus === "published") {
      await setPhotographerPublicationStatus(context.vendorId, body.publicationStatus, context.userId);
    }

    const result = await savePhotographerProfile(context, {
      ownerName: body.ownerName,
      businessName: body.businessName,
      phone: body.phone,
      whatsapp: body.whatsapp,
      email: body.email,
    });

    if (body?.phone && context.userId) {
      await supabaseFetch(`users?id=eq.${encodeURIComponent(context.userId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          phone: String(body.phone).trim(),
          updated_at: new Date().toISOString(),
        }),
      });
    }

    revalidateStorefront(result.profile.slug, context.vendorId);
    return NextResponse.json({ success: true, data: result.profile });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update account settings." },
      { status: 400 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const action = String(body?.action || "");

    if (action === "change_password") {
      const currentPassword = String(body?.currentPassword || "");
      const newPassword = String(body?.newPassword || "");

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Current password and new password are required." },
          { status: 400 }
        );
      }
      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters." },
          { status: 400 }
        );
      }

      const { data: uRows } = await supabaseFetch<any[]>(
        `users?id=eq.${encodeURIComponent(context.userId)}&select=id,email,password_hash,supabase_user_id&limit=1`
      );
      const userRow = Array.isArray(uRows) ? uRows[0] : null;
      if (!userRow) {
        return NextResponse.json({ error: "Account not found." }, { status: 404 });
      }

      let verified = false;
      if (userRow.password_hash) {
        verified = verifyPassword(currentPassword, userRow.password_hash);
      }
      if (!verified && userRow.email) {
        const sbLogin = await signInWithSupabaseAuth(userRow.email, currentPassword);
        verified = !sbLogin?.error && Boolean(sbLogin?.user);
      }

      if (!verified) {
        return NextResponse.json(
          { error: "Current password is incorrect." },
          { status: 400 }
        );
      }

      const newHash = hashPassword(newPassword);
      await supabaseFetch(`users?id=eq.${encodeURIComponent(context.userId)}`, {
        method: "PATCH",
        body: JSON.stringify({
          password_hash: newHash,
          updated_at: new Date().toISOString(),
        }),
      });

      // Keep Supabase Auth user in sync if linked
      if (userRow.supabase_user_id) {
        const { url, serviceKey } = getSupabaseConfig();
        if (url && serviceKey) {
          await fetch(`${url}/auth/v1/admin/users/${encodeURIComponent(userRow.supabase_user_id)}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              apikey: serviceKey,
              Authorization: `Bearer ${serviceKey}`,
            },
            body: JSON.stringify({ password: newPassword }),
          }).catch(() => {});
        }
      }

      return NextResponse.json({ success: true, message: "Password updated successfully." });
    }

    return NextResponse.json({ error: "Unsupported settings action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update security settings." },
      { status: 400 }
    );
  }
}

