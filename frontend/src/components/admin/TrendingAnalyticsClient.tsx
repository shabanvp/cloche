"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Flame,
  Award,
  RefreshCw,
  Clock,
  Sparkles,
  BarChart3,
  Building2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface TrendingVendor {
  id: string;
  vendor_id: string;
  business_name: string;
  category: string;
  score: number;
  raw_engagement_score: number;
  rank: number;
  computed_at: string;
  is_verified?: boolean;
}

interface ScoreHistoryPoint {
  vendor_id: string;
  score: number;
  snapshot_at: string;
}

export function TrendingAnalyticsClient() {
  const [scores, setScores] = useState<TrendingVendor[]>([]);
  const [history, setHistory] = useState<ScoreHistoryPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [recomputing, setRecomputing] = useState<boolean>(false);
  const [lastRecomputeMsg, setLastRecomputeMsg] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/trending-data", { cache: "no-store" }).then((r) => r.json());
      if (res.success) {
        setScores(res.data?.scores || []);
        setHistory(res.data?.history || []);
      }
    } catch (e) {
      console.error("Failed to load trending analytics data", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleManualRecompute() {
    setRecomputing(true);
    setLastRecomputeMsg(null);
    try {
      const res = await fetch("/api/v1/cron/trending-recompute", { method: "POST" }).then((r) => r.json());
      if (res.success) {
        setLastRecomputeMsg(`✓ Recomputed ${res.data?.processedCount || 0} vendors in ${res.data?.durationMs || 0}ms`);
        await loadData();
      } else {
        setLastRecomputeMsg(`❌ Calculation error: ${res.error || "Failed"}`);
      }
    } catch (err: any) {
      setLastRecomputeMsg(`❌ Network error: ${err.message}`);
    } finally {
      setRecomputing(false);
    }
  }

  // Calculate high-level summary metrics
  const totalScored = scores.length;
  const activeTrendingCount = scores.filter((s) => Number(s.raw_engagement_score) > 0).length;
  const topScoreVal = scores.length > 0 ? Math.max(...scores.map((s) => Number(s.score))) : 0;
  const lastComputedAt = scores.length > 0 ? scores[0].computed_at : null;

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6 lg:p-8 text-charcoal font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gold/15 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#0F4C45]" />
              <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">
                Platform Intelligence Engine
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-1">
              Trending Analytics &amp; Scoring Engine
            </h1>
            <p className="text-xs sm:text-sm text-charcoal/60 mt-1 max-w-xl">
              Real-time exponential decay scoring system ($w = e^{"-0.013t"}$) evaluating user interactions, enquiries, favorites, and reviews.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleManualRecompute}
              disabled={recomputing}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#0F4C45] hover:bg-[#12584E] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${recomputing ? "animate-spin" : ""}`} />
              <span>{recomputing ? "Recomputing Engine..." : "Trigger Recompute Now"}</span>
            </button>
            {lastRecomputeMsg && (
              <span className="text-[11px] font-semibold text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20">
                {lastRecomputeMsg}
              </span>
            )}
          </div>
        </div>

        {/* SUMMARY STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-charcoal/60 text-xs">
              <span>Vendors Scored</span>
              <Building2 className="w-4 h-4 text-[#0F4C45]" />
            </div>
            <p className="text-2xl font-bold text-charcoal">{loading ? "..." : totalScored}</p>
            <p className="text-[11px] text-charcoal/50">Active platform listings</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-charcoal/60 text-xs">
              <span>Active Signal Vendors</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-charcoal">{loading ? "..." : activeTrendingCount}</p>
            <p className="text-[11px] text-charcoal/50">Raw engagement &gt; 0.00</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-charcoal/60 text-xs">
              <span>Highest Score</span>
              <Award className="w-4 h-4 text-gold" />
            </div>
            <p className="text-2xl font-bold text-[#0F4C45]">{loading ? "..." : topScoreVal.toFixed(2)}</p>
            <p className="text-[11px] text-charcoal/50">Decayed weight sum</p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-charcoal/60 text-xs">
              <span>Last Recomputed</span>
              <Clock className="w-4 h-4 text-charcoal/60" />
            </div>
            <p className="text-sm font-bold text-charcoal truncate">
              {loading ? "..." : lastComputedAt ? new Date(lastComputedAt).toLocaleTimeString() : "Never"}
            </p>
            <p className="text-[11px] text-charcoal/50">
              {lastComputedAt ? new Date(lastComputedAt).toLocaleDateString() : "Pending Cron Job"}
            </p>
          </div>
        </div>

        {/* HISTORICAL TREND GRAPH (REAL DATA FROM trending_score_history) */}
        <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal">Historical Score Snapshots</h2>
              <p className="text-xs text-charcoal/60">Actual score data points logged into trending_score_history</p>
            </div>
            <span className="text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{history.length} Snapshot Logs</span>
            </span>
          </div>

          {history.length === 0 ? (
            <div className="bg-[#FAF7F2] p-8 rounded-2xl border border-dashed border-gold/30 text-center space-y-2">
              <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
              <p className="text-xs font-bold text-charcoal">No Historical Snapshots Yet</p>
              <p className="text-[11px] text-charcoal/60">
                Click &quot;Trigger Recompute Now&quot; above to log historical score snapshots for the trend graph.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="h-48 flex items-end gap-2 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10 overflow-x-auto">
                {history.slice(0, 30).map((h, i) => {
                  const barHeightPct = Math.max(10, Math.min(100, (Number(h.score) / (topScoreVal || 1)) * 100));
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1 min-w-[28px] group relative">
                      <div className="absolute -top-7 hidden group-hover:block bg-charcoal text-white text-[10px] py-0.5 px-2 rounded shadow-md whitespace-nowrap z-10">
                        Score: {Number(h.score).toFixed(2)} ({new Date(h.snapshot_at).toLocaleTimeString()})
                      </div>
                      <div
                        className="w-full bg-[#0F4C45] hover:bg-[#12584E] transition-all rounded-t-sm"
                        style={{ height: `${barHeightPct}%` }}
                      />
                      <span className="text-[9px] text-charcoal/50 truncate w-full text-center">
                        {new Date(h.snapshot_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-charcoal/50 text-right">
                Showing last 30 snapshot events from PostgreSQL
              </p>
            </div>
          )}
        </div>

        {/* RANKED TRENDING VENDORS TABLE */}
        <div className="bg-white rounded-3xl border border-gold/15 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gold/10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-charcoal">Vendor Trending Rankings</h2>
              <p className="text-xs text-charcoal/60">Sorted by decaying interaction score and verified quality factors</p>
            </div>
            <span className="text-xs font-bold text-[#0F4C45] bg-white px-3 py-1 rounded-full border border-gold/20">
              {scores.length} Ranked Vendors
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-charcoal/60">Loading scores from database...</div>
          ) : scores.length === 0 ? (
            <div className="p-12 text-center text-xs text-charcoal/60">No scores computed yet. Click Recompute Now.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] text-charcoal/70 border-b border-gold/10 font-bold">
                  <tr>
                    <th className="py-3.5 px-4 text-center">Rank</th>
                    <th className="py-3.5 px-4">Vendor Business</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Raw Interaction Score</th>
                    <th className="py-3.5 px-4">Total Score</th>
                    <th className="py-3.5 px-4">Badge Status</th>
                    <th className="py-3.5 px-4">Last Computed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/10">
                  {scores.map((vendor) => {
                    const rawScoreNum = Number(vendor.raw_engagement_score || 0);
                    const totalScoreNum = Number(vendor.score || 0);

                    return (
                      <tr key={vendor.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-charcoal">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                              vendor.rank === 1
                                ? "bg-amber-100 text-amber-800 border border-amber-300"
                                : vendor.rank === 2
                                ? "bg-gray-200 text-gray-800"
                                : vendor.rank === 3
                                ? "bg-orange-100 text-orange-800"
                                : "bg-gray-100 text-charcoal/70"
                            }`}
                          >
                            #{vendor.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-charcoal">
                          <div className="flex items-center gap-2">
                            <span>{vendor.business_name || "Vendor Partner"}</span>
                            {vendor.is_verified && (
                              <span title="Verified Partner">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-charcoal/70 capitalize">{vendor.category || "General"}</td>
                        <td className="py-3.5 px-4 font-semibold text-charcoal">
                          {rawScoreNum.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[#0F4C45]">
                          {totalScoreNum.toFixed(4)}
                        </td>
                        <td className="py-3.5 px-4">
                          {rawScoreNum > 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                              <Flame className="w-3 h-3 text-amber-500" />
                              <span>Trending 🔥</span>
                            </span>
                          ) : vendor.is_verified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>Newly Verified ✨</span>
                            </span>
                          ) : (
                            <span className="text-charcoal/40 text-[11px]">Unranked Base</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-charcoal/50 text-[11px]">
                          {new Date(vendor.computed_at).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
