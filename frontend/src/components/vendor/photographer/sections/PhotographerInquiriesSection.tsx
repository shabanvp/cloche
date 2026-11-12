"use client";

import { useMemo, useState } from "react";
import { Calendar, Mail, MapPin, MessageSquare, Phone, Search, X } from "lucide-react";
import type { PhotographerLeadItem } from "../types";
import { formatInr, formatShortDate } from "../types";

const STATUS_OPTIONS: Array<"All" | "Pending" | PhotographerLeadItem["stage"]> = [
  "All",
  "Pending",
  "New",
  "Contacted",
  "Interested",
  "Follow-up Required",
  "Converted",
  "Lost",
];

const STATUS_STYLES: Record<PhotographerLeadItem["stage"], string> = {
  New: "bg-sky-50 text-sky-800 border-sky-200",
  Contacted: "bg-amber-50 text-amber-800 border-amber-200",
  Interested: "bg-[#C8A96A]/20 text-[#7C5C24] border-[#C8A96A]/40",
  "Follow-up Required": "bg-orange-50 text-orange-800 border-orange-200",
  Converted: "bg-[#0F4C45]/10 text-[#0F4C45] border-[#0F4C45]/30",
  Lost: "bg-stone-100 text-stone-600 border-stone-200",
};

interface Props {
  leads: PhotographerLeadItem[];
  onOpenConversation: (leadId: string) => void;
}

export function PhotographerInquiriesSection({ leads, onOpenConversation }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);

  const uniqueInquiries = useMemo(() => {
    const seen = new Set<string>();
    return leads.filter((l) => {
      if (!l.id || seen.has(l.id)) return false;
      seen.add(l.id);
      return true;
    });
  }, [leads]);

  const isPending = (l: PhotographerLeadItem) =>
    l.isUnread || l.stage === "New" || l.stage === "Follow-up Required";

  const pendingCount = useMemo(
    () => uniqueInquiries.filter(isPending).length,
    [uniqueInquiries]
  );

  const selectedInquiry = useMemo(
    () =>
      selectedInquiryId ? uniqueInquiries.find((i) => i.id === selectedInquiryId) || null : null,
    [uniqueInquiries, selectedInquiryId]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return uniqueInquiries.filter((inq) => {
      if (statusFilter === "Pending" && !isPending(inq)) return false;
      if (statusFilter !== "All" && statusFilter !== "Pending" && inq.stage !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        inq.customerName.toLowerCase().includes(q) ||
        inq.eventType.toLowerCase().includes(q) ||
        (inq.location || "").toLowerCase().includes(q) ||
        (inq.message || "").toLowerCase().includes(q)
      );
    });
  }, [uniqueInquiries, statusFilter, search]);

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#2B2523]">Inquiries</h2>
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6DDD0] bg-white px-3.5 py-1.5 text-xs font-medium text-[#5E544D] shadow-xs">
          <span>Pending Inquiries:</span>
          <span className="font-semibold text-[#2B2523]">{pendingCount}</span>
        </div>
      </div>

      {/* Compact Toolbar: Search + Single Status Dropdown */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A6F67] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or event..."
            aria-label="Search inquiries"
            className="w-full rounded-xl border border-[#E6DDD0] bg-white pl-9 pr-3 py-2 text-sm text-[#2B2523] placeholder:text-[#9A8F86] focus:outline-none focus:border-[#0F4C45]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter inquiries by status"
          className="sm:w-52 rounded-xl border border-[#E6DDD0] bg-white px-3 py-2 text-sm font-medium text-[#2B2523] focus:outline-none focus:border-[#0F4C45]"
        >
          {STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st === "All" ? "All Statuses" : st}
            </option>
          ))}
        </select>
      </div>

      {/* Empty State or Clean 6-Column Inquiries Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E6DDD0] bg-white py-8 px-4 text-center shadow-xs">
          <p className="text-sm font-medium text-[#5E544D]">
            {uniqueInquiries.length === 0 ? "No inquiries yet" : "No matching inquiries"}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet Clean Table */}
          <div className="hidden sm:block rounded-2xl border border-[#E6DDD0] bg-white shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#FAF7F2] border-b border-[#E6DDD0] text-[11px] font-semibold uppercase tracking-wider text-[#7A6F67]">
                  <tr>
                    <th className="py-3 px-4">Customer Name</th>
                    <th className="py-3 px-4">Event Type</th>
                    <th className="py-3 px-4">Event Date</th>
                    <th className="py-3 px-4">Inquiry Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE0] text-sm">
                  {filtered.map((inq) => (
                    <tr key={inq.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#2B2523] whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          {inq.customerName}
                          {inq.isUnread && (
                            <span className="h-2 w-2 rounded-full bg-[#C8A96A]" title="Unread" />
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#4A3F3A] whitespace-nowrap">
                        {inq.eventType}
                      </td>
                      <td className="py-3 px-4 text-[#5E544D] whitespace-nowrap text-xs">
                        {formatShortDate(inq.eventDate)}
                      </td>
                      <td className="py-3 px-4 text-[#5E544D] whitespace-nowrap text-xs">
                        {formatShortDate(inq.createdAt)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[inq.stage]}`}
                        >
                          {inq.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedInquiryId(inq.id)}
                          className="rounded-lg border border-[#E6DDD0] bg-white px-3 py-1.5 text-xs font-semibold text-[#2B2523] hover:border-[#0F4C45] hover:text-[#0F4C45] transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Compact List (<640px) */}
          <div className="sm:hidden space-y-2.5">
            {filtered.map((inq) => (
              <div
                key={inq.id}
                className="rounded-xl border border-[#E6DDD0] bg-white p-3.5 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#2B2523] truncate">
                      {inq.customerName}
                    </p>
                    <p className="text-xs text-[#7A6F67] mt-0.5">{inq.eventType}</p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[inq.stage]}`}
                  >
                    {inq.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#5E544D] pt-1 border-t border-[#F4EFE6]">
                  <div className="space-y-0.5">
                    <p>Event: {formatShortDate(inq.eventDate)}</p>
                    <p>Inquiry: {formatShortDate(inq.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedInquiryId(inq.id)}
                    className="rounded-lg border border-[#E6DDD0] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#2B2523]"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Inquiry Details Panel */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E6DDD0] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 bg-[#FAF7F2] border-b border-[#E6DDD0]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-semibold text-[#2B2523] truncate">
                    {selectedInquiry.customerName}
                  </h3>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[selectedInquiry.stage]}`}
                  >
                    {selectedInquiry.stage}
                  </span>
                </div>
                <p className="text-xs text-[#7A6F67] mt-0.5">
                  Inquiry Date: {formatShortDate(selectedInquiry.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiryId(null)}
                aria-label="Close inquiry"
                className="p-1.5 rounded-lg text-[#7A6F67] hover:bg-[#EDE6DA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Event & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <span className="text-[#7A6F67] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Event Type & Date
                  </span>
                  <p className="font-medium text-[#2B2523] mt-1">
                    {selectedInquiry.eventType} · {formatShortDate(selectedInquiry.eventDate)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <span className="text-[#7A6F67] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Event Location
                  </span>
                  <p className="font-medium text-[#2B2523] mt-1">
                    {selectedInquiry.location || "Not specified"}
                  </p>
                </div>
              </div>

              {/* Customer Requirements */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-1.5">
                  Customer Requirements
                </h4>
                <div className="rounded-xl border border-[#E6DDD0] bg-[#FAF7F2]/60 p-3 space-y-1.5 text-sm text-[#2B2523]">
                  {(selectedInquiry.estimatedBudget != null && selectedInquiry.estimatedBudget > 0) ||
                  (selectedInquiry.guestCount != null && selectedInquiry.guestCount > 0) ? (
                    <div className="flex flex-wrap gap-3 text-xs text-[#5E544D] pb-1.5 border-b border-[#EDE4D6]">
                      {selectedInquiry.estimatedBudget != null &&
                        selectedInquiry.estimatedBudget > 0 && (
                          <span>Estimated Budget: {formatInr(selectedInquiry.estimatedBudget)}</span>
                        )}
                      {selectedInquiry.guestCount != null && selectedInquiry.guestCount > 0 && (
                        <span>Guests: {selectedInquiry.guestCount}</span>
                      )}
                    </div>
                  ) : null}
                  <p>{selectedInquiry.message || selectedInquiry.latestMessage || "Availability & quotation inquiry."}</p>
                </div>
              </div>

              {/* Additional Message (when thread has a newer reply/message) */}
              {selectedInquiry.latestMessage &&
                selectedInquiry.latestMessage !== selectedInquiry.message && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-1.5">
                      Additional Message
                    </h4>
                    <div className="rounded-xl border border-[#E6DDD0] bg-[#FAF7F2]/60 p-3 text-sm text-[#2B2523]">
                      {selectedInquiry.latestMessage}
                    </div>
                  </div>
                )}

              {/* Contact Information (where available) */}
              {(selectedInquiry.customerPhone || selectedInquiry.customerEmail) && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-1.5">
                    Contact Information
                  </h4>
                  <div className="flex flex-wrap gap-3 rounded-xl bg-[#FAF7F2] px-3.5 py-2.5 text-xs text-[#2B2523]">
                    {selectedInquiry.customerPhone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#0F4C45]" />
                        {selectedInquiry.customerPhone}
                      </span>
                    )}
                    {selectedInquiry.customerEmail && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#0F4C45]" />
                        {selectedInquiry.customerEmail}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 bg-[#FAF7F2] border-t border-[#E6DDD0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedInquiryId(null)}
                className="rounded-lg border border-[#E6DDD0] bg-white px-3.5 py-1.5 text-xs font-medium text-[#5E544D] hover:text-[#2B2523]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = selectedInquiry.id;
                  setSelectedInquiryId(null);
                  onOpenConversation(id);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0C3D38]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
