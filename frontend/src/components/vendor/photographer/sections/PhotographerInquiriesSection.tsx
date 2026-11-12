"use client";

import { Calendar, MapPin, MessageSquare, Sparkles } from "lucide-react";
import type { PhotographerLeadItem } from "../types";
import { formatShortDate } from "../types";

interface Props {
  leads: PhotographerLeadItem[];
  onOpenConversation: (leadId: string) => void;
}

export function PhotographerInquiriesSection({ leads, onOpenConversation }: Props) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">
            Customer Inquiries
          </h2>
          <p className="text-xs text-[#7A6F67] mt-0.5">
            Review event details, notes, and jump straight into any client conversation
          </p>
        </div>
        <span className="rounded-xl bg-white border border-[#E6DDD0] px-3.5 py-2 text-xs font-medium text-[#5E544D]">
          {leads.filter((l) => l.isUnread).length} Unread Inquiries
        </span>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-12 text-center">
          <Sparkles className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
          <p className="text-sm font-medium text-[#2B2523]">No inquiries received yet</p>
          <p className="text-xs text-[#7A6F67] mt-1">
            Customer requests sent via Contact Photographer or Message appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {leads.map((inq) => (
            <div
              key={inq.id}
              className="rounded-2xl border border-[#E6DDD0] bg-white p-5 flex flex-col justify-between gap-4 hover:border-[#C8A96A] transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base text-[#2B2523]">
                        {inq.customerName}
                      </h3>
                      {inq.isUnread && (
                        <span className="rounded-full bg-[#C8A96A]/20 px-2 py-0.5 text-[10px] font-semibold text-[#7C5C24]">
                          New Message
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A6F67] mt-0.5">
                      Received {formatShortDate(inq.createdAt)} · Stage: {inq.stage}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-[#5E544D]">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE6DA]">
                    <Calendar className="w-3.5 h-3.5 text-[#0F4C45]" />
                    {formatShortDate(inq.eventDate)}
                  </span>
                  {inq.location && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-[#FAF7F2] px-2.5 py-1 border border-[#EDE6DA]">
                      <MapPin className="w-3.5 h-3.5 text-[#C8A96A]" />
                      {inq.location}
                    </span>
                  )}
                </div>

                <div className="rounded-xl bg-[#FAF7F2] p-3.5 text-sm text-[#2B2523] border border-[#F0EAE0]">
                  {inq.latestMessage || inq.message || "Customer requested studio availability & quote."}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F0EAE0]">
                <span className="text-xs text-[#7A6F67]">
                  {inq.messageCount} message{inq.messageCount === 1 ? "" : "s"} in thread
                </span>
                <button
                  type="button"
                  onClick={() => onOpenConversation(inq.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0C3D38]"
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

