"use client";

import { useState } from "react";
import {
  Star,
  MessageSquare,
  Flag,
  CheckCircle,
  ThumbsUp,
  Sparkles,
  Search,
  CornerDownRight
} from "lucide-react";

export interface CustomerReview {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  comment: string;
  vendorReply?: string;
  isFeatured?: boolean;
  isReported?: boolean;
}

const MOCK_REVIEWS: CustomerReview[] = [
  {
    id: "REV-1",
    customerName: "Kavya Menon",
    rating: 5,
    date: "2026-10-02",
    comment: "The Temple Haram set for my wedding was breathtaking! Completely authentic finish and the security deposit refund was processed within 24 hours.",
    vendorReply: "Thank you Kavya! Wishing you a lifetime of joy and happiness!",
    isFeatured: true
  },
  {
    id: "REV-2",
    customerName: "Sneha Reddy",
    rating: 5,
    date: "2026-09-24",
    comment: "Punctual delivery service and trial appointment at their boutique vault was so comfortable. Highly recommended for bridal jewellery rentals!",
    isFeatured: true
  },
  {
    id: "REV-3",
    customerName: "Aarti Mittal",
    rating: 4,
    date: "2026-09-15",
    comment: "Gorgeous Polki Choker set! Only giving 4 stars because pickup valet arrived 20 mins late, but jewellery quality made up for it."
  }
];

export function JewelleryReviewsSection() {
  const [reviews, setReviews] = useState<CustomerReview[]>(MOCK_REVIEWS);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleSendReply = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, vendorReply: replyText } : r))
    );
    setReplyingToId(null);
    setReplyText("");
  };

  const toggleFeatured = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    );
  };

  const reportReview = (id: string) => {
    if (confirm("Report this review to Cloche trust & safety moderation team?")) {
      setReviews(
        reviews.map((r) => (r.id === id ? { ...r, isReported: true } : r))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-charcoal">Customer Reviews & Ratings</h2>
          <p className="text-xs text-charcoal/60 mt-1">
            Read verified bride feedback, post official vendor replies, and highlight featured testimonials.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#FAF7F2] p-3 rounded-2xl border border-gold/15">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <div>
            <span className="text-lg font-serif font-bold text-charcoal block leading-none">4.9 / 5.0</span>
            <span className="text-[10px] text-charcoal/50 font-bold">Based on 42 Verified Reviews</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className={`bg-white rounded-3xl border p-5 shadow-sm space-y-3 ${
              rev.isFeatured ? "border-gold/30 bg-[#FAF7F2]/30" : "border-gold/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F4C45] text-white font-serif font-bold text-sm flex items-center justify-center">
                  {rev.customerName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-charcoal">{rev.customerName}</h4>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-charcoal/50 ml-1.5">{rev.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(rev.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    rev.isFeatured
                      ? "bg-[#C8A96A] text-[#0F4C45]"
                      : "bg-gray-100 text-charcoal/60 hover:bg-gold/20"
                  }`}
                >
                  <Sparkles className="w-3 h-3" /> {rev.isFeatured ? "Featured" : "Feature"}
                </button>

                <button
                  onClick={() => reportReview(rev.id)}
                  className="p-1.5 rounded-lg text-charcoal/40 hover:text-rose-600 hover:bg-rose-50"
                  title="Report Fake Review"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-charcoal/80 leading-relaxed font-medium pl-1">
              "{rev.comment}"
            </p>

            {/* Existing Reply */}
            {rev.vendorReply && (
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-gold/15 space-y-1 text-xs ml-4">
                <div className="flex items-center gap-1.5 text-[#0F4C45] font-bold text-[11px]">
                  <CornerDownRight className="w-3.5 h-3.5" /> Official Vendor Response:
                </div>
                <p className="text-charcoal/80 pl-5 text-xs">{rev.vendorReply}</p>
              </div>
            )}

            {/* Reply Input Form */}
            {replyingToId === rev.id ? (
              <div className="pt-2 space-y-2 ml-4">
                <textarea
                  rows={2}
                  placeholder="Write an official vendor reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-gold/15 rounded-xl text-xs outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setReplyingToId(null)}
                    className="px-3 py-1.5 text-xs bg-gray-100 font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSendReply(rev.id)}
                    className="px-4 py-1.5 text-xs bg-[#0F4C45] text-white font-bold rounded-lg"
                  >
                    Post Reply
                  </button>
                </div>
              </div>
            ) : (
              !rev.vendorReply && (
                <button
                  onClick={() => {
                    setReplyingToId(rev.id);
                    setReplyText("");
                  }}
                  className="text-xs text-[#0F4C45] font-bold flex items-center gap-1 hover:underline cursor-pointer pt-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Reply to Review
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
