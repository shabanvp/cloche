"use client";

import { useState } from "react";
import { BadgeCheck, Flag, MessageSquareReply, Star } from "lucide-react";
import type { PhotographerReviewItem, PhotographerReviewsBundle } from "../types";
import { formatShortDate } from "../types";

interface Props {
  reviewsData: PhotographerReviewsBundle | null;
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerReviewsSection({ reviewsData, onRefresh, showToast }: Props) {
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [reportingReview, setReportingReview] = useState<PhotographerReviewItem | null>(null);
  const [reportReason, setReportReason] = useState("Spam or misleading review");
  const [reportDetails, setReportDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const avg = reviewsData?.averageRating ?? 0;
  const total = reviewsData?.totalReviews ?? 0;
  const dist = reviewsData?.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const reviews = reviewsData?.reviews || [];

  const handleSubmitReply = async (reviewId: string) => {
    if (!replyDraft.trim()) {
      showToast("Please write a reply first", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/vendor/photographer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "reply", reviewId, replyText: replyDraft.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to post reply");
      setReplyOpenId(null);
      setReplyDraft("");
      await onRefresh();
      showToast("Official studio reply published", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to post reply", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingReview) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/vendor/photographer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "report",
          reviewId: reportingReview.id,
          reason: reportReason,
          details: reportDetails.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to report review");
      setReportingReview(null);
      setReportDetails("");
      await onRefresh();
      showToast("Moderation report submitted for Cloche Trust review", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to submit report", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">Reviews & Ratings</h2>
        <p className="text-xs text-[#7A6F67] mt-0.5">
          Genuine client reviews from verified couples. Respond publicly to build trust.
        </p>
      </div>

      {/* Summary + Star Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-2xl border border-[#E6DDD0] bg-white p-6">
        <div className="flex flex-col justify-center items-start md:border-r md:border-[#F0EAE0] md:pr-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#7A6F67]">
            Overall Rating
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-serif text-4xl font-semibold text-[#2B2523]">
              {total > 0 ? avg.toFixed(1) : "0.0"}
            </span>
            <span className="text-sm text-[#7A6F67]">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(avg) ? "fill-[#C8A96A] text-[#C8A96A]" : "text-[#DFD5C7]"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#6E635B] mt-2">
            Based on {total} genuine customer review{total === 1 ? "" : "s"}
          </p>
        </div>

        <div className="md:col-span-2 space-y-2.5 justify-center flex flex-col">
          {([5, 4, 3, 2, 1] as const).map((stars) => {
            const count = dist[stars] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-8 font-medium text-[#2B2523]">{stars} ★</span>
                <div className="flex-1 h-2.5 rounded-full bg-[#FAF7F2] overflow-hidden border border-[#EDE6DA]">
                  <div
                    className="h-full rounded-full bg-[#C8A96A]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[#7A6F67]">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Feed */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
          <Star className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
          <p className="text-sm font-medium text-[#2B2523]">No customer reviews yet</p>
          <p className="text-xs text-[#7A6F67] mt-1">
            When couples review your photography on your Cloche profile, they appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="rounded-2xl border border-[#E6DDD0] bg-white p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-sm text-[#2B2523]">{rev.customerName}</span>
                  {rev.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#0F4C45]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0F4C45]">
                      <BadgeCheck className="w-3 h-3" /> Verified Client
                    </span>
                  )}
                  <span className="text-xs text-[#7A6F67]">· {formatShortDate(rev.createdAt)}</span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? "fill-[#C8A96A] text-[#C8A96A]" : "text-[#E6DDD0]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {rev.title && <h4 className="font-semibold text-sm text-[#2B2523]">{rev.title}</h4>}
              <p className="text-sm text-[#4A3F3A] leading-relaxed">{rev.reviewText}</p>

              {rev.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {rev.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="Client wedding memory"
                      className="h-20 w-20 rounded-xl object-cover border border-[#E6DDD0]"
                    />
                  ))}
                </div>
              )}

              {/* Vendor Reply Block */}
              {rev.vendorReply && replyOpenId !== rev.id && (
                <div className="rounded-xl bg-[#FAF7F2] border border-[#EDE6DA] p-3.5 text-xs space-y-1">
                  <p className="font-semibold text-[#0F4C45]">Studio Official Reply</p>
                  <p className="text-[#2B2523]">{rev.vendorReply.replyText}</p>
                </div>
              )}

              {replyOpenId === rev.id ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    value={replyDraft}
                    onChange={(e) => setReplyDraft(e.target.value)}
                    placeholder="Write a warm, professional response visible on your storefront..."
                    className="w-full rounded-xl border border-[#E6DDD0] p-3 text-xs text-[#2B2523]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setReplyOpenId(null)}
                      className="text-xs text-[#7A6F67] px-3 py-1.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={() => handleSubmitReply(rev.id)}
                      className="rounded-xl bg-[#0F4C45] px-4 py-1.5 text-xs font-semibold text-white"
                    >
                      Publish Reply
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE0] text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setReplyOpenId(rev.id);
                      setReplyDraft(rev.vendorReply?.replyText || "");
                    }}
                    className="inline-flex items-center gap-1.5 font-medium text-[#0F4C45] hover:underline"
                  >
                    <MessageSquareReply className="w-3.5 h-3.5" />
                    {rev.vendorReply ? "Edit Reply" : "Reply to Review"}
                  </button>

                  {rev.isReported ? (
                    <span className="text-[11px] text-amber-700 font-medium">
                      Moderation Report Submitted
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setReportingReview(rev)}
                      className="inline-flex items-center gap-1 text-[#7A6F67] hover:text-red-700"
                    >
                      <Flag className="w-3 h-3" />
                      Report for Moderation
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {reportingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <form
            onSubmit={handleSubmitReport}
            className="w-full max-w-md rounded-2xl bg-white border border-[#E6DDD0] p-6 space-y-4"
          >
            <h3 className="font-serif text-lg font-semibold text-[#2B2523]">
              Report Review for Moderation
            </h3>
            <p className="text-xs text-[#6E635B]">
              Authentic reviews remain visible while Cloche Trust & Safety investigates reports.
            </p>
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Reason</label>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs text-[#2B2523]"
              >
                <option>Spam or misleading review</option>
                <option>Never worked with this client</option>
                <option>Abusive or inappropriate language</option>
                <option>Contains private contact information</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#5E544D] mb-1">Details</label>
              <textarea
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Provide context for the moderation team..."
                className="w-full rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs text-[#2B2523]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReportingReview(null)}
                className="px-3.5 py-2 text-xs text-[#7A6F67]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-red-700 px-4 py-2 text-xs font-semibold text-white"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

