import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

// GET /api/vendor/makeup/videos?vendor_id=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendor_id") || "makeup-riya-sharma";

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
    const body = await request.json();
    const { id, vendor_id, thumbnail, video_url, title, views_count, likes_count, duration } = body;

    if (!title || !video_url) {
      return NextResponse.json({ error: "Video title and URL are required." }, { status: 400 });
    }

    const videoRecord = {
      ...(id ? { id } : {}),
      vendor_id: vendor_id || "makeup-riya-sharma",
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Video ID is required." }, { status: 400 });
    }

    await supabaseFetch(`makeup_videos?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });

    return NextResponse.json({ success: true, message: "Video reel deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
