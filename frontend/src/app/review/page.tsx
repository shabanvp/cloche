"use client";

import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Star, CheckCircle2, Send, Store, User, Calendar, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/Button";

export default function WriteReviewPage() {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const [formData, setFormData] = useState({
    vendorCategory: "Boutiques & Bridal Wear",
    vendorName: "",
    reviewerName: "",
    reviewerEmail: "",
    eventDate: "",
    reviewTitle: "",
    reviewBody: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between">
      <main className="flex-1 pb-24">
        {/* Header Hero */}
        <div className="bg-charcoal text-white py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-gold/20 text-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              Community Reviews
            </span>
            <h1 className="text-3xl md:text-5xl font-display mb-4 leading-tight">Write a Vendor Review</h1>
            <p className="text-white/70 max-w-xl mx-auto text-sm md:text-base font-light">
              Share your personal experience to help future brides and couples discover trusted wedding experts across Kerala.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {status === "success" ? (
            <div className="bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-gold/20 text-center space-y-6 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-display text-charcoal">Thank You for Your Review!</h2>
              <p className="text-charcoal/70 text-sm max-w-md mx-auto leading-relaxed">
                Your review for <strong className="text-charcoal">{formData.vendorName || "the vendor"}</strong> has been submitted successfully and will be published after verification.
              </p>
              <div className="pt-4">
                <Button 
                  onClick={() => {
                    setStatus("idle");
                    setFormData({
                      vendorCategory: "Boutiques & Bridal Wear",
                      vendorName: "",
                      reviewerName: "",
                      reviewerEmail: "",
                      eventDate: "",
                      reviewTitle: "",
                      reviewBody: "",
                    });
                  }} 
                  className="bg-emerald text-white rounded-full px-8 py-3 font-semibold"
                >
                  Write Another Review
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gold/15 space-y-8">
              
              {/* Category & Vendor Name */}
              <div className="space-y-6">
                <h3 className="font-display text-xl text-charcoal border-b border-gold/10 pb-3 flex items-center gap-2">
                  <Store className="w-5 h-5 text-gold" /> Vendor Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">Category</label>
                    <select
                      value={formData.vendorCategory}
                      onChange={(e) => setFormData({ ...formData, vendorCategory: e.target.value })}
                      className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-emerald"
                    >
                      <option>Boutiques & Bridal Wear</option>
                      <option>Wedding Venues & Convention Centers</option>
                      <option>Photographers & Videographers</option>
                      <option>Makeup & Hair Artists</option>
                      <option>Catering & Feasts</option>
                      <option>Decor & Event Planners</option>
                      <option>Mehendi Artists</option>
                      <option>Invitations & Gifts</option>
                      <option>Jewellery & Accessories</option>
                      <option>Groom Wear</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">Vendor or Boutique Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Label M Bridal Boutique, Kochi"
                      value={formData.vendorName}
                      onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                      className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-emerald"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Section */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70">Overall Rating *</label>
                <div className="flex items-center gap-2 bg-[#F4F1EA] p-4 rounded-2xl w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoverRating || rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-charcoal/20"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 font-semibold text-sm text-charcoal">
                    {rating} out of 5 stars
                  </span>
                </div>
              </div>

              {/* Review Title & Body */}
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">Review Headline *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Exceptional service and stunning bridal outfit!"
                    value={formData.reviewTitle}
                    onChange={(e) => setFormData({ ...formData, reviewTitle: e.target.value })}
                    className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-emerald"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">Your Review *</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your experience with this vendor, quality of service, punctuality, and overall satisfaction..."
                    value={formData.reviewBody}
                    onChange={(e) => setFormData({ ...formData, reviewBody: e.target.value })}
                    className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-emerald"
                  />
                </div>
              </div>

              {/* Reviewer Details */}
              <div className="space-y-6 border-t border-gold/10 pt-6">
                <h3 className="font-display text-xl text-charcoal flex items-center gap-2">
                  <User className="w-5 h-5 text-gold" /> Your Contact Info
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">Your Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="Anjali Menon"
                      value={formData.reviewerName}
                      onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
                      className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">Email Address *</label>
                    <input
                      required
                      type="email"
                      placeholder="anjali@gmail.com"
                      value={formData.reviewerEmail}
                      onChange={(e) => setFormData({ ...formData, reviewerEmail: e.target.value })}
                      className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-emerald"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/70 mb-2">Event Date</label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-[#F4F1EA] border border-outline/20 rounded-xl p-3.5 text-sm text-charcoal focus:outline-none focus:border-emerald"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-emerald text-white py-4 rounded-xl font-semibold tracking-wide uppercase hover:bg-emerald/90 transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald/20 text-sm"
                >
                  {status === "loading" ? "Submitting Review..." : "Submit Review"} <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
