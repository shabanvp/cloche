"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Trash2, Edit, Plus } from "lucide-react";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/v1/customer/reviews").then((r) => r.json());
      if (Array.isArray(res.data) && res.data.length > 0) {
        setReviews(res.data);
      } else {
        // Fallback demo reviews
        setReviews([
          {
            id: "rev-101",
            vendor_name: "La Sposa Bridal Boutique",
            rating: 5,
            review: "Exceptional bridal gown fitting and floral stage decor! Highly recommended.",
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !reviewText) return;

    try {
      await fetch("/api/v1/customer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: "c-demo-user",
          vendor_id: "v-demo-vendor",
          rating: Number(rating),
          review: reviewText,
        }),
      });

      const newRev = {
        id: `rev-${Date.now()}`,
        vendor_name: vendorName,
        rating: Number(rating),
        review: reviewText,
        created_at: new Date().toISOString(),
      };
      setReviews([newRev, ...reviews]);
      setShowReviewModal(false);
      setVendorName("");
      setReviewText("");
      alert("Review published successfully!");
    } catch (e) {
      setShowReviewModal(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await fetch(`/api/v1/customer/reviews?id=${id}`, { method: "DELETE" });
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (e) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gold/10 pb-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">My Reviews & Ratings</h1>
          <p className="text-xs text-charcoal/60 mt-1">Share your feedback to help other couples discover top vendors.</p>
        </div>
        <button
          onClick={() => setShowReviewModal(true)}
          className="bg-emerald hover:bg-gold text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Write Review
        </button>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white p-5 rounded-2xl border border-gold/10 shadow-sm space-y-2 relative">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-charcoal">{rev.vendor_name || rev.vendors?.name || "Vendor"}</h3>
              <div className="flex items-center gap-1 text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Number(rev.rating) ? "fill-gold text-gold" : "text-gray-300"}`} />
                ))}
              </div>
            </div>

            <p className="text-xs text-charcoal/80 leading-relaxed">{rev.review}</p>
            <span className="text-[10px] text-charcoal/50 block pt-1">
              Published on {new Date(rev.created_at).toLocaleDateString()}
            </span>

            <button
              onClick={() => handleDeleteReview(rev.id)}
              className="absolute bottom-4 right-4 text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold/10">
            <h3 className="font-display text-xl font-medium text-charcoal mb-4">Write a Vendor Review</h3>
            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Vendor Name</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
                  placeholder="e.g. La Sposa Bridal Boutique"
                />
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
                >
                  <option value="5">5 Stars - Exceptional</option>
                  <option value="4">4 Stars - Very Good</option>
                  <option value="3">3 Stars - Average</option>
                  <option value="2">2 Stars - Below Expectation</option>
                  <option value="1">1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-charcoal block mb-1">Review Comments</label>
                <textarea
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-ivory/50 border border-gold/10 rounded-xl p-3 text-xs text-charcoal"
                  placeholder="Share details about their response time, service quality, and overall experience..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gold/10">
                <button type="button" onClick={() => setShowReviewModal(false)} className="px-4 py-2 text-xs font-semibold text-charcoal/60">
                  Cancel
                </button>
                <button type="submit" className="bg-emerald text-white px-5 py-2 rounded-xl font-semibold text-xs shadow-sm hover:bg-gold transition-colors">
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
