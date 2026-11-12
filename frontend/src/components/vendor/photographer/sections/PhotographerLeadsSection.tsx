"use client";

import { useMemo, useState } from "react";
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
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [localStageOverrides, setLocalStageOverrides] = useState<Record<string, PhotographerLeadItem["stage"]>>({});

  const uniqueLeads = useMemo(() => {
    const seen = new Set<string>();
    return leads
      .filter((l) => {
        if (!l.id || seen.has(l.id)) return false;
        seen.add(l.id);
        return true;
      })
      .map((l) => (localStageOverrides[l.id] ? { ...l, stage: localStageOverrides[l.id] } : l));
  }, [leads, localStageOverrides]);

  const selectedLead = useMemo(
    () => (selectedLeadId ? uniqueLeads.find((l) => l.id === selectedLeadId) || null : null),
    [uniqueLeads, selectedLeadId]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return uniqueLeads.filter((l) => {
      if (statusFilter !== "All" && l.stage !== statusFilter) return false;
      if (!q) return true;
      return (
        l.customerName.toLowerCase().includes(q) ||
        l.eventType.toLowerCase().includes(q) ||
        (l.location || "").toLowerCase().includes(q)
      );
    });
  }, [uniqueLeads, statusFilter, search]);

  const handleStageChange = async (leadId: string, stage: PhotographerLeadItem["stage"]) => {
    setSavingId(leadId);
    setLocalStageOverrides((prev) => ({ ...prev, [leadId]: stage }));
    try {
      const res = await fetch("/api/vendor/photographer/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ leadId, stage }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to update lead status");
      await onRefresh();
      showToast(`Lead marked as ${stage}`, "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to update lead status", "error");
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
      showToast("Note saved", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to save note", "error");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#2B2523]">Leads</h2>
        <div className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6DDD0] bg-white px-3.5 py-1.5 text-xs font-medium text-[#5E544D] shadow-xs">
          <span>Total Leads:</span>
          <span className="font-semibold text-[#2B2523]">{uniqueLeads.length}</span>
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
            aria-label="Search leads"
            className="w-full rounded-xl border border-[#E6DDD0] bg-white pl-9 pr-3 py-2 text-sm text-[#2B2523] placeholder:text-[#9A8F86] focus:outline-none focus:border-[#0F4C45]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter leads by status"
          className="sm:w-52 rounded-xl border border-[#E6DDD0] bg-white px-3 py-2 text-sm font-medium text-[#2B2523] focus:outline-none focus:border-[#0F4C45]"
        >
          <option value="All">All Statuses</option>
          {STAGES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Empty State or Clean 6-Column Leads Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#E6DDD0] bg-white py-8 px-4 text-center shadow-xs">
          <p className="text-sm font-medium text-[#5E544D]">
            {uniqueLeads.length === 0 ? "No leads yet" : "No matching leads"}
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
                    <th className="py-3 px-4">Inquiry Received Date</th>
                    <th className="py-3 px-4">Lead Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EAE0] text-sm">
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#2B2523] whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          {lead.customerName}
                          {lead.isUnread && (
                            <span className="h-2 w-2 rounded-full bg-[#C8A96A]" title="Unread" />
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#4A3F3A] whitespace-nowrap">
                        {lead.eventType}
                      </td>
                      <td className="py-3 px-4 text-[#5E544D] whitespace-nowrap text-xs">
                        {formatShortDate(lead.eventDate)}
                      </td>
                      <td className="py-3 px-4 text-[#5E544D] whitespace-nowrap text-xs">
                        {formatShortDate(lead.createdAt)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STAGE_STYLES[lead.stage]}`}
                        >
                          {lead.stage}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedLeadId(lead.id)}
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
            {filtered.map((lead) => (
              <div
                key={lead.id}
                className="rounded-xl border border-[#E6DDD0] bg-white p-3.5 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#2B2523] truncate">
                      {lead.customerName}
                    </p>
                    <p className="text-xs text-[#7A6F67] mt-0.5">{lead.eventType}</p>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${STAGE_STYLES[lead.stage]}`}
                  >
                    {lead.stage}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#5E544D] pt-1 border-t border-[#F4EFE6]">
                  <div className="space-y-0.5">
                    <p>Event: {formatShortDate(lead.eventDate)}</p>
                    <p>Received: {formatShortDate(lead.createdAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedLeadId(lead.id)}
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

      {/* Lead Details Panel */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-[#E6DDD0] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 bg-[#FAF7F2] border-b border-[#E6DDD0]">
              <div className="min-w-0">
                <h3 className="font-serif text-lg font-semibold text-[#2B2523] truncate">
                  {selectedLead.customerName}
                </h3>
                <p className="text-xs text-[#7A6F67]">
                  Received {formatShortDate(selectedLead.createdAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                aria-label="Close details"
                className="p-1.5 rounded-lg text-[#7A6F67] hover:bg-[#EDE6DA]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Lead Status Update */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2]/60 px-3.5 py-2.5">
                <label
                  htmlFor="lead-status-select"
                  className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67]"
                >
                  Lead Status
                </label>
                <select
                  id="lead-status-select"
                  disabled={savingId === selectedLead.id}
                  value={selectedLead.stage}
                  onChange={(e) =>
                    handleStageChange(selectedLead.id, e.target.value as PhotographerLeadItem["stage"])
                  }
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                    STAGE_STYLES[selectedLead.stage]
                  }`}
                >
                  {STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer & Event Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
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
                    <Calendar className="w-3.5 h-3.5" /> Event
                  </span>
                  <p className="font-medium text-[#2B2523] mt-1">
                    {selectedLead.eventType} · {formatShortDate(selectedLead.eventDate)}
                  </p>
                </div>
                <div className="rounded-xl bg-[#FAF7F2] p-3">
                  <span className="text-[#7A6F67] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> Location / Budget
                  </span>
                  <p className="font-medium text-[#2B2523] mt-1">
                    {selectedLead.location || "Not specified"}
                    {selectedLead.estimatedBudget ? ` · ${formatInr(selectedLead.estimatedBudget)}` : ""}
                  </p>
                </div>
              </div>

              {/* Related Inquiry */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-1.5">
                  Related Inquiry
                </h4>
                <div className="rounded-xl border border-[#E6DDD0] bg-[#FAF7F2]/60 p-3 text-sm text-[#2B2523]">
                  {selectedLead.message || selectedLead.latestMessage || "Direct inquiry via Cloche."}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#7A6F67] mb-2">
                  Studio Notes
                </h4>
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs text-[#2B2523] focus:outline-none focus:border-[#0F4C45]"
                  />
                  <button
                    type="submit"
                    disabled={savingId === selectedLead.id || !noteInput.trim()}
                    className="rounded-xl bg-[#2B2523] px-3.5 py-2 text-xs font-medium text-white disabled:opacity-50"
                  >
                    Save
                  </button>
                </form>

                {selectedLead.notes.length > 0 && (
                  <div className="mt-2.5 space-y-1.5">
                    {selectedLead.notes.map((n) => (
                      <div key={n.id} className="rounded-lg bg-[#FAF7F2] px-3 py-2 text-xs text-[#2B2523]">
                        <p>{n.note_text}</p>
                        <p className="text-[10px] text-[#7A6F67] mt-0.5">
                          {formatShortDate(n.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-3.5 bg-[#FAF7F2] border-t border-[#E6DDD0] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="rounded-lg border border-[#E6DDD0] bg-white px-3.5 py-1.5 text-xs font-medium text-[#5E544D] hover:text-[#2B2523]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = selectedLead.id;
                  setSelectedLeadId(null);
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
