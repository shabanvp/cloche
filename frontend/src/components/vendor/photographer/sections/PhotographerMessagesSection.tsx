"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Check,
  CheckCheck,
  Clock,
  Loader2,
  MessageSquare,
  Search,
  Send,
  User,
} from "lucide-react";

interface ChatMessageItem {
  id: string;
  sender: "customer" | "vendor" | "system";
  senderName: string;
  senderAvatar?: string;
  text: string;
  createdAt: string;
  rawCreatedAt?: string;
  isRead?: boolean;
}

interface ConversationThreadItem {
  id: string;
  leadId: string;
  leadIds?: string[];
  viewerRole: "customer" | "vendor";
  customerId?: string;
  customerName: string;
  customerAvatar?: string;
  customerEmail?: string;
  customerPhone?: string;
  eventType: string;
  eventDate?: string;
  unreadCount: number;
  lastMessageSnippet: string;
  lastMessageTime: string;
  lastActivityAt?: string;
  messages: ChatMessageItem[];
}

interface Props {
  vendorId: string;
  initialLeadId?: string | null;
  onUnreadCountChange?: (count: number) => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

function getInitials(name?: string): string {
  const clean = (name || "").trim();
  if (!clean) return "CL";
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

function isUsableAvatarUrl(url?: string): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (
    trimmed.includes("via.placeholder.com") ||
    trimmed.includes("images.unsplash.com/photo-1519741497674-611481863552")
  ) {
    return false;
  }
  return (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/") ||
    trimmed.startsWith("data:image/")
  );
}

function ClientAvatar({
  src,
  name,
  sizeClass = "w-11 h-11",
  textClass = "text-xs",
}: {
  src?: string;
  name: string;
  sizeClass?: string;
  textClass?: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (isUsableAvatarUrl(src) && !failed) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setFailed(true)}
        className={`${sizeClass} rounded-full object-cover border border-[#E6DDD0] shadow-xs shrink-0 bg-[#FAF7F2]`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-[#0F4C45] text-[#FAF7F2] border border-[#C8A96A]/40 shadow-xs flex items-center justify-center font-bold tracking-wide shrink-0 ${textClass}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
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
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const onUnreadRef = useRef(onUnreadCountChange);
  onUnreadRef.current = onUnreadCountChange;

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
        onUnreadRef.current?.(totalUnread);

        if (initialLeadId) {
          const matched = vendorThreads.find((c) => c.leadId === initialLeadId || c.leadIds?.includes(initialLeadId));
          if (matched) setActiveId(matched.id);
        } else {
          setActiveId((curr) => curr || (vendorThreads.length > 0 ? vendorThreads[0].id : null));
        }
      } catch {
        // silent poll retry
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [vendorId, initialLeadId]
  );

  // Fast 3s real-time polling + BroadcastChannel for sub-second cross-tab synchronization
  useEffect(() => {
    loadThreads(false);

    const interval = setInterval(() => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        loadThreads(true);
      }
    }, 3000);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("cloche_messages_realtime");
      channel.onmessage = () => {
        loadThreads(true);
      };
    } catch {
      // BroadcastChannel not available
    }

    const handleFocus = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        loadThreads(true);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      channel?.close();
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [loadThreads]);

  useEffect(() => {
    if (initialLeadId && threads.length > 0) {
      const matched = threads.find((t) => t.leadId === initialLeadId || t.leadIds?.includes(initialLeadId));
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
      try {
        const ch = new BroadcastChannel("cloche_messages_realtime");
        ch.postMessage({ type: "read_update", leadId });
        ch.close();
      } catch {}
    } catch {
      // non-fatal
    }
  }, []);

  useEffect(() => {
    if (activeThread && activeThread.unreadCount > 0) {
      markAsRead(activeThread.leadId).then(() => {
        // Optimistically clear unread badge for active thread
        setThreads((prev) =>
          prev.map((t) => (t.id === activeThread.id ? { ...t, unreadCount: 0 } : t))
        );
        loadThreads(true);
      });
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.id, markAsRead, loadThreads]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || !replyText.trim()) return;
    const textToSend = replyText.trim();
    setSending(true);
    setReplyText("");

    // Optimistic UI append for instant WhatsApp-style experience
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessageItem = {
      id: tempId,
      sender: "vendor",
      senderName: "You",
      text: textToSend,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rawCreatedAt: new Date().toISOString(),
      isRead: false,
    };

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThread.id
          ? {
              ...t,
              lastMessageSnippet: textToSend,
              lastMessageTime: optimisticMessage.createdAt,
              messages: [...t.messages, optimisticMessage],
            }
          : t
      )
    );

    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);

    try {
      const res = await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sender: "vendor",
          leadId: activeThread.leadId,
          conversationId: activeThread.id,
          leadIds: activeThread.leadIds,
          customerId: activeThread.customerId,
          customerEmail: activeThread.customerEmail,
          customerName: activeThread.customerName,
          vendorId: vendorId,
          text: textToSend,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to send message");

      // Notify customer and other open tabs via realtime broadcast
      try {
        const ch = new BroadcastChannel("cloche_messages_realtime");
        ch.postMessage({ type: "new_message", vendorId, leadId: activeThread.leadId });
        ch.close();
      } catch {}

      await loadThreads(true);
    } catch (err: any) {
      showToast(err?.message || "Could not send message", "error");
      await loadThreads(true);
    } finally {
      setSending(false);
    }
  };

  const filteredThreads = threads.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      t.customerName.toLowerCase().includes(q) ||
      t.lastMessageSnippet.toLowerCase().includes(q) ||
      t.eventType.toLowerCase().includes(q) ||
      (t.customerEmail && t.customerEmail.toLowerCase().includes(q))
    );
  });

  if (loading && threads.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 rounded-2xl border border-[#E6DDD0] bg-white">
        <Loader2 className="w-6 h-6 animate-spin text-[#0F4C45]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#2B2523] flex items-center gap-2">
            <span>Client Messages</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF1ED] text-[#0F4C45]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C45] animate-pulse" />
              Real-time
            </span>
          </h2>
          <p className="text-xs text-[#7A6F67] mt-0.5">
            Synchronized live with Cloche Message Center and customer inquiries
          </p>
        </div>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 rounded-2xl border border-[#E6DDD0] bg-white overflow-hidden min-h-[580px] shadow-xs">
          {/* Left Thread List (WhatsApp / Instagram style) */}
          <div className="border-b lg:border-b-0 lg:border-r border-[#E6DDD0] flex flex-col max-h-[620px] bg-[#FFFFFF]">
            {/* Search Header */}
            <div className="p-3 border-b border-[#F0EAE0] bg-[#FAF7F2]/60">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#7A6F67] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search client conversations..."
                  className="w-full rounded-xl border border-[#E6DDD0] bg-white pl-8 pr-3 py-2 text-xs text-[#2B2523] placeholder:text-[#7A6F67] focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F0EAE0]">
              {filteredThreads.map((thread) => {
                const selected = activeThread?.id === thread.id;
                const hasUnread = thread.unreadCount > 0;
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => setActiveId(thread.id)}
                    className={`w-full text-left p-3.5 transition-all flex items-start gap-3 relative ${
                      selected
                        ? "bg-[#FAF7F2] border-l-4 border-l-[#0F4C45]"
                        : hasUnread
                        ? "bg-[#FAF9F5] hover:bg-[#FAF7F2]/80"
                        : "hover:bg-[#FAF7F2]/50"
                    }`}
                  >
                    {/* Customer Profile Picture / Initials Avatar */}
                    <div className="relative shrink-0">
                      <ClientAvatar
                        src={thread.customerAvatar}
                        name={thread.customerName}
                        sizeClass="w-11 h-11"
                        textClass="text-xs"
                      />
                      {hasUnread && (
                        <span
                          className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#C8A96A] border-2 border-white rounded-full shadow-xs"
                          aria-label="Unread"
                        />
                      )}
                    </div>

                    {/* Metadata & Message Preview */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span
                          className={`text-sm truncate ${
                            hasUnread ? "font-bold text-[#2B2523]" : "font-semibold text-[#2B2523]"
                          }`}
                        >
                          {thread.customerName}
                        </span>
                        <span
                          className={`text-[10px] shrink-0 ${
                            hasUnread ? "font-bold text-[#0F4C45]" : "text-[#7A6F67]"
                          }`}
                        >
                          {thread.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="inline-block px-1.5 py-0.5 rounded-sm bg-[#EAF1ED] text-[10px] font-semibold text-[#0F4C45] truncate">
                          {thread.eventType} {thread.eventDate ? `· ${thread.eventDate}` : ""}
                        </span>
                        {hasUnread && (
                          <span className="rounded-full bg-[#C8A96A] px-1.5 py-0.2 text-[9px] font-bold text-white shrink-0">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs truncate mt-1 ${
                          hasUnread ? "font-medium text-[#2B2523]" : "text-[#7A6F67]"
                        }`}
                      >
                        {thread.lastMessageSnippet || "Start conversation"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Conversation Window (Active Chat) */}
          {activeThread ? (
            <div className="lg:col-span-2 flex flex-col h-[620px] bg-[#FFFFFF]">
              {/* Header with Customer Identity */}
              <div className="px-5 py-3.5 bg-[#FAF7F2] border-b border-[#E6DDD0] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ClientAvatar
                    src={activeThread.customerAvatar}
                    name={activeThread.customerName}
                    sizeClass="w-10 h-10"
                    textClass="text-xs"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-[#2B2523] truncate">
                      {activeThread.customerName}
                    </h3>
                    <p className="text-[11px] text-[#7A6F67] truncate">
                      Verified Client • {activeThread.eventType}
                      {activeThread.eventDate ? ` (${activeThread.eventDate})` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="rounded-full bg-white border border-[#E6DDD0] px-2.5 py-1 text-[11px] font-medium text-[#5E544D]">
                    {activeThread.eventType}
                  </span>
                </div>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-[#FAF9F6]/60">
                {activeThread.messages.map((msg) => {
                  const isVendor = msg.sender === "vendor";
                  const isSystem = msg.sender === "system";

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-2">
                        <span className="inline-block rounded-full bg-[#EDE6DA] px-3.5 py-1 text-[11px] font-medium text-[#5E544D]">
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
                      <div className="flex items-end gap-2 max-w-[82%]">
                        {!isVendor && (
                          <ClientAvatar
                            src={msg.senderAvatar || activeThread.customerAvatar}
                            name={activeThread.customerName}
                            sizeClass="w-6 h-6 mb-1"
                            textClass="text-[9px]"
                          />
                        )}

                        <div
                          className={`rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                            isVendor
                              ? "bg-[#0F4C45] text-white rounded-br-xs"
                              : "bg-white border border-[#E6DDD0] text-[#2B2523] rounded-bl-xs"
                          }`}
                        >
                          {!isVendor && (
                            <p className="text-[10px] font-bold text-[#0F4C45] mb-0.5">
                              {activeThread.customerName}
                            </p>
                          )}
                          <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        </div>
                      </div>

                      <div
                        className={`flex items-center gap-1 text-[10px] text-[#7A6F67] mt-1 px-1 ${
                          isVendor ? "justify-end" : "justify-start pl-8"
                        }`}
                      >
                        <span>{msg.createdAt}</span>
                        {isVendor && (
                          <span title={msg.isRead ? "Read" : "Delivered"}>
                            {msg.isRead ? (
                              <CheckCheck className="w-3 h-3 text-[#C8A96A]" />
                            ) : (
                              <Check className="w-3 h-3 text-[#7A6F67]" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendReply}
                className="p-3.5 border-t border-[#E6DDD0] bg-white flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${activeThread.customerName}...`}
                  className="flex-1 rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-4 py-2.5 text-sm text-[#2B2523] placeholder:text-[#7A6F67] focus:outline-none focus:border-[#0F4C45] focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={sending || !replyText.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F4C45] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#0C3D38] disabled:opacity-50 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center p-12 text-center text-[#7A6F67]">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      )}
    </div>
  );
}
