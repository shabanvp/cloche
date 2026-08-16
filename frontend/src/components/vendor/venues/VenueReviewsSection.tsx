"use client";

import { useState } from "react";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  Building2,
  Calendar,
  ThumbsUp,
  Sparkles,
  Award,
  Send
} from "lucide-react";
import { VendorModal } from "@/components/vendor/VendorModal";
import { showVendorToast } from "@/lib/vendorStore";

export interface VenueReviewItem {
  id: string;
  author: string;
  hallBooked: string;
  rating: number;
  weddingDate: string;
  text: string;
  vendorReply?: string;
  isFeatured?: boolean;
}

const INITIAL_REVIEWS: VenueReviewItem[] = [
  {
    id: "REV-1",
    author: "Ananya & Rahul Menon",
    hallBooked: "Grand Royal Ballroom",
    rating: 5,
    weddingDate: "October 2026",
    text: "We hosted our 1,200 guest wedding reception here and everything was absolutely flawless! The centralized AC kept everyone cool despite the crowd, the chandeliers looked royal in our photos, and the attached bridal suite was so spacious and comfortable. Suresh and his banquet team coordinated with our decorators smoothly.",
    vendorReply: "Thank you so much Ananya & Rahul! It was a true pleasure hosting your grand celebration. Wishing you both a lifetime of happiness! ✨",
    isFeatured: true,
  },
  {
    id: "REV-2",
    author: "Dr. Deepak George",
    hallBooked: "Emerald Palm Lawn",
    rating: 5,
    weddingDate: "September 2026",
    text: "The outdoor lawn is breathtaking for evening weddings. Our guests loved the open green atmosphere and the live catering layout. The heavy power backup kept all decorative lighting and sound uninterrupted throughout the night.",
    isFeatured: true,
  },
  {
    id: "REV-3",
    author: "Pooja & Siddharth Varma",
    hallBooked: "Sunset Poolside Deck",
    rating: 5,
    weddingDate: "August 2026",
    text: "Perfect spot for our Haldi and Cocktail party! The sunset views over the infinity pool made our photos look magical. Staff were very courteous and helpful with valet parking management.",
    vendorReply: "Thank you Pooja! The deck looked vibrant with your floral themes. Glad you enjoyed the experience!",
  },
];

export function VenueReviewsSection() {
  const [reviews, setReviews] = useState<VenueReviewItem[]>(INITIAL_REVIEWS);
  const [replyingReview, setReplyingReview] = useState<VenueReviewItem | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleToggleFeatured = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    );
    showVendorToast("Featured status updated for storefront! ⭐", "success");
  };

  const handleSaveReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingReview || !replyText.trim()) return;

    setReviews((prev) =>
      prev.map((r) => (r.id === replyingReview.id ? { ...r, vendorReply: replyText.trim() } : r))
    );
    setReplyingReview(null);
    setReplyText("");
    showVendorToast("Official venue response posted! 💬", "success");
  };

  const averageRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold/15 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#0F4C45]/10 text-[#0F4C45]">
              <Star className="w-5 h-5 fill-[#C8A96A] text-[#C8A96A]" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-charcoal">Customer Reviews & Ratings</h2>
          </div>
          <p className="text-xs text-charcoal/60 mt-1">
            Review verified couple feedback, publish official responses, and feature testimonials on your public storefront.
          </p>
        </div>

        <div className="bg-[#FAF7F2] px-5 py-3 rounded-2xl border border-gold/20 flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Average Rating</span>
            <span className="font-serif font-bold text-2xl text-[#0F4C45] flex items-center gap-1">
              {averageRating} <Star className="w-5 h-5 fill-[#C8A96A] text-[#C8A96A]" />
            </span>
          </div>
          <div className="h-8 w-px bg-gold/20" />
          <div>
            <span className="text-[10px] uppercase font-bold text-charcoal/50 block">Verified Reviews</span>
            <span className="font-serif font-bold text-2xl text-charcoal">{reviews.length}</span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-gold/15 shadow-sm space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gold/10 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-serif font-bold text-base text-charcoal">{rev.author}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Verified Couple
                  </span>
                </div>
                <span className="text-xs text-charcoal/60 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#0F4C45]" /> {rev.hallBooked} • {rev.weddingDate}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8A96A] text-[#C8A96A]" />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFeatured(rev.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    rev.isFeatured
                      ? "bg-[#0F4C45] text-white shadow-2xs"
                      : "bg-[#FAF7F2] text-charcoal/60 border border-gold/15 hover:border-[#0F4C45]"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#C8A96A]" />
                  <span>{rev.isFeatured ? "Featured" : "Feature on Store"}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-charcoal/80 leading-relaxed font-sans">{rev.text}</p>

            {/* Official Response */}
            {rev.vendorReply ? (
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0F4C45] flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Official Venue Response
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingReview(rev);
                      setReplyText(rev.vendorReply || "");
                    }}
                    className="text-[10px] text-[#0F4C45] hover:underline font-bold"
                  >
                    Edit Reply
                  </button>
                </div>
                <p className="text-charcoal/80 leading-relaxed italic">{rev.vendorReply}</p>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyingReview(rev);
                    setReplyText("");
                  }}
                  className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Write Official Reply to Couple</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      <VendorModal
        isOpen={Boolean(replyingReview)}
        onClose={() => setReplyingReview(null)}
        title="Reply to Couple Review"
        subtitle={replyingReview ? `Replying to review by ${replyingReview.author}` : ""}
        maxWidth="md"
        footer={
          <>
            <button
              type="button"
              onClick={() => setReplyingReview(null)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-charcoal/60 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="reply-venue-review-form"
              className="bg-[#0F4C45] hover:bg-[#072B27] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Post Official Reply</span>
            </button>
          </>
        }
      >
        <form id="reply-venue-review-form" onSubmit={handleSaveReply} className="space-y-3 text-xs font-sans">
          <p className="text-charcoal/70 bg-[#FAF7F2] p-3 rounded-xl border border-gold/15 italic">
            "{replyingReview?.text}"
          </p>

          <div>
            <label className="block text-xs font-bold text-charcoal/80 mb-1">Your Official Response</label>
            <textarea
              rows={4}
              placeholder="Thank the couple and mention your pleasure in hosting their wedding..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
              className="w-full bg-[#FAF7F2] border border-gold/20 rounded-xl p-3 text-xs text-charcoal font-medium focus:outline-none focus:border-[#0F4C45] resize-none leading-relaxed"
            />
          </div>
        </form>
      </VendorModal>
    </div>
  );
}
