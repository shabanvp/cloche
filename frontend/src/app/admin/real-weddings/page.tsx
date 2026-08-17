"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  CheckCircle2, XCircle, Trash2, Eye, ExternalLink, 
  Sparkles, Calendar, MapPin, Building2, AlertCircle, 
  Clock, Filter, Search, Loader2, BookHeart, Star, Flame
} from "lucide-react";
import { Button } from "@/components/Button";
import { RealWeddingStoryDb } from "@/lib/realWeddings";

export default function AdminRealWeddingsCMS() {
  const [stories, setStories] = useState<RealWeddingStoryDb[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending_review");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStory, setSelectedStory] = useState<RealWeddingStoryDb | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/real-weddings?status=${statusFilter}&limit=100`);
      const data = await res.json();
      if (data.success && Array.isArray(data.stories)) {
        setStories(data.stories);
      } else {
        setStories([]);
      }
    } catch (err) {
      console.error("Failed to load submissions:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Approve
  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/admin/real-weddings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Wedding story approved & published! 🎉");
        if (selectedStory?.id === id) {
          setSelectedStory((prev) => (prev ? { ...prev, status: "published" } : null));
        }
        fetchSubmissions();
      } else {
        alert(data.error?.message || "Failed to approve story.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Reject
  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/admin/real-weddings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "rejected",
          rejection_reason: rejectionReason.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("Wedding story marked as rejected.");
        setRejectionReason("");
        if (selectedStory?.id === id) {
          setSelectedStory((prev) => (prev ? { ...prev, status: "rejected" } : null));
        }
        fetchSubmissions();
      } else {
        alert(data.error?.message || "Failed to reject story.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Toggle Featured / Trending
  const handleToggleFlag = async (id: string, flag: "is_featured" | "is_trending", currentVal: boolean) => {
    try {
      const res = await fetch(`/api/v1/admin/real-weddings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [flag]: !currentVal }),
      });
      const data = await res.json();
      if (data.success) {
        setStories((prev) =>
          prev.map((s) => (s.id === id ? { ...s, [flag]: !currentVal } : s))
        );
        if (selectedStory?.id === id) {
          setSelectedStory((prev) => (prev ? { ...prev, [flag]: !currentVal } : null));
        }
        showToast(`Story updated.`);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this wedding story?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/v1/admin/real-weddings/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        showToast("Story deleted permanently.");
        if (selectedStory?.id === id) setSelectedStory(null);
        fetchSubmissions();
      } else {
        alert(data.error?.message || "Failed to delete story.");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStories = stories.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.title.toLowerCase().includes(q) ||
      (s.couple_names && s.couple_names.toLowerCase().includes(q)) ||
      (s.city && s.city.toLowerCase().includes(q)) ||
      (s.submitter_name && s.submitter_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 sm:p-8 space-y-6">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F4C45] text-white px-5 py-3 rounded-2xl shadow-xl border border-gold/30 flex items-center gap-2 animate-in slide-in-from-bottom-3 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-[#C8A96A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0F4C45] bg-[#0F4C45]/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
            EDITORIAL MODERATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-charcoal">
            Real Weddings Submissions
          </h1>
          <p className="text-xs text-charcoal/60">
            Review community and vendor submissions, verify real vendor credits, and publish to the public magazine.
          </p>
        </div>

        <Link
          href="/real-weddings"
          target="_blank"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0F4C45] bg-white border border-gold/30 px-4 py-2 rounded-full hover:bg-[#FAF7F2] transition-colors shadow-2xs"
        >
          <span>View Public Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Status Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {[
            { id: "pending_review", label: "Pending Review", icon: Clock },
            { id: "published", label: "Published", icon: CheckCircle2 },
            { id: "rejected", label: "Rejected", icon: XCircle },
            { id: "all", label: "All Submissions", icon: Filter },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setSelectedStory(null);
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-[#0F4C45] text-white shadow-xs"
                    : "bg-gray-50 text-charcoal/70 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, couple..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-8 pr-4 py-1.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
          />
        </div>
      </div>

      {/* Main Grid: List + Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Submissions Table / Cards (7 or 12 cols) */}
        <div className={selectedStory ? "lg:col-span-6 space-y-4" : "lg:col-span-12 space-y-4"}>
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-[#0F4C45] mx-auto" />
              <p className="text-xs text-charcoal/60 font-semibold">Loading submissions...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
              <BookHeart className="w-10 h-10 text-charcoal/30 mx-auto" />
              <h3 className="font-serif font-bold text-base text-charcoal">No submissions found</h3>
              <p className="text-xs text-charcoal/50">
                {statusFilter === "pending_review"
                  ? "No stories currently pending review."
                  : `No ${statusFilter} stories match your search.`}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden divide-y divide-gray-100">
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setSelectedStory(story)}
                  className={`p-4 hover:bg-gray-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    selectedStory?.id === story.id ? "bg-[#FAF7F2] border-l-4 border-[#0F4C45]" : ""
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={story.cover_image_url}
                      alt={story.title}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-gold/20"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            story.status === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : story.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {story.status.replace("_", " ")}
                        </span>
                        <span className="text-[10px] text-charcoal/50 font-medium">
                          {story.city || "Kerala"} • {story.style}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-charcoal line-clamp-1">
                        {story.title}
                      </h4>
                      <p className="text-[11px] text-charcoal/60">
                        {story.couple_names ? `Couple: ${story.couple_names} • ` : ""}
                        {story.vendor_credits?.length || 0} Vendor Credits
                      </p>
                    </div>
                  </div>

                  {/* Actions preview */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {story.status === "pending_review" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(story.id);
                        }}
                        disabled={actionLoading === story.id}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                      >
                        Approve
                      </button>
                    )}
                    <span className="text-xs text-charcoal/40 font-bold">Inspect →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Selected Story Detail Inspector (6 cols) */}
        {selectedStory && (
          <div className="lg:col-span-6 bg-white rounded-2xl border border-gold/25 shadow-lg p-6 space-y-6 animate-in fade-in duration-200 sticky top-24 max-h-[85vh] overflow-y-auto">
            
            {/* Inspector Header */}
            <div className="flex items-start justify-between border-b border-gray-100 pb-4">
              <div>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    selectedStory.status === "published"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedStory.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  Status: {selectedStory.status.replace("_", " ")}
                </span>
                <h3 className="font-serif font-bold text-lg text-charcoal mt-1 leading-snug">
                  {selectedStory.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="text-charcoal/40 hover:text-charcoal p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cover Image */}
            <div className="relative h-52 rounded-xl overflow-hidden border border-gold/20">
              <img src={selectedStory.cover_image_url} alt={selectedStory.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded">
                Cover Photo
              </div>
            </div>

            {/* Quick Metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF7F2] p-3.5 rounded-xl border border-gold/15">
              <div>
                <span className="text-charcoal/50 block font-medium">Couple:</span>
                <span className="font-bold text-charcoal">{selectedStory.couple_names || "N/A"}</span>
              </div>
              <div>
                <span className="text-charcoal/50 block font-medium">City / Location:</span>
                <span className="font-bold text-charcoal">{selectedStory.city || "N/A"}</span>
              </div>
              <div>
                <span className="text-charcoal/50 block font-medium">Date:</span>
                <span className="font-bold text-charcoal">{selectedStory.wedding_date || "N/A"}</span>
              </div>
              <div>
                <span className="text-charcoal/50 block font-medium">Style:</span>
                <span className="font-bold text-[#0F4C45]">{selectedStory.style}</span>
              </div>
              <div>
                <span className="text-charcoal/50 block font-medium">Submitter:</span>
                <span className="font-bold text-charcoal">{selectedStory.submitter_name || "Anonymous"}</span>
              </div>
              <div>
                <span className="text-charcoal/50 block font-medium">Email:</span>
                <span className="font-bold text-charcoal truncate block">{selectedStory.submitter_email || "N/A"}</span>
              </div>
            </div>

            {/* Full Story Narrative */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C45]">Story Narrative:</h4>
              <p className="text-xs text-charcoal/80 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100 whitespace-pre-line max-h-48 overflow-y-auto">
                {selectedStory.story_text}
              </p>
            </div>

            {/* Attached Verified Vendor Credits */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] flex items-center justify-between">
                <span>Verified Vendor Credits ({selectedStory.vendor_credits?.length || 0})</span>
              </h4>
              {selectedStory.vendor_credits && selectedStory.vendor_credits.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedStory.vendor_credits.map((vc, i) => (
                    <div
                      key={i}
                      className="bg-[#FAF7F2] p-2.5 rounded-xl border border-gold/15 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-[10px] font-bold uppercase text-[#0F4C45] block">{vc.role}</span>
                        <span className="font-extrabold text-charcoal">{vc.business_name || "Vendor"}</span>
                      </div>
                      <Link
                        href={`/boutiques/${vc.slug || vc.vendor_id}`}
                        target="_blank"
                        className="text-[10px] font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                      >
                        Profile <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-charcoal/50 italic">No vendor credits attached.</p>
              )}
            </div>

            {/* Gallery Photos Preview */}
            {selectedStory.gallery && selectedStory.gallery.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F4C45]">
                  Gallery Images ({selectedStory.gallery.length})
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {selectedStory.gallery.map((g, i) => (
                    <a key={i} href={g.url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden border border-gray-200 block">
                      <img src={g.url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Flags */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 text-xs">
              <button
                onClick={() => handleToggleFlag(selectedStory.id, "is_featured", selectedStory.is_featured)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  selectedStory.is_featured
                    ? "bg-[#C8A96A]/20 border-[#C8A96A] text-[#082F2C]"
                    : "bg-gray-50 border-gray-200 text-charcoal/60 hover:bg-gray-100"
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${selectedStory.is_featured ? "fill-current text-[#C8A96A]" : ""}`} />
                <span>Featured Cover</span>
              </button>

              <button
                onClick={() => handleToggleFlag(selectedStory.id, "is_trending", selectedStory.is_trending)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                  selectedStory.is_trending
                    ? "bg-red-50 border-red-300 text-red-800"
                    : "bg-gray-50 border-gray-200 text-charcoal/60 hover:bg-gray-100"
                }`}
              >
                <Flame className={`w-3.5 h-3.5 ${selectedStory.is_trending ? "fill-current text-red-500" : ""}`} />
                <span>Trending</span>
              </button>

              {selectedStory.status === "published" && (
                <Link
                  href={`/real-weddings/${selectedStory.slug}`}
                  target="_blank"
                  className="ml-auto text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                >
                  <span>View Live</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>

            {/* Moderation Actions */}
            <div className="space-y-3 pt-3 border-t border-gray-100">
              {selectedStory.status === "pending_review" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleApprove(selectedStory.id)}
                    disabled={actionLoading === selectedStory.id}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Publish</span>
                  </button>

                  <button
                    onClick={() => handleReject(selectedStory.id)}
                    disabled={actionLoading === selectedStory.id}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Submission</span>
                  </button>
                </div>
              )}

              {selectedStory.status === "published" && (
                <button
                  onClick={() => handleReject(selectedStory.id)}
                  disabled={actionLoading === selectedStory.id}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Unpublish / Mark Rejected
                </button>
              )}

              {selectedStory.status === "rejected" && (
                <button
                  onClick={() => handleApprove(selectedStory.id)}
                  disabled={actionLoading === selectedStory.id}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Re-Approve &amp; Publish
                </button>
              )}

              <button
                onClick={() => handleDelete(selectedStory.id)}
                disabled={actionLoading === selectedStory.id}
                className="w-full py-2 bg-gray-100 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Story Permanently</span>
              </button>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
