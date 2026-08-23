import { NextResponse } from "next/server";
import { recomputeAllTrendingScores } from "@/lib/trendingEngine";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleTrendingRecompute(req);
}

export async function POST(req: Request) {
  return handleTrendingRecompute(req);
}

async function handleTrendingRecompute(req: Request) {
  const startMs = Date.now();
  console.log("[CRON:TRENDING] Starting Trending Scores recalculation job...");

  // Verify Cron Secret if configured
  const authHeader = req.headers.get("authorization");
  const url = new URL(req.url);
  const secretParam = url.searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET || process.env.JWT_SECRET;

  if (cronSecret) {
    const isHeaderValid = authHeader === `Bearer ${cronSecret}`;
    const isParamValid = secretParam === cronSecret;
    if (!isHeaderValid && !isParamValid && process.env.NODE_ENV === "production") {
      console.warn("[CRON:TRENDING] Unauthorized cron trigger attempt.");
      return NextResponse.json(
        { success: false, error: "Unauthorized cron trigger" },
        { status: 401 }
      );
    }
  }

  try {
    const result = await recomputeAllTrendingScores();

    console.log(
      `[CRON:TRENDING] Job Completed! Status: ${result.success ? "SUCCESS" : "FAILED"}, Processed: ${result.processedCount}, Top Score: ${result.topScore}, Duration: ${result.durationMs}ms`
    );

    return NextResponse.json(
      {
        success: result.success,
        data: result,
        executed_at: new Date().toISOString(),
      },
      { status: result.success ? 200 : 500 }
    );
  } catch (err: any) {
    console.error("[CRON:TRENDING] Recalculation job error:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
        duration_ms: Date.now() - startMs,
      },
      { status: 500 }
    );
  }
}
