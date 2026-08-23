import { NextResponse } from "next/server";
import { supabaseFetch } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { vendor_id } = body;

    if (!vendor_id || typeof vendor_id !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid vendor_id required" },
        { status: 400 }
      );
    }

    // Extract client IP address for deduplication
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";
    const userAgent = (req.headers.get("user-agent") || "").substring(0, 255);

    const oneHourAgoIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // 1. IP Deduplication: Check if view for this vendor from this IP was recorded in last 60 minutes
    const existingViewRes = await supabaseFetch(
      `analytics_profile_views?vendor_id=eq.${encodeURIComponent(vendor_id)}&ip_address=eq.${encodeURIComponent(ip)}&created_at=gte.${encodeURIComponent(oneHourAgoIso)}&select=id`
    );

    if (!existingViewRes.error && Array.isArray(existingViewRes.data) && existingViewRes.data.length > 0) {
      return NextResponse.json(
        { success: true, deduplicated: true, message: "View already counted within 1 hour window" },
        { status: 200 }
      );
    }

    // 2. IP Rate Limit: Check if this IP has sent > 15 total view requests in the last 60 minutes
    const ipLimitRes = await supabaseFetch(
      `analytics_profile_views?ip_address=eq.${encodeURIComponent(ip)}&created_at=gte.${encodeURIComponent(oneHourAgoIso)}&select=id`
    );

    const recentIpViews = !ipLimitRes.error && Array.isArray(ipLimitRes.data) ? ipLimitRes.data.length : 0;
    if (recentIpViews > 15) {
      console.warn(`[ANALYTICS:VIEW] Rate limit exceeded for IP ${ip} (${recentIpViews} views in 1 hr)`);
      return NextResponse.json(
        { success: false, error: "Rate limit exceeded. Too many profile view requests." },
        { status: 429 }
      );
    }

    // 3. Record verified view event in analytics_profile_views
    const insertRes = await supabaseFetch(`analytics_profile_views`, {
      method: "POST",
      body: JSON.stringify({
        vendor_id: vendor_id,
        ip_address: ip,
        user_agent: userAgent,
        created_at: new Date().toISOString(),
      }),
    });

    if (insertRes.error) {
      console.error("[ANALYTICS:VIEW] Database Insert Error:", insertRes.error.message);
      return NextResponse.json({ success: false, error: insertRes.error.message }, { status: 500 });
    }

    console.log(`[ANALYTICS:VIEW] Recorded new profile view for vendor ${vendor_id} from IP ${ip}`);

    return NextResponse.json(
      { success: true, deduplicated: false, message: "View recorded successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[ANALYTICS:VIEW] Error recording profile view:", err.message);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
