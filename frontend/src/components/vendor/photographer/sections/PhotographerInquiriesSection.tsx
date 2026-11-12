"use client";

import { useState } from "react";
import { Calendar, Mail, MapPin, MessageSquare, Phone, Sparkles } from "lucide-react";
import type { PhotographerLeadItem } from "../types";
import { formatInr, formatShortDate } from "../types";

interface Props {
  leads: PhotographerLeadItem[];
  onOpenConversation: (leadId: string) => void;
}

export function PhotographerInquiriesSection({ leads, onOpenConversation }: Props) {
  const [filterMode, setFilterMode] = useState<"all" | "pending">("all");

  const isPending = (l: PhotographerLeadItem) =>
    l.isUnread || l.stage === "New" || l.stage === "Follow-up Required";

  const pendingCount = leads.filter(isPending).length;
  const displayed = filterMode === "pending" ? leads.filter(isPending) : leads;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#26201D]">
            Customer Inquiries
          </h2>
          <p className="text-xs text-[#7A6B5F] mt-0.5">
            Review event details, couple notes, and jump straight into any client conversation
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-[#E5DAC8] bg-white p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilterMode("all")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filterMode === "all"
                ? "bg-[#26201D] text-[#FAF7F2]"
                : "text-[#6C5E53] hover:text-[#26201D]"
            }`}
          >
            All ({leads.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterMode("pending")}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              filterMode === "pending"
                ? "bg-[#6E4F3A] text-white"
                : "text-[#6C5E53] hover:text-[#26201D]"
            }`}
          >
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DFD5C7] bg-white p-12 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
          <p className="text-sm font-medium text-[#26201D]">
            {filterMode === "pending" ? "No pending inquiries right now" : "No inquiries received yet"}
          </p>
          <p className="text-xs text-[#7A6B5F] mt-1">
            Customer requests sent via Contact Photographer appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((inq) => (
            <div
              key={inq.id}
              className="rounded-2xl border border-[#E5DAC8] bg-white p-5 flex flex-col justify-between gap-4 hover:border-[#C8A96A] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-serif font-semibold text-base text-[#26201D]">
                        {inq.customerName}
                      </h3>
                      {isPending(inq) && (
                        <span className="rounded-full bg-[#C8A96A]/20 px-2 py-0.5 text-[10px] font-semibold text-[#7C5C24]">
                          {inq.isUnread ? "Unread Message" : inq.stage}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A6B5F] mt-0.5">
                      Received {formatShortDate(inq.createdAt)} · Stage: {inq.stage}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-[#5E544D]">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE4D6]">
                    <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" />
                    {inq.eventType} · {formatShortDate(inq.eventDate)}
                  </span>
                  {inq.location && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE4D6]">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" />
                      {inq.location}
                    </span>
                  )}
                  {inq.estimatedBudget != null && inq.estimatedBudget > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE4D6]">
                      Budget: {formatInr(inq.estimatedBudget)}
                    </span>
                  )}
                </div>

                {(inq.customerPhone || inq.customerEmail) && (
                  <div className="flex flex-wrap gap-3 text-[11px] text-[#6C5E53]">
                    {inq.customerPhone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#6E4F3A]" /> {inq.customerPhone}
                      </span>
                    )}
                    {inq.customerEmail && (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#6E4F3A]" /> {inq.customerEmail}
                      </span>
                    )}
                  </div>
                )}

                <div className="rounded-xl bg-[#FAF7F2] p-3.5 text-sm text-[#26201D] border border-[#EDE4D6]">
                  {inq.latestMessage || inq.message || "Customer requested studio availability & quote."}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE0]">
                <span className="text-xs text-[#7A6B5F]">
                  {inq.messageCount} message{inq.messageCount === 1 ? "" : "s"} in thread
                </span>
                <button
                  type="button"
                  onClick={() => onOpenConversation(inq.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0B3A35] transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Open Conversation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
