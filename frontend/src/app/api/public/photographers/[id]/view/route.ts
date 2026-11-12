import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";
import { resolvePhotographerVendorByIdentifier } from "@/lib/photographerData";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vendor = await resolvePhotographerVendorByIdentifier(decodeURIComponent(id));
    if (!vendor || vendor.status !== "active" || vendor.publication_status !== "published") {
      return NextResponse.json({ success: true, counted: false });
    }

    const fwd = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
    const ipRaw = fwd.split(",")[0].trim();
    const ua = req.headers.get("user-agent") || "unknown";
    const ipHash = crypto.createHash("sha256").update(`${ipRaw}:${vendor.id}`).digest("hex").slice(0, 48);

    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data: recent } = await supabaseFetch<any[]>(
      `analytics_profile_views?vendor_id=eq.${encodeURIComponent(vendor.id)}&ip_hash=eq.${encodeURIComponent(ipHash)}&created_at=gte.${encodeURIComponent(thirtyMinsAgo)}&select=id&limit=1`
    );

    if (Array.isArray(recent) && recent.length > 0) {
      return NextResponse.json({ success: true, counted: false });
    }

    const isMobile = /mobile|android|iphone|ipad/i.test(ua);
    await supabaseFetch("analytics_profile_views", {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendor.id,
        ip_hash: ipHash,
        user_agent: ua.slice(0, 250),
        device_type: isMobile ? "mobile" : "desktop",
        referrer_url: (req.headers.get("referer") || "").slice(0, 250) || null,
      }),
    });

    return NextResponse.json({ success: true, counted: true });
  } catch {
    return NextResponse.json({ success: true, counted: false });
  }
}
