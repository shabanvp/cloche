"use client";

import { useState } from "react";
import { Calendar, Mail, MapPin, MessageSquare, Phone, Search, X } from "lucide-react";
import type { PhotographerLeadItem } from "../types";
import { formatInr, formatShortDate } from "../types";

const STAGES: Array<PhotographerLeadItem["stage"]> = [
  "New",
  "Contacted",
  "Interested",
  "Follow-up Required",
  "Converted",
  "Lost",
];

const STAGE_STYLES: Record<PhotographerLeadItem["stage"], string> = {
  New: "bg-sky-50 text-sky-800 border-sky-200",
  Contacted: "bg-amber-50 text-amber-800 border-amber-200",
  Interested: "bg-[#C8A96A]/20 text-[#7C5C24] border-[#C8A96A]/40",
  "Follow-up Required": "bg-orange-50 text-orange-800 border-orange-200",
  Converted: "bg-[#0F4C45]/10 text-[#0F4C45] border-[#0F4C45]/30",
  Lost: "bg-stone-100 text-stone-600 border-stone-200",
};

interface Props {
  leads: PhotographerLeadItem[];
  onRefresh: () => Promise<void>;
  onOpenConversation: (leadId: string) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerLeadsSection({
  leads,
  onRefresh,
  onOpenConversation,
  showToast,
}: Props) {
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("All");
  const [selectedLead, setSelectedLead] = useState<PhotographerLeadItem | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const filtered = leads.filter((l) => {
    if (stageFilter !== "All" && l.stage !== stageFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.customerName.toLowerCase().includes(q) ||
      l.customerEmail.toLowerCase().includes(q) ||
      l.customerPhone.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.eventType.toLowerCase().includes(q)
    );
  });

  const handleStageChange = async (leadId: string, stage: PhotographerLeadItem["stage"]) => {
    setSavingId(leadId);
    try {
      const res = await fetch("/api/vendor/photographer/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ leadId, stage }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update lead stage");
      await onRefresh();
      if (selectedLead?.id === leadId) {
        setSelectedLead((prev) => (prev ? { ...prev, stage } : null));
      }
      showToast(`Lead marked as ${stage}`, "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to update lead stage", "error");
    } finally {
      setSavingId(null);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteInput.trim()) return;
    setSavingId(selectedLead.id);
    try {
      const res = await fetch("/api/vendor/photographer/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ leadId: selectedLead.id, note: noteInput.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save note");
      setNoteInput("");
      await onRefresh();
      const updated = (json.data || []).find((x: PhotographerLeadItem) => x.id === selectedLead.id);
      if (updated) setSelectedLead(updated);
      showToast("Lead note saved", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to save note", "error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">Leads Management</h2>
          <p className="text-xs text-[#7A6F67] mt-0.5">
            Track wedding photography prospects without duplicate threads
          </p>
        </div>
        <div className="text-xs font-medium text-[#5E544D] bg-white border border-[#E6DDD0] rounded-xl px-3.5 py-2">
          Total Active Leads: <span className="font-semibold text-[#2B2523]">{leads.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#7A6F67] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, city, or event..."
            className="w-full rounded-xl border border-[#E6DDD0] bg-white pl-10 pr-4 py-2.5 text-sm text-[#2B2523] focus:outline-none focus:border-[#0F4C45]"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["All", ...STAGES].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStageFilter(st)}
              className={`shrink-0 rounded-xl px-3 py-2 text-xs font-medium border transition-colors ${
                stageFilter === st
                  ? "bg-[#2B2523] text-white border-[#2B2523]"
                  : "bg-white text-[#5E544D] border-[#E6DDD0] hover:border-[#C8A96A]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
          <p className="text-sm font-medium text-[#2B2523]">No matching leads found</p>
          <p className="text-xs text-[#7A6F67] mt-1">
            When couples contact or message you from your photographer storefront, their lead appears here automatically.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E6DDD0] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#FAF7F2] border-b border-[#E6DDD0] text-[11px] font-semibold uppercase tracking-wider text-[#7A6F67]">
                <tr>
                  <th className="py-3.5 px-4">Couple / Client</th>
                  <th className="py-3.5 px-4">Event & Location</th>
                  <th className="py-3.5 px-4">Inquiry Date</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EAE0] text-sm">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#2B2523]">{lead.customerName}</span>
                        {lead.isUnread && (
                          <span className="h-2 w-2 rounded-full bg-[#C8A96A]" title="Unread reply" />
                        )}
                      </div>
                      <div className="text-xs text-[#7A6F67] mt-0.5 space-y-0.5">
                        {lead.customerPhone && <div>{lead.customerPhone}</div>}
                        {lead.customerEmail && <div>{lead.customerEmail}</div>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-medium text-[#2B2523]">{lead.eventType}</div>
                      <div className="text-xs text-[#7A6F67] mt-0.5">
                        Event: {formatShortDate(lead.eventDate)}
                        {lead.location ? ` · ${lead.location}` : ""}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 align-top text-xs text-[#5E544D]">
                      {formatShortDate(lead.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <select
                        disabled={savingId === lead.id}
                        value={lead.stage}
                        onChange={(e) =>
                          handleStageChange(lead.id, e.target.value as PhotographerLeadItem["stage"])
                        }
                        aria-label={`Update status for ${lead.customerName}`}
                        className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium focus:outline-none ${
                          STAGE_STYLES[lead.stage]
                        }`}
                      >
                        {STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4 align-top text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedLead(lead)}
                        className="rounded-lg border border-[#E6DDD0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#2B2523] hover:border-[#C8A96A]"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenConversation(lead.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#0F4C45] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#0C3D38]"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Chat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E6DDD0] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 bg-[#FAF7F2] border-b border-[#E6DDD0]">
              <div>
                <h3 className="font-serif text-xl font-semibold text-[#2B2523]">
                  {selectedLead.customerName}
                </h3>
                <p className="text-xs text-[#7A6F67]">{selectedLead.eventType}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg text-[#7A6F67] hover:bg-[#EDE6DA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <span className="text-[#7A6F67] flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </span>
                  <p className="font-medium text-[#2B2523] mt-1">
                    {selectedLead.customerPhone || "Not provided"}
                  </p>
                </div>
                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <span className="text-[#7A6F67] flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </span>
                  <p className="font-medium text-[#2B2523] mt-1 truncate">
                    {selectedLead.customerEmail || "Not provided"}
                  </p>
                </div>
                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <span className="text-[#7A6F67] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Event Date
                  </span>
                  <p className="font-medium text-[#2B2523] mt-1">
                    {formatShortDate(selectedLead.eventDate)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <span className="text-[#7A6F67] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Location / Budget
                  </span>
                  <p className="font-medium text-[#2B2523] mt-1">
                    {selectedLead.location || "TBD"} ·{" "}
                    {selectedLead.estimatedBudget ? formatInr(selectedLead.estimatedBudget) : "Flexible"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-1.5">
                  Inquiry Requirements
                </h4>
                <div className="rounded-xl border border-[#E6DDD0] bg-[#FAF7F2]/60 p-3.5 text-sm text-[#2B2523]">
                  {selectedLead.message || selectedLead.latestMessage || "Direct inquiry via Cloche."}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-2">
                  Internal Studio Notes
                </h4>
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add private note (quoted pricing, preferences)..."
                    className="flex-1 rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs text-[#2B2523] focus:outline-none focus:border-[#0F4C45]"
                  />
                  <button
                    type="submit"
                    disabled={savingId === selectedLead.id || !noteInput.trim()}
                    className="rounded-xl bg-[#2B2523] px-3.5 py-2 text-xs font-medium text-white disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </form>

                {selectedLead.notes.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {selectedLead.notes.map((n) => (
                      <div key={n.id} className="rounded-lg bg-[#FAF7F2] px-3 py-2 text-xs text-[#2B2523]">
                        <p>{n.note_text}</p>
                        <p className="text-[10px] text-[#7A6F67] mt-1">
                          {formatShortDate(n.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-[#FAF7F2] border-t border-[#E6DDD0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="text-xs font-medium text-[#7A6F67] hover:text-[#2B2523]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = selectedLead.id;
                  setSelectedLead(null);
                  onOpenConversation(id);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0C3D38]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Open Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

