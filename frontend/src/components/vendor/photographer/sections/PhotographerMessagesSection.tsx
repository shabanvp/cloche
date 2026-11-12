"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";

interface ChatMessageItem {
  id: string;
  sender: "customer" | "vendor" | "system";
  senderName: string;
  text: string;
  createdAt: string;
  rawCreatedAt?: string;
}

interface ConversationThreadItem {
  id: string;
  leadId: string;
  viewerRole: "customer" | "vendor";
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  eventType: string;
  eventDate?: string;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  messages: ChatMessageItem[];
}

interface Props {
  vendorId: string;
  initialLeadId?: string | null;
  onUnreadCountChange?: (count: number) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerMessagesSection({
  vendorId,
  initialLeadId,
  onUnreadCountChange,
  showToast,
}: Props) {
  const [threads, setThreads] = useState<ConversationThreadItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadThreads = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await fetch(`/api/v1/messages?vendorId=${encodeURIComponent(vendorId)}`, {
          credentials: "include",
          cache: "no-store",
        });
        const json = await res.json();
        const rawList: ConversationThreadItem[] = Array.isArray(json?.data?.conversations)
          ? json.data.conversations
          : [];
        // Keep only vendor inbox conversations (incoming client inquiries to this photographer)
        const vendorThreads = rawList.filter((c) => c.viewerRole === "vendor");
        setThreads(vendorThreads);

        const totalUnread = vendorThreads.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        onUnreadCountChange?.(totalUnread);

        if (initialLeadId) {
          const matched = vendorThreads.find((c) => c.leadId === initialLeadId);
          if (matched) setActiveId(matched.id);
        } else if (!activeId && vendorThreads.length > 0) {
          setActiveId(vendorThreads[0].id);
        }
      } catch {
        // silent poll retry
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [vendorId, initialLeadId, activeId, onUnreadCountChange]
  );

  useEffect(() => {
    loadThreads(false);
    const interval = setInterval(() => loadThreads(true), 6000);
    return () => clearInterval(interval);
  }, [loadThreads]);

  useEffect(() => {
    if (initialLeadId && threads.length > 0) {
      const matched = threads.find((t) => t.leadId === initialLeadId);
      if (matched) setActiveId(matched.id);
    }
  }, [initialLeadId, threads]);

  const activeThread = threads.find((t) => t.id === activeId) || threads[0] || null;

  const markAsRead = useCallback(async (leadId: string) => {
    try {
      await fetch("/api/v1/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "mark_read", leadId }),
      });
    } catch {
      // non-fatal
    }
  }, []);

  useEffect(() => {
    if (activeThread && activeThread.unreadCount > 0) {
      markAsRead(activeThread.leadId).then(() => loadThreads(true));
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.id]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sender: "vendor",
          leadId: activeThread.leadId,
          conversationId: activeThread.id,
          text: replyText.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to send message");
      setReplyText("");
      await loadThreads(true);
    } catch (err: any) {
      showToast(err?.message || "Could not send message", "error");
    } finally {
      setSending(false);
    }
  };

  if (loading && threads.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 rounded-2xl border border-[#E6DDD0] bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-[#0F4C45]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">
          Client Messages
        </h2>
        <p className="text-xs text-[#7A6F67] mt-0.5">
          Synchronized live with Cloche Message Center and customer profile inquiries
        </p>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-12 text-center">
          <MessageSquare className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
          <p className="text-sm font-medium text-[#2B2523]">No client conversations yet</p>
          <p className="text-xs text-[#7A6F67] mt-1">
            When couples message you from your Photographer profile, conversations appear right here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 rounded-2xl border border-[#E6DDD0] bg-white overflow-hidden min-h-[540px]">
          {/* Left Thread List */}
          <div className="border-b lg:border-b-0 lg:border-r border-[#E6DDD0] divide-y divide-[#F0EAE0] max-h-[560px] overflow-y-auto">
            {threads.map((thread) => {
              const selected = activeThread?.id === thread.id;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    selected ? "bg-[#FAF7F2]" : "hover:bg-[#FAF7F2]/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm text-[#2B2523] truncate">
                      {thread.customerName}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {thread.unreadCount > 0 && (
                        <span className="rounded-full bg-[#C8A96A] px-2 py-0.5 text-[10px] font-bold text-white">
                          {thread.unreadCount}
                        </span>
                      )}
                      <span className="text-[10px] text-[#7A6F67]">{thread.lastMessageTime}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#0F4C45] font-medium mt-0.5">
                    {thread.eventType} {thread.eventDate ? `· ${thread.eventDate}` : ""}
                  </p>
                  <p className="text-xs text-[#6E635B] truncate mt-1">
                    {thread.lastMessageSnippet || "Start conversation"}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Conversation Window */}
          {activeThread && (
            <div className="lg:col-span-2 flex flex-col h-[540px]">
              <div className="px-5 py-3.5 bg-[#FAF7F2] border-b border-[#E6DDD0] flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[#2B2523]">
                    {activeThread.customerName}
                  </h3>
                  <p className="text-[11px] text-[#7A6F67]">
                    {activeThread.customerPhone || activeThread.customerEmail || activeThread.eventType}
                  </p>
                </div>
                <span className="rounded-full bg-white border border-[#E6DDD0] px-2.5 py-1 text-[11px] font-medium text-[#5E544D]">
                  {activeThread.eventType}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FAF9F6]/50">
                {activeThread.messages.map((msg) => {
                  const isVendor = msg.sender === "vendor";
                  const isSystem = msg.sender === "system";
                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center">
                        <span className="inline-block rounded-full bg-[#EDE6DA] px-3 py-1 text-[11px] text-[#5E544D]">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isVendor ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${
                          isVendor
                            ? "bg-[#0F4C45] text-white rounded-br-sm"
                            : "bg-white border border-[#E6DDD0] text-[#2B2523] rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-[#7A6F67] mt-1 px-1">
                        {msg.createdAt}
                      </span>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form
                onSubmit={handleSendReply}
                className="p-3.5 border-t border-[#E6DDD0] bg-white flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${activeThread.customerName}...`}
                  className="flex-1 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm text-[#2B2523] focus:outline-none focus:border-[#0F4C45] focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0C3D38] disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

