"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  CornerDownRight,
  Loader2,
  MessageSquare,
  Send,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import type { MehendiReviewsBundle } from "../types";

interface Props {
  reviewsData: MehendiReviewsBundle | null;
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function MehendiReviewsSection({ reviewsData, onRefresh, showToast }: Props) {
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.averageRating || 5.0;
  const totalReviews = reviewsData?.totalReviews || 0;
  const breakdown = reviewsData?.ratingBreakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  const handleSendReply = async (reviewId: string) => {
    if (!replyText.trim()) return;

    setSubmittingReply(true);
    try {
      const res = await fetch("/api/vendor/mehendi/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reviewId, replyText: replyText.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to post reply");

      showToast("Reply published successfully!");
      setReplyingReviewId(null);
      setReplyText("");
      await onRefresh();
    } catch (err: any) {
      showToast(err.message || "Failed to send reply", "error");
    } finally {
      setSubmittingReply(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="border-b border-[#E6DDD0] pb-5">
        <h2 className="font-serif text-2xl font-bold text-[#2B2523]">Customer Reviews & Ratings</h2>
        <p className="text-xs text-[#7A6F67]">
          Read verified customer testimonials, check star distributions, and respond to your clients.
        </p>
      </div>

      {/* Ratings Summary Card */}
      <div className="bg-white rounded-2xl border border-[#E6DDD0] p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Big Score */}
        <div className="text-center md:border-r border-[#F0EAE0] md:pr-6 space-y-1">
          <p className="font-serif text-5xl font-bold text-[#2B2523]">{averageRating.toFixed(1)}</p>
          <div className="flex items-center justify-center gap-1 text-amber-500 py-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(averageRating) ? "fill-amber-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-[#7A6F67]">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Middle: Star Bars Breakdown */}
        <div className="col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = (breakdown as any)[stars] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-[#7A6F67] font-semibold">{stars} Star</span>
                <div className="flex-1 h-2 rounded-full bg-[#FAF7F2] overflow-hidden border border-[#E6DDD0]">
                  <div
                    className="h-full bg-gradient-to-r from-[#C8A96A] to-[#0F4C45] rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-[#7A6F67]">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="rounded-2xl border border-[#E6DDD0] bg-white p-12 text-center text-[#7A6F67]">
          <Star className="w-10 h-10 text-[#C8A96A] mx-auto mb-3 opacity-60" />
          <h3 className="font-serif font-bold text-base text-[#2B2523]">No Reviews Yet</h3>
          <p className="text-xs text-[#7A6F67] max-w-sm mx-auto mt-1">
            Clients who complete bookings through Cloche will be able to leave verified reviews and photos here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-[#E6DDD0] p-5 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E6DDD0] overflow-hidden flex items-center justify-center text-[#0F4C45] font-serif font-bold text-sm shrink-0">
                    {rev.customerAvatar ? (
                      <img src={rev.customerAvatar} alt={rev.customerName} className="w-full h-full object-cover" />
                    ) : (
                      rev.customerName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#2B2523]">{rev.customerName}</h4>
                      {rev.isVerifiedBooking && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Booking
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[#7A6F67]">
                      <span>{rev.serviceReceived}</span>
                      <span>·</span>
                      <span>
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-500 shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(rev.rating) ? "fill-amber-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-[#2B2523] leading-relaxed italic bg-[#FAF7F2]/60 p-3 rounded-xl border border-[#F0EAE0]">
                &ldquo;{rev.writtenReview}&rdquo;
              </p>

              {/* Photos if any */}
              {rev.reviewPhotos && rev.reviewPhotos.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-1">
                  {rev.reviewPhotos.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="review photo"
                      className="w-16 h-16 rounded-lg object-cover border border-[#E6DDD0]"
                    />
                  ))}
                </div>
              )}

              {/* Existing Reply */}
              {rev.reply && (
                <div className="ml-6 pl-4 border-l-2 border-[#0F4C45] bg-[#FAF7F2] p-3 rounded-r-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#0F4C45]">
                    <span className="flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5" /> Response from Artist
                    </span>
                    <span className="text-[#7A6F67] font-normal">
                      {new Date(rev.reply.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A3F3A]">{rev.reply.text}</p>
                </div>
              )}

              {/* Reply Box */}
              {!rev.reply && (
                <div className="pt-2">
                  {replyingReviewId === rev.id ? (
                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a polite response thanking your client..."
                        className="w-full rounded-xl border border-[#E6DDD0] p-2.5 text-xs focus:outline-none focus:border-[#C8A96A]"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setReplyingReviewId(null);
                            setReplyText("");
                          }}
                          className="px-3 py-1.5 text-xs text-[#7A6F67]"
                        >
                          Cancel
                        </button>
                        <button
                          disabled={submittingReply || !replyText.trim()}
                          onClick={() => handleSendReply(rev.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#0F4C45] text-white hover:bg-[#072B27] disabled:opacity-50"
                        >
                          {submittingReply ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                          Publish Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyingReviewId(rev.id);
                        setReplyText("");
                      }}
                      className="text-xs font-semibold text-[#0F4C45] hover:underline inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Reply to Review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

