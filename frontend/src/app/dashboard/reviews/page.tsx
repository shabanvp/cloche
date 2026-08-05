"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Trash2, Plus, AlertCircle } from "lucide-react";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [eligibleVendors, setEligibleVendors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [rating, setRating] = useState("5");
  const [reviewText, setReviewText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/customer/reviews", { cache: "no-store" }).then((r) => r.json());
      if (res.success) {
        setReviews(res.data || []);
        setEligibleVendors(res.eligibleVendors || []);
        if (res.eligibleVendors && res.eligibleVendors.length > 0) {
          setSelectedVendorId(res.eligibleVendors[0].id);
        }
      }
    } catch (e) {
      console.error("Failed to fetch customer reviews:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!selectedVendorId || !reviewText) {
      setErrorMessage("Please select a vendor and provide review comments.");
      return;
    }

    try {
      const res = await fetch("/api/v1/customer/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_id: selectedVendorId,
          rating: Number(rating),
          review: reviewText,
        }),
      }).then((r) => r.json());

      if (res.success) {
        setShowReviewModal(false);
        setReviewText("");
        fetchReviews();
        alert("Review published successfully!");
      } else {
        setErrorMessage(res.error?.message || "Failed to submit review.");
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Server error.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await fetch(`/api/v1/customer/reviews?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-gold/10 pb-4">
        <div>
          <h1 className="font-display text-2xl text-charcoal font-medium">My Reviews & Ratings</h1>
          <p className="text-xs text-charcoal/60 mt-1">Share feedback for vendors you have interacted with.</p>
        </div>
        <button
          onClick={() => setShowReviewModal(true)}
          className="bg-emerald hover:bg-gold text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" /> Write Review
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl"></div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white p-5 rounded-2xl border border-gold/10 shadow-sm space-y-2 relative">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-charcoal">
                  {rev.vendors?.name || rev.vendors?.boutique_name || rev.vendor_name || "Vendor Review"}
                </h3>
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Number(rev.rating) ? "fill-gold text-gold" : "text-gray-300"}`} />
                  ))}
                </div>
              </div>

              <p className="text-xs text-charcoal/80 leading-relaxed">{rev.review}</p>
              <span className="text-[10px] text-charcoal/50 block pt-1">
                Published on {new Date(rev.created_at || Date.now()).toLocaleDateString()}
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
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 shadow-sm space-y-3">
          <Star className="w-12 h-12 text-gold mx-auto opacity-50" />
          <h3 className="text-lg font-display text-charcoal">No published reviews yet</h3>
          <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
            Review vendors you have submitted inquiries to or received quotes from.
          </p>
          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-block bg-emerald text-white px-5 py-2 rounded-full text-xs font-semibold mt-2"
          >
            Write First Review
          </button>
        </div>
      )}

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gold/10">
            <h3 className="font-display text-xl font-medium text-charcoal mb-4">Write a Vendor Review</h3>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-charcoal block mb-1">Select Vendor (Interacted Only)</label>
                {eligibleVendors.length > 0 ? (
                  <select
                    value={selectedVendorId}
                    onChange={(e) => setSelectedVendorId(e.target.value)}
                    className="w-full bg-ivory/50 border border-gold/10 rounded-xl px-3 py-2 text-xs text-charcoal"
                  >
                    {eligibleVendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name || v.boutique_name || "Vendor"} ({v.category || "Vendor"})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    You have not submitted inquiries or received quotations from any vendor yet. Submit an inquiry first to leave a verified review.
                  </p>
                )}
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
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-charcoal/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={eligibleVendors.length === 0}
                  className="bg-emerald text-white px-5 py-2 rounded-xl font-semibold text-xs shadow-sm hover:bg-gold transition-colors disabled:opacity-50"
                >
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
