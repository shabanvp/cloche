import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// SERVER-SIDE IN-MEMORY CACHE
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours
const cache = new Map<string, { ts: number; data: PexelsPhoto[] }>();

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY → PEXELS SEARCH QUERY MAPPING
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_QUERIES: Record<string, string> = {
  "Wedding Photos": "indian wedding photography ceremony",
  "Wedding Details": "indian wedding rings invitation jewelry floral details",
  "Wedding Photography": "indian wedding candid photography couple",
  "Bridal Looks": "indian bride wedding saree lehenga",
  "Groom Looks": "indian groom sherwani wedding",
  "Mehendi Designs": "bridal mehndi henna hands design",
  "Stage Designs": "indian wedding mandap stage floral decoration",
  "Stage & Mandap": "indian wedding mandap stage floral decoration",
  "Trending Decor": "indian wedding flower decoration venue",
  "Floral Decoration": "indian wedding flower decoration floral",
  "Seasonal Trends": "outdoor indian wedding ceremony",
  "Kerala Weddings": "kerala wedding kasavu traditional ceremony",
  "Traditional Kerala Weddings": "kerala wedding kasavu traditional ceremony",
  "Destination Weddings": "outdoor destination indian wedding",
  "Monsoon Weddings": "outdoor indian wedding ceremony rain",
  "Reception Ideas": "indian wedding reception decoration stage",
  "trending": "indian wedding photography ceremony",
  "kerala": "kerala wedding kasavu traditional ceremony",
  "luxury": "luxury indian wedding royal decoration",
  "minimal": "minimal modern indian wedding decor",
  "stage": "indian wedding mandap stage floral decoration",
  "photography": "indian wedding candid photography couple",
  "bridal": "indian bride wedding saree lehenga",
  "groom": "indian groom sherwani wedding",
  "mehendi": "bridal mehndi henna hands design",
  "floral": "indian wedding flower decoration floral",
  "destination": "outdoor destination indian wedding",
  "monsoon": "outdoor indian wedding ceremony rain",
  "reception": "indian wedding reception decoration stage",
};

export interface PexelsPhoto {
  id: string;
  width: number;
  height: number;
  url: string;
  src: {
    large2x: string;
    large: string;
    medium: string;
  };
  photographer: string;
  photographer_url: string;
  alt: string | null;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
  total_results: number;
  page: number;
  per_page: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER ROUTE HANDLER
// GET /api/pexels?query=kerala+wedding&category=Stage+Designs&page=1&per_page=30
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawQuery = searchParams.get("query");
  const category = searchParams.get("category") || "Wedding Photos";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = Math.min(parseInt(searchParams.get("per_page") || "28", 10), 40);

  // Derive search query
  const query = rawQuery || CATEGORY_QUERIES[category] || "kerala wedding";

  // ── DIAGNOSTIC: Always log env status in Render logs ──
  const rawKey = process.env.PEXELS_API_KEY || "";
  console.log("[/api/pexels DIAGNOSTIC]", {
    NODE_ENV: process.env.NODE_ENV,
    pexelsLoaded: !!rawKey,
    length: rawKey.length,
    firstChars: rawKey.length > 0 ? rawKey.substring(0, 6) + "..." : "(empty)",
    category,
    query,
  });

  const PEXELS_API_KEY = rawKey.trim().replace(/^["']|["']$/g, "");

  if (!PEXELS_API_KEY || PEXELS_API_KEY === "YOUR_PEXELS_API_KEY_HERE") {
    console.error("[/api/pexels] ✗ PEXELS_API_KEY is missing or placeholder — check Render Environment Variables dashboard.");
    return NextResponse.json(
      {
        success: false,
        error: "PEXELS_NOT_CONFIGURED",
        message: "PEXELS_API_KEY is missing from the server environment.",
        photos: [],
        total: 0,
      },
      { status: 200 }
    );
  }

  console.log("[/api/pexels] ✓ PEXELS_API_KEY detected. Proceeding with Pexels request.");

  const cacheKey = `${query}::page${page}::per${perPage}`;

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return NextResponse.json(
      {
        success: true,
        source: "cache",
        photos: cached.data,
        total: cached.data.length,
        category,
        query,
        page,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=3600",
        },
      }
    );
  }

  try {
    const pexelsUrl = new URL("https://api.pexels.com/v1/search");
    pexelsUrl.searchParams.set("query", query);
    pexelsUrl.searchParams.set("page", String(page));
    pexelsUrl.searchParams.set("per_page", String(perPage));
    pexelsUrl.searchParams.set("orientation", "portrait");

    console.log(`[/api/pexels] Fetching Pexels API: query="${query}", page=${page}, per_page=${perPage}`);

    const res = await fetch(pexelsUrl.toString(), {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: 14400 },
    });

    console.log(`[/api/pexels] Pexels Response Status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[/api/pexels Error] HTTP ${res.status} ${res.statusText}: ${errText}`);
      return NextResponse.json(
        {
          success: false,
          error: "PEXELS_API_ERROR",
          httpStatus: res.status,
          message: `Pexels API returned HTTP ${res.status} (${res.statusText}): ${errText}`,
          photos: [],
          total: 0,
        },
        { status: 200 }
      );
    }

    const data: PexelsResponse = await res.json();

    const photos: PexelsPhoto[] = (data.photos || []).map((p) => ({
      id: String(p.id),
      width: p.width,
      height: p.height,
      url: p.url,
      src: {
        large2x: p.src.large2x,
        large: p.src.large,
        medium: p.src.medium,
      },
      photographer: p.photographer,
      photographer_url: p.photographer_url,
      alt: p.alt,
    }));

    cache.set(cacheKey, { ts: Date.now(), data: photos });

    console.log(`[/api/pexels] Successfully returned ${photos.length} photos (Total available: ${data.total_results})`);

    return NextResponse.json(
      {
        success: true,
        source: "live",
        photos,
        total: data.total_results,
        category,
        query,
        page,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=14400, stale-while-revalidate=3600",
        },
      }
    );
  } catch (err: any) {
    console.error("[/api/pexels Exception]:", err?.message);
    return NextResponse.json(
      {
        success: false,
        error: "NETWORK_ERROR",
        message: `Network exception contacting Pexels: ${err?.message || "Unknown error"}`,
        photos: [],
        total: 0,
      },
      { status: 200 }
    );
  }
}
