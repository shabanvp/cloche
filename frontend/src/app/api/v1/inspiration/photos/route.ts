import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// ─────────────────────────────────────────────────────────────────────────────
// SERVER-SIDE IN-MEMORY CACHE
// Keeps a result set per category + query for CACHE_TTL_MS before re-fetching.
// This avoids hammering the Pexels API on every page load.
// Free-tier limit: 25 req/hr (api.pexels.com/v1/search). 7 categories × a few
// pages each ≈ well within limits when cached.
// ─────────────────────────────────────────────────────────────────────────────
const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours
const cache = new Map<string, { ts: number; data: PexelsPhoto[] }>();

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY → PEXELS SEARCH QUERY MAPPING
// Carefully chosen to return relevant Indian wedding imagery.
// "Color Themes" is excluded — those are kept as static editorial palettes.
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_QUERIES: Record<string, string> = {
  "Wedding Photos": "indian wedding photography ceremony",
  "Bridal Looks": "indian bride wedding saree lehenga",
  "Groom Looks": "indian groom sherwani wedding",
  "Mehendi Designs": "bridal mehndi henna hands design",
  "Stage Designs": "indian wedding mandap stage floral decoration",
  "Trending Decor": "indian wedding flower decoration venue",
  "Seasonal Trends": "outdoor indian wedding ceremony",
  // Collection-based aliases
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

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface PexelsPhoto {
  id: string;
  width: number;
  height: number;
  url: string; // Pexels photo page URL (for attribution link)
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
// ROUTE HANDLER
// GET /api/v1/inspiration/photos?category=Wedding+Photos&page=1&per_page=20
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category") || "Wedding Photos";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = Math.min(parseInt(searchParams.get("per_page") || "20", 10), 30);

  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

  // ── No API key configured → return graceful not-configured response ──
  if (!PEXELS_API_KEY || PEXELS_API_KEY === "YOUR_PEXELS_API_KEY_HERE") {
    return NextResponse.json(
      {
        success: false,
        error: "PEXELS_NOT_CONFIGURED",
        message:
          "Pexels API key not set. Add PEXELS_API_KEY to .env.local to enable live wedding photos.",
        photos: [],
        total: 0,
      },
      { status: 200 } // 200 so client can handle gracefully, not crash
    );
  }

  // ── Resolve query for this category ──
  const query = CATEGORY_QUERIES[category] || "indian wedding";
  const cacheKey = `${query}::page${page}::per${perPage}`;

  // ── Check cache ──
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

  // ── Fetch from Pexels API ──
  try {
    const pexelsUrl = new URL("https://api.pexels.com/v1/search");
    pexelsUrl.searchParams.set("query", query);
    pexelsUrl.searchParams.set("page", String(page));
    pexelsUrl.searchParams.set("per_page", String(perPage));
    pexelsUrl.searchParams.set("orientation", "portrait"); // better for masonry

    const res = await fetch(pexelsUrl.toString(), {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      next: { revalidate: 14400 }, // 4 hours Next.js cache
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.error(`[Pexels API] ${res.status} ${res.statusText}:`, errText);
      return NextResponse.json(
        {
          success: false,
          error: "PEXELS_API_ERROR",
          message: `Pexels API returned ${res.status}. Check your API key or rate limits.`,
          photos: [],
          total: 0,
        },
        { status: 200 }
      );
    }

    const data: PexelsResponse = await res.json();

    // ── Pluck only the fields we need (smaller payload) ──
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

    // ── Store in cache ──
    cache.set(cacheKey, { ts: Date.now(), data: photos });

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
    console.error("[Pexels API] Fetch error:", err?.message);
    return NextResponse.json(
      {
        success: false,
        error: "NETWORK_ERROR",
        message: "Could not reach Pexels API. Falling back to curated content.",
        photos: [],
        total: 0,
      },
      { status: 200 }
    );
  }
}
