import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * TEMPORARY DIAGNOSTIC ENDPOINT
 * GET /api/pexels/debug
 *
 * Returns environment variable status (WITHOUT exposing the key value).
 * Safe to deploy — never reveals the actual secret.
 * DELETE this file after confirming Pexels API works on Render.
 */
export async function GET() {
  const rawKey = process.env.PEXELS_API_KEY || "";
  const trimmedKey = rawKey.trim().replace(/^["']|["']$/g, "");

  const isLoaded = trimmedKey.length > 0 && trimmedKey !== "YOUR_PEXELS_API_KEY_HERE";

  // Test live Pexels request if key is available
  let pexelsTest: {
    attempted: boolean;
    status?: number;
    statusText?: string;
    totalResults?: number;
    photoCount?: number;
    error?: string;
  } = { attempted: false };

  if (isLoaded) {
    try {
      const res = await fetch(
        "https://api.pexels.com/v1/search?query=kerala+wedding&per_page=3",
        {
          headers: { Authorization: trimmedKey },
          cache: "no-store",
        }
      );
      pexelsTest.attempted = true;
      pexelsTest.status = res.status;
      pexelsTest.statusText = res.statusText;

      if (res.ok) {
        const json = await res.json();
        pexelsTest.totalResults = json.total_results;
        pexelsTest.photoCount = json.photos?.length;
      } else {
        const errText = await res.text().catch(() => "");
        pexelsTest.error = errText;
      }
    } catch (err: any) {
      pexelsTest.attempted = true;
      pexelsTest.error = `Exception: ${err?.message}`;
    }
  }

  return NextResponse.json({
    diagnostic: "Pexels API Environment Check",
    timestamp: new Date().toISOString(),
    NODE_ENV: process.env.NODE_ENV,
    environment: {
      PEXELS_API_KEY: {
        present: isLoaded,
        rawLength: rawKey.length,
        trimmedLength: trimmedKey.length,
        firstChars: isLoaded ? trimmedKey.substring(0, 6) + "..." : "(empty)",
        lastChars: isLoaded ? "..." + trimmedKey.slice(-4) : "(empty)",
      },
    },
    pexelsApiTest: pexelsTest,
    instructions: isLoaded
      ? "✓ Key detected. Check pexelsApiTest.status — it should be 200."
      : "✗ Key NOT detected on server. Add PEXELS_API_KEY in Render → Environment Variables → Save → Manual Deploy.",
  });
}
