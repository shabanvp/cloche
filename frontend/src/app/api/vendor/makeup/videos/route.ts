import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { requireAuthenticatedVendor, vendorOwnsRecord } from "@/lib/vendorAuth";

// GET /api/vendor/makeup/videos?vendor_id=...
export async function GET(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const vendorId = auth.vendorId;

    const { data } = await supabaseFetch(
      `makeup_videos?vendor_id=eq.${encodeURIComponent(vendorId)}&select=*`
    );

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/vendor/makeup/videos
export async function POST(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const body = await request.json();
    const { id, thumbnail, video_url, title, views_count, likes_count, duration } = body;

    if (!title || !video_url) {
      return NextResponse.json({ error: "Video title and URL are required." }, { status: 400 });
    }

    if (id && !(await vendorOwnsRecord("makeup_videos", id, auth.vendorId))) {
      return NextResponse.json({ error: "Video not found." }, { status: 404 });
    }

    const videoRecord = {
      ...(id ? { id } : {}),
      vendor_id: auth.vendorId,
      thumbnail: thumbnail || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
      video_url,
      title,
      views_count: views_count || "120K",
      likes_count: likes_count || "14.2K",
      duration: duration || "0:45"
    };

    const { data, error } = await supabaseFetch("makeup_videos", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(videoRecord)
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Video reel saved successfully!", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/vendor/makeup/videos?id=...
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthenticatedVendor(request);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Video ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_videos?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(auth.vendorId)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "Video reel deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
