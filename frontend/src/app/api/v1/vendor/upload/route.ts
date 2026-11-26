import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase";
import { getAuthenticatedUser } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const { url, serviceKey, anonKey } = getSupabaseConfig();
    const apiKey = serviceKey;

    if (!url || !apiKey) {
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "CONFIG_ERROR", message: "Database unconfigured." } },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const kind = (formData.get("kind") as string) || "gallery";
    const docKey = (formData.get("doc_key") as string) || null;
    let userId = (formData.get("user_id") as string) || null;
    let vendorId = (formData.get("vendor_id") as string) || null;

    if (!file) {
      return NextResponse.json(
        { success: false, statusCode: 400, error: { code: "NO_FILE", message: "No file provided." } },
        { status: 400 }
      );
    }

    const auth = getAuthenticatedUser(req as any);
    if (auth) {
      userId = userId || auth.userId || auth.id;
    }

    // Resolve vendorId if not provided
    if (!vendorId && userId) {
      const vRes = await fetch(`${url}/rest/v1/vendors?user_id=eq.${encodeURIComponent(userId)}&deleted_at=is.null&select=id&limit=1`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` },
        cache: "no-store",
      }).catch(() => null);
      if (vRes && vRes.ok) {
        const vRows = await vRes.json();
        if (Array.isArray(vRows) && vRows.length > 0) {
          vendorId = vRows[0].id;
        }
      }
    }

    const isDoc = kind === "document" && docKey !== "logo";
    const bucket = isDoc ? "partner-documents" : "partner-media";
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
    const fileUid = userId || vendorId || "general";
    const fileName = isDoc ? `${docKey || "doc"}-${Date.now()}.${ext}` : `${crypto.randomUUID()}.${ext}`;
    const storagePath = `${fileUid}/${fileName}`;

    // Upload to Supabase Storage using serviceKey
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadRes = await fetch(`${url}/storage/v1/object/${bucket}/${encodeURIComponent(storagePath)}`, {
      method: "POST",
      headers: {
        "Content-Type": file.type || (isDoc ? "application/pdf" : "image/jpeg"),
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "x-upsert": "true",
      },
      body: fileBuffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("[VENDOR_UPLOAD] Storage upload failed:", errText);
      return NextResponse.json(
        { success: false, statusCode: 500, error: { code: "STORAGE_ERROR", message: errText } },
        { status: 500 }
      );
    }

    const publicUrl = `${url}/storage/v1/object/public/${bucket}/${storagePath}`;

    // Insert into media table
    let mediaId = `media_${Date.now()}`;
    const mediaPayload: Record<string, any> = {
      media_type: isDoc ? "document" : "image",
      bucket_name: bucket,
      file_path: storagePath,
      original_name: file.name,
      mime_type: file.type || (isDoc ? "application/pdf" : "image/jpeg"),
      file_size_bytes: file.size,
      cdn_url: publicUrl,
      metadata: {
        kind,
        doc_key: docKey,
      },
    };

    if (userId) mediaPayload.user_id = userId;
    if (vendorId) mediaPayload.vendor_id = vendorId;

    const mediaInsertRes = await fetch(`${url}/rest/v1/media`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(mediaPayload),
    }).catch(() => null);

    if (mediaInsertRes && mediaInsertRes.ok) {
      const mRows = await mediaInsertRes.json();
      if (Array.isArray(mRows) && mRows.length > 0 && mRows[0].id) {
        mediaId = mRows[0].id;
      }
    }

    return NextResponse.json(
      {
        success: true,
        statusCode: 200,
        data: {
          id: mediaId,
          path: storagePath,
          url: publicUrl,
          src: publicUrl,
          name: file.name,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[VENDOR_UPLOAD] Error:", err);
    return NextResponse.json(
      { success: false, statusCode: 500, error: { code: "SERVER_ERROR", message: err.message } },
      { status: 500 }
    );
  }
}

