"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Send,
  Phone,
  ArrowLeft,
  ExternalLink,
  Check,
  CheckCheck,
  RefreshCw,
  X,
  Lock,
  Sparkles,
  FileText,
  Clock,
} from "lucide-react";
import type {
  ChatMessage,
  ConversationItem,
  AuthenticatedInboxUser,
} from "@/app/api/v1/messages/route";

const DEMO_CONVERSATION_IDS = new Set([
  "conv-photographer-1",
  "conv-venue-1",
  "conv-makeup-1",
  "conv-decor-1",
  "v-calicut-films",
  "v-eden-banquets",
  "v-saffron-glam",
  "v-mandap-flora",
]);

const STOREFRONT_CHAT_PREFIX = "cloche_vendor_chat_";
const STOREFRONT_CHAT_OWNER_KEY = "cloche_vendor_chat_owner";

function isDemoId(id: string): boolean {
  if (!id) return false;
  return (
    DEMO_CONVERSATION_IDS.has(id) ||
    id.startsWith("conv-photographer") ||
    id.startsWith("conv-venue") ||
    id.startsWith("conv-makeup") ||
    id.startsWith("conv-decor")
  );
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
    trimmed.includes("images.unsplash.com/photo-1519741497674-611481863552") ||
    trimmed.includes("via.placeholder.com")
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

function VendorAvatar({
  src,
  name,
  sizeClass = "w-12 h-12",
  textClass = "text-sm",
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
        className={`${sizeClass} rounded-full object-cover border border-[#C8A96A]/35 shadow-xs bg-[#FAF7F2]`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-[#0F4C45] text-[#F7F3EC] border border-[#C8A96A]/45 shadow-xs flex items-center justify-center font-display font-bold tracking-wide ${textClass}`}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}

function getVendorProfileHref(conv: ConversationItem): string {
  const identifier = encodeURIComponent(conv.vendorSlug || conv.vendorId || "");
  if (!identifier) return "/boutiques";

  const raw = (conv.vendorCategorySlug || conv.vendorCategory || "").toLowerCase().trim();

  if (
    raw.includes("venue") ||
    raw.includes("banquet") ||
    raw.includes("hall") ||
    raw.includes("lawn") ||
    raw.includes("resort") ||
    raw.includes("auditorium") ||
    raw.includes("palace")
  ) {
    return `/venues/${identifier}`;
  }
  if (raw.includes("photo") || raw.includes("video") || raw.includes("film") || raw.includes("camera")) {
    return `/photographers/${identifier}`;
  }
  if (raw.includes("makeup") || raw.includes("beauty")) {
    return `/makeup-artists/${identifier}`;
  }
  if (raw.includes("mehendi") || raw.includes("mehndi") || raw.includes("henna")) {
    return `/mehendi-artists/${identifier}`;
  }
  if (raw.includes("cater") || raw.includes("food") || raw.includes("cake") || raw.includes("dessert") || raw.includes("baker")) {
    return `/catering/${identifier}`;
  }
  if (raw.includes("decor") || raw.includes("planner") || raw.includes("planning") || raw.includes("flower")) {
    return `/decor-planning/${identifier}`;
  }
  if (raw.includes("bridal") || raw.includes("bride")) {
    return `/bridal-wear/${identifier}`;
  }
  if (raw.includes("groom")) {
    return `/groom-wear/${identifier}`;
  }
  if (raw.includes("wedding-studio") || raw.includes("wedding-story") || raw.includes("wedding studio") || raw.includes("wedding story") || raw.includes("boutique")) {
    return `/wedding-story/${identifier}`;
  }
  if (raw.includes("jewel")) {
    return `/jewellery/${identifier}`;
  }
  if (raw.includes("invit") || raw.includes("card")) {
    return `/invitations/${identifier}`;
  }

  return `/vendors/${encodeURIComponent(conv.vendorCategorySlug || "general")}/${identifier}`;
}

function parseMs(raw?: string): number {
  if (!raw) return 0;
  const ms = Date.parse(raw);
  return Number.isFinite(ms) ? ms : 0;
}

function formatConversationTimestamp(rawIso?: string, fallback?: string): string {
  const ms = parseMs(rawIso);
  if (!ms) {
    return fallback ? fallback.split("at")[0].trim() : "";
  }
  const d = new Date(ms);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;

  if (ms >= startOfToday) {
    return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  }
  if (ms >= startOfYesterday) {
    return "Yesterday";
  }
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
}

function formatMessageBubbleTime(rawIso?: string, fallback?: string): string {
  const ms = parseMs(rawIso);
  if (!ms) return fallback || "";
  return new Date(ms).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDayDividerLabel(rawIso?: string): string {
  const ms = parseMs(rawIso);
  if (!ms) return "";
  const d = new Date(ms);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86400000;

  if (ms >= startOfToday) return "Today";
  if (ms >= startOfYesterday) return "Yesterday";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function getDayKey(rawIso?: string): string {
  const ms = parseMs(rawIso);
  if (!ms) return "";
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [authUser, setAuthUser] = useState<AuthenticatedInboxUser | null>(null);
  const [quoteActionBusyId, setQuoteActionBusyId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectedConvIdRef = useRef<string>("");
  const urlDeepLinkAppliedRef = useRef<boolean>(false);
  const attemptedStorefrontMsgsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    selectedConvIdRef.current = selectedConvId;
  }, [selectedConvId]);

  const markConversationAsRead = useCallback(async (conv: ConversationItem) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conv.id
          ? {
              ...c,
              unreadCount: 0,
              messages: c.messages.map((m) => ({ ...m, isRead: true })),
            }
          : c
      )
    );

    try {
      await fetch("/api/v1/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conv.id,
          vendorId: conv.vendorId,
          leadId: conv.leadId,
          leadIds: conv.leadIds,
        }),
      });
      window.dispatchEvent(new Event("cloche_messages_updated"));
      try {
        const ch = new BroadcastChannel("cloche_messages_realtime");
        ch.postMessage({ type: "read_update", leadId: conv.leadId, vendorId: conv.vendorId });
        ch.close();
      } catch {}
    } catch (e) {
      console.warn("[MessagesPage] Failed to persist read state:", e);
    }
  }, []);

  const loadConversations = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!opts?.silent) setIsLoading(true);
      try {
        const res = await fetch("/api/v1/messages", { cache: "no-store" }).then((r) =>
          r.json()
        );
        if (res?.success && Array.isArray(res.data?.conversations)) {
          const currentUser: AuthenticatedInboxUser | null =
            res.data.authenticatedUser || null;
          setAuthUser(currentUser);
          setIsGuest(!currentUser);

          let loaded: ConversationItem[] = res.data.conversations.filter(
            (c: ConversationItem) => !isDemoId(c.id) && !isDemoId(c.vendorId)
          );

          // Enforce strict per-user cache hygiene and backfill any unsynced storefront messages
          try {
            const ownerKey = currentUser
              ? `${currentUser.role}:${currentUser.id || currentUser.email}`
              : "";
            const ownerIdentity = currentUser
              ? String(currentUser.email || currentUser.id || "").trim().toLowerCase()
              : "";
            const prevOwner = localStorage.getItem("cloche_messages_owner") || "";
            const prevStoreOwner =
              (localStorage.getItem(STOREFRONT_CHAT_OWNER_KEY) || "").trim().toLowerCase();

            const listStorefrontChatKeys = (): string[] => {
              const keys: string[] = [];
              for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (
                  k &&
                  k.startsWith(STOREFRONT_CHAT_PREFIX) &&
                  k !== STOREFRONT_CHAT_OWNER_KEY
                ) {
                  keys.push(k);
                }
              }
              return keys;
            };

            if (!currentUser) {
              localStorage.removeItem("cloche_user_chat_messages");
              localStorage.removeItem("cloche_messages_owner");
              attemptedStorefrontMsgsRef.current.clear();
              if (prevOwner || prevStoreOwner) {
                for (const k of listStorefrontChatKeys()) {
                  localStorage.removeItem(k);
                }
                localStorage.removeItem(STOREFRONT_CHAT_OWNER_KEY);
              }
            } else {
              const ownerMismatch =
                (prevOwner && prevOwner !== ownerKey) ||
                (prevStoreOwner && prevStoreOwner !== ownerIdentity);

              if (ownerMismatch) {
                localStorage.removeItem("cloche_user_chat_messages");
                for (const k of listStorefrontChatKeys()) {
                  localStorage.removeItem(k);
                }
                attemptedStorefrontMsgsRef.current.clear();
              }

              localStorage.setItem("cloche_messages_owner", ownerKey);
              if (ownerIdentity) {
                localStorage.setItem(STOREFRONT_CHAT_OWNER_KEY, ownerIdentity);
              }

              // Backfill any unsynced customer chats left in cloche_vendor_chat_<vendorId>
              if (!ownerMismatch) {
                const pendingBackfills: Array<{
                  vendorId: string;
                  text: string;
                  signature: string;
                }> = [];

                for (const key of listStorefrontChatKeys()) {
                  const vendorRef = key.slice(STOREFRONT_CHAT_PREFIX.length).trim();
                  if (!vendorRef || vendorRef === "default" || isDemoId(vendorRef)) {
                    continue;
                  }

                  let rawList: any[] = [];
                  try {
                    const parsedChat = JSON.parse(localStorage.getItem(key) || "[]");
                    if (Array.isArray(parsedChat)) rawList = parsedChat;
                  } catch {
                    continue;
                  }

                  const existingConv = loaded.find(
                    (c) =>
                      c.viewerRole !== "vendor" &&
                      (String(c.vendorId) === vendorRef ||
                        String(c.vendorSlug || "") === vendorRef ||
                        c.id === `conv-vendor-${vendorRef}`)
                  );
                  const existingCustomerTexts = new Set(
                    (existingConv?.messages || [])
                      .filter((m) => m.sender === "customer")
                      .map((m) => String(m.text || "").trim())
                      .filter(Boolean)
                  );
                  const seenInLocal = new Set<string>();

                  for (const item of rawList) {
                    const itemSender = String(item?.sender || "").toLowerCase();
                    if (itemSender !== "user" && itemSender !== "customer") continue;
                    const text = String(item?.text || "").trim();
                    if (!text || seenInLocal.has(text)) continue;
                    seenInLocal.add(text);

                    const signature = `${vendorRef}::${text}`;
                    if (
                      existingCustomerTexts.has(text) ||
                      attemptedStorefrontMsgsRef.current.has(signature)
                    ) {
                      continue;
                    }
                    pendingBackfills.push({ vendorId: vendorRef, text, signature });
                  }
                }

                if (pendingBackfills.length > 0) {
                  let didSyncAny = false;
                  for (const item of pendingBackfills) {
                    attemptedStorefrontMsgsRef.current.add(item.signature);
                    try {
                      const postRes = await fetch("/api/v1/messages", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          vendorId: item.vendorId,
                          conversationId: `conv-vendor-${item.vendorId}`,
                          text: item.text,
                          sender: "customer",
                        }),
                      });
                      if (postRes.ok) {
                        didSyncAny = true;
                      } else if (postRes.status >= 500) {
                        attemptedStorefrontMsgsRef.current.delete(item.signature);
                      }
                    } catch {
                      attemptedStorefrontMsgsRef.current.delete(item.signature);
                    }
                  }

                  if (didSyncAny) {
                    const refreshed = await fetch("/api/v1/messages", {
                      cache: "no-store",
                    })
                      .then((r) => r.json())
                      .catch(() => null);
                    if (
                      refreshed?.success &&
                      Array.isArray(refreshed.data?.conversations)
                    ) {
                      loaded = refreshed.data.conversations.filter(
                        (c: ConversationItem) =>
                          !isDemoId(c.id) && !isDemoId(c.vendorId)
                      );
                    }
                  }
                }
              }

              const localStored = ownerMismatch
                ? null
                : localStorage.getItem("cloche_user_chat_messages");
              if (localStored) {
                const parsed = JSON.parse(localStored);
                if (typeof parsed === "object" && parsed !== null) {
                  let cleaned = false;
                  const now = Date.now();
                  loaded = loaded.map((c) => {
                    const rawExtras: ChatMessage[] = Array.isArray(parsed[c.id])
                      ? parsed[c.id]
                      : [];
                    if (rawExtras.length === 0) return c;

                    const combined = [...c.messages];
                    const remainingPending: ChatMessage[] = [];

                    for (const ext of rawExtras) {
                      const alreadyInDb = combined.some(
                        (m) =>
                          m.id === ext.id ||
                          (m.sender === ext.sender &&
                            m.text.trim() === ext.text.trim())
                      );
                      const extMs = parseMs(ext.rawCreatedAt);
                      const isFreshPending = extMs > 0 && now - extMs < 120000;

                      if (!alreadyInDb && isFreshPending) {
                        combined.push(ext);
                        remainingPending.push(ext);
                      } else {
                        cleaned = true;
                      }
                    }

                    if (remainingPending.length !== rawExtras.length) {
                      if (remainingPending.length > 0) {
                        parsed[c.id] = remainingPending;
                      } else {
                        delete parsed[c.id];
                      }
                      cleaned = true;
                    }

                    if (combined.length > c.messages.length) {
                      combined.sort(
                        (a, b) =>
                          parseMs(a.rawCreatedAt) - parseMs(b.rawCreatedAt)
                      );
                      const latest = combined[combined.length - 1];
                      return {
                        ...c,
                        messages: combined,
                        lastMessageSnippet: latest.text,
                        lastMessageSender: latest.sender,
                        lastActivityAt: latest.rawCreatedAt || c.lastActivityAt,
                      };
                    }
                    return c;
                  });

                  for (const key of Object.keys(parsed)) {
                    if (isDemoId(key) || !loaded.some((c) => c.id === key)) {
                      delete parsed[key];
                      cleaned = true;
                    }
                  }
                  if (cleaned) {
                    localStorage.setItem(
                      "cloche_user_chat_messages",
                      JSON.stringify(parsed)
                    );
                  }
                }
              }
            }
          } catch {}

          // Ensure conversations stay ordered by most recent message activity
          loaded.sort(
            (a, b) => parseMs(b.lastActivityAt) - parseMs(a.lastActivityAt)
          );

          // Check URL deep-link once (?vendor=<id> or ?conversation=<id>)
          let nextSelected = selectedConvIdRef.current;
          if (!urlDeepLinkAppliedRef.current && typeof window !== "undefined") {
            urlDeepLinkAppliedRef.current = true;
            const params = new URLSearchParams(window.location.search);
            const targetVendor = params.get("vendor");
            const targetConv = params.get("conversation");
            if (targetConv || targetVendor) {
              const matched = loaded.find(
                (c) =>
                  (targetConv && c.id === targetConv) ||
                  (targetVendor &&
                    (String(c.vendorId) === String(targetVendor) ||
                      String(c.vendorSlug) === String(targetVendor)))
              );
              if (matched) {
                nextSelected = matched.id;
                setSelectedConvId(matched.id);
              }
            }
          }

          if (nextSelected && !loaded.some((c) => c.id === nextSelected)) {
            setSelectedConvId("");
            nextSelected = "";
          }

          setConversations(loaded);

          // If the currently open conversation received new unread messages during refresh, mark read
          if (nextSelected) {
            const activeConv = loaded.find((c) => c.id === nextSelected);
            if (activeConv && activeConv.unreadCount > 0) {
              markConversationAsRead(activeConv);
            }
          }
        }
      } catch (e) {
        console.error("[MessagesPage] Error fetching messages:", e);
      } finally {
        if (!opts?.silent) setIsLoading(false);
      }
    },
    [markConversationAsRead]
  );

  useEffect(() => {
    loadConversations();

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        loadConversations({ silent: true });
      }
    }, 3000);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("cloche_messages_realtime");
      channel.onmessage = () => {
        loadConversations({ silent: true });
      };
    } catch {}

    const handleVisibilityOrFocus = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        loadConversations({ silent: true });
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      channel?.close();
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [loadConversations]);

  // Only show an active thread when explicitly chosen (mobile shows inbox list first;
  // desktop preserves unread state until user selects a conversation).
  const selectedConversation = useMemo(() => {
    if (!selectedConvId || conversations.length === 0) return null;
    return conversations.find((c) => c.id === selectedConvId) || null;
  }, [conversations, selectedConvId]);

  const totalUnread = useMemo(
    () => conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
    [conversations]
  );

  // Scroll to bottom when switching conversations or receiving messages
  useEffect(() => {
    if (selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages.length, selectedConvId]);

  const handleSelectConversation = (conv: ConversationItem) => {
    setSelectedConvId(conv.id);
    setSendError(null);
    if (conv.unreadCount > 0) {
      markConversationAsRead(conv);
    }
  };

  // Real-time dynamic search (vendor name, category, city, message content, quotation details)
  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return conversations;

    return conversations.filter((c) => {
      if (c.vendorName?.toLowerCase().includes(q)) return true;
      if (c.vendorCategory?.toLowerCase().includes(q)) return true;
      if (c.vendorCity?.toLowerCase().includes(q)) return true;
      if (c.customerName?.toLowerCase().includes(q)) return true;
      if (c.eventType?.toLowerCase().includes(q)) return true;
      if (c.lastMessageSnippet?.toLowerCase().includes(q)) return true;
      if (
        Array.isArray(c.messages) &&
        c.messages.some((m) => {
          if (m.text?.toLowerCase().includes(q)) return true;
          if (m.senderName?.toLowerCase().includes(q)) return true;
          if (m.quotation?.title?.toLowerCase().includes(q)) return true;
          if (m.quotation?.quotationNumber?.toLowerCase().includes(q)) return true;
          if (m.quotation?.details?.toLowerCase().includes(q)) return true;
          return false;
        })
      ) {
        return true;
      }
      return false;
    });
  }, [conversations, searchQuery]);

  const isVendorMode = authUser?.role === "vendor";
  const isVendorThread = useCallback(
    (conv?: ConversationItem | null) =>
      conv?.viewerRole ? conv.viewerRole === "vendor" : isVendorMode,
    [isVendorMode]
  );
  const selectedIsVendor = isVendorThread(selectedConversation);

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend ?? inputText).trim();
    if (!content || !selectedConversation || isSending) return;

    const targetConvId = selectedConversation.id;
    const threadIsVendor = isVendorThread(selectedConversation);
    const senderRole: "customer" | "vendor" = threadIsVendor ? "vendor" : "customer";
    const nowIso = new Date().toISOString();
    const optimisticId = `local-msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const optimisticMsg: ChatMessage = {
      id: optimisticId,
      sender: senderRole,
      senderName: senderRole === "vendor" ? selectedConversation.vendorName : "You",
      text: content,
      createdAt: formatMessageBubbleTime(nowIso),
      rawCreatedAt: nowIso,
      isRead: true,
      leadId: selectedConversation.leadId,
    };

    setIsSending(true);
    setSendError(null);
    if (!textToSend) {
      setInputText("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }

    // Optimistic state update and re-sort inbox newest-first
    setConversations((prev) => {
      const updated = prev.map((c) =>
        c.id === targetConvId
          ? {
              ...c,
              lastMessageSnippet: content,
              lastMessageSender: senderRole,
              lastMessageTime: formatConversationTimestamp(nowIso),
              lastActivityAt: nowIso,
              unreadCount: 0,
              messages: [...c.messages, optimisticMsg],
            }
          : c
      );
      updated.sort((a, b) => parseMs(b.lastActivityAt) - parseMs(a.lastActivityAt));
      return updated;
    });

    try {
      const stored = localStorage.getItem("cloche_user_chat_messages") || "{}";
      const parsed = JSON.parse(stored);
      parsed[targetConvId] = [...(parsed[targetConvId] || []), optimisticMsg];
      localStorage.setItem("cloche_user_chat_messages", JSON.stringify(parsed));
    } catch {}

    try {
      const response = await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          vendorId: selectedConversation.vendorId,
          leadId: selectedConversation.leadId,
          text: content,
          sender: senderRole,
        }),
      });
      const json = await response.json();

      if (!response.ok || !json?.success) {
        throw new Error(json?.error?.message || "Failed to send message.");
      }

      const persistedMsg: ChatMessage | undefined = json.data?.message;

      // Replace optimistic placeholder with authoritative DB record
      if (persistedMsg) {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== targetConvId) return c;
            return {
              ...c,
              leadId: json.data?.leadId || c.leadId,
              lastActivityAt: persistedMsg.rawCreatedAt || c.lastActivityAt,
              messages: c.messages.map((m) =>
                m.id === optimisticId ? { ...m, ...persistedMsg } : m
              ),
            };
          })
        );
      }

      // Clean persisted optimistic entry out of localStorage
      try {
        const stored = localStorage.getItem("cloche_user_chat_messages");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed?.[targetConvId])) {
            parsed[targetConvId] = parsed[targetConvId].filter(
              (m: ChatMessage) => m.id !== optimisticId
            );
            if (parsed[targetConvId].length === 0) delete parsed[targetConvId];
            localStorage.setItem("cloche_user_chat_messages", JSON.stringify(parsed));
          }
        }
      } catch {}

      window.dispatchEvent(new Event("cloche_messages_updated"));
      try {
        const ch = new BroadcastChannel("cloche_messages_realtime");
        ch.postMessage({ type: "new_message", leadId: selectedConversation.leadId, vendorId: selectedConversation.vendorId });
        ch.close();
      } catch {}
    } catch (e: any) {
      setSendError(e?.message || "Could not send message. Please try again.");
      // Revert failed optimistic message and restore draft so the user never loses their message
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetConvId) return c;
          const remaining = c.messages.filter((m) => m.id !== optimisticId);
          const last = remaining[remaining.length - 1];
          return {
            ...c,
            messages: remaining,
            lastMessageSnippet: last?.text || c.lastMessageSnippet,
            lastActivityAt: last?.rawCreatedAt || c.lastActivityAt,
          };
        })
      );
      if (!textToSend) setInputText(content);
      try {
        const stored = localStorage.getItem("cloche_user_chat_messages");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed?.[targetConvId])) {
            parsed[targetConvId] = parsed[targetConvId].filter(
              (m: ChatMessage) => m.id !== optimisticId
            );
            localStorage.setItem("cloche_user_chat_messages", JSON.stringify(parsed));
          }
        }
      } catch {}
    } finally {
      setIsSending(false);
    }
  };

  const handleQuotationResponse = async (
    msg: ChatMessage,
    newStatus: "accepted" | "customer_interested" | "revision_requested"
  ) => {
    const q = msg.quotation;
    if (!q) return;

    setQuoteActionBusyId(msg.id);
    if (q.id) {
      try {
        const res = await fetch("/api/v1/messages", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "quotation_response",
            quotationId: q.id,
            responseStatus: newStatus,
          }),
        }).then((r) => r.json());

        if (res?.success) {
          const resolvedStatus =
            res?.data?.status ||
            (newStatus === "revision_requested" ? "revision_requested" : "accepted");
          setConversations((prev) =>
            prev.map((c) => ({
              ...c,
              messages: c.messages.map((m) =>
                m.id === msg.id && m.quotation
                  ? { ...m, quotation: { ...m.quotation, status: resolvedStatus } }
                  : m
              ),
            }))
          );
        }
      } catch {}
    }

    const followUp =
      newStatus === "accepted" || newStatus === "customer_interested"
        ? `We would like to move forward with "${q.title}" (₹${q.amount.toLocaleString("en-IN")}). Please share the booking confirmation steps and payment schedule.`
        : `Thank you for sharing "${q.title}". Could we discuss a custom revision for our wedding requirements?`;

    await handleSendMessage(followUp);
    setQuoteActionBusyId(null);
  };

  const getReplyBadge = (item: ConversationItem) => {
    if (item.status === "quoted") {
      return {
        label: "Quote Received",
        cls: "bg-[#C8A96A]/18 text-[#7C5B1B] border border-[#C8A96A]/35",
      };
    }
    if (item.status === "confirmed" || item.status === "completed") {
      return {
        label: "Confirmed",
        cls: "bg-emerald-50 text-emerald-800 border border-emerald-200",
      };
    }
    if (item.hasVendorReply || item.status === "replied") {
      return {
        label: item.unreadCount > 0 ? "New Reply" : "Replied",
        cls:
          item.unreadCount > 0
            ? "bg-[#0F4C45] text-white"
            : "bg-emerald-50 text-emerald-800 border border-emerald-200",
      };
    }
    return {
      label: "Awaiting Reply",
      cls: "bg-[#FAF7F2] text-[#082F2C]/60 border border-[#C8A96A]/20",
    };
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#082F2C]">
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 py-4 sm:py-6">
        <div className="bg-white rounded-3xl border border-[#C8A96A]/20 shadow-[0_12px_45px_rgba(0,0,0,0.06)] overflow-hidden h-[calc(100dvh-108px)] min-h-[480px] sm:min-h-[560px] max-h-[820px] flex flex-col md:flex-row">
          {/* LEFT COLUMN: Conversation List */}
          <div
            className={`w-full md:w-[360px] lg:w-[400px] border-r border-[#C8A96A]/15 flex flex-col bg-[#FAF7F2]/50 min-h-0 ${
              selectedConvId ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Inbox Header & Search Bar (NO filter tabs) */}
            <div className="p-4 border-b border-[#C8A96A]/15 bg-white space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="font-display font-bold text-lg text-[#082F2C]">
                    Messages
                  </h1>
                  {totalUnread > 0 && (
                    <span className="bg-[#C8A96A] text-[#082F2C] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                      {totalUnread} unread
                    </span>
                  )}
                </div>

                {!isGuest && (
                  <button
                    type="button"
                    onClick={() => loadConversations({ silent: true })}
                    className="p-1.5 rounded-full text-[#0F4C45]/70 hover:text-[#0F4C45] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    title="Refresh conversations"
                    aria-label="Refresh conversations"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-[#C8A96A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search vendor or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#C8A96A]/25 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-[#082F2C] placeholder:text-[#082F2C]/40 focus:outline-none focus:border-[#0F4C45] transition-colors"
                  aria-label="Search vendor or message"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#082F2C]/40 hover:text-[#082F2C] p-1 rounded-full cursor-pointer transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#C8A96A]/10 flex flex-col">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-[#082F2C]/60 space-y-2 my-auto">
                  <RefreshCw className="w-5 h-5 text-[#C8A96A] animate-spin mx-auto" />
                  <p>Loading your conversations...</p>
                </div>
              ) : isGuest ? (
                <div className="p-8 text-center space-y-3 my-auto">
                  <div className="w-12 h-12 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center mx-auto">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-[#082F2C]">
                    Sign in to view your messages
                  </p>
                  <p className="text-xs text-[#082F2C]/60 max-w-[260px] mx-auto leading-relaxed">
                    Access all your inquiries, vendor replies, and custom wedding quotations in one place.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <Link
                      href="/login?redirect=/messages"
                      className="inline-flex items-center gap-1.5 bg-[#0F4C45] hover:bg-[#12584C] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                    >
                      <span>Log In</span>
                    </Link>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-[#FAF7F2] text-[#0F4C45] border border-[#C8A96A]/35 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                    >
                      <span>Sign Up</span>
                    </Link>
                  </div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center space-y-3 my-auto">
                  <div className="w-12 h-12 rounded-full bg-[#0F4C45]/8 text-[#0F4C45] flex items-center justify-center mx-auto">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#082F2C]">
                    No conversations yet
                  </p>
                  <p className="text-xs text-[#082F2C]/60 max-w-[260px] mx-auto leading-relaxed">
                    When you message wedding vendors, request availability, or receive quotations, your conversations will appear here.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/venues"
                      className="inline-flex items-center gap-1.5 bg-[#0F4C45] hover:bg-[#12584C] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                    >
                      <span>Browse Vendors</span>
                    </Link>
                  </div>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((item) => {
                  const isSelected = item.id === selectedConversation?.id;
                  const hasUnread = item.unreadCount > 0;
                  const itemIsVendor = isVendorThread(item);
                  const counterpartyName = itemIsVendor
                    ? item.customerName
                    : item.vendorName;
                  const badge = getReplyBadge(item);
                  const displayTime = formatConversationTimestamp(
                    item.lastActivityAt,
                    item.lastMessageTime
                  );
                  const isOwnLastMsg = itemIsVendor
                    ? item.lastMessageSender === "vendor"
                    : item.lastMessageSender === "customer";

                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleSelectConversation(item)}
                      className={`w-full text-left p-4 cursor-pointer transition-all flex items-start gap-3 relative ${
                        isSelected
                          ? "bg-white shadow-xs border-l-4 border-l-[#0F4C45]"
                          : hasUnread
                          ? "bg-[#C8A96A]/6 hover:bg-white"
                          : "hover:bg-white/80"
                      }`}
                    >
                      {/* Avatar with Unread Dot */}
                      <div className="relative shrink-0">
                        <VendorAvatar
                          src={itemIsVendor ? item.customerAvatar : item.vendorAvatar}
                          name={counterpartyName}
                          sizeClass="w-12 h-12"
                          textClass="text-sm"
                        />
                        {hasUnread && (
                          <span
                            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#C8A96A] border-2 border-white rounded-full shadow-xs"
                            aria-label="Unread reply"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <h4
                            className={`text-xs sm:text-sm text-[#082F2C] truncate flex items-center gap-1 ${
                              hasUnread ? "font-extrabold" : "font-bold"
                            }`}
                          >
                            <span className="truncate">{counterpartyName}</span>
                            {!itemIsVendor && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                            )}
                          </h4>
                          <span
                            className={`text-[10px] shrink-0 ${
                              hasUnread
                                ? "font-bold text-[#0F4C45]"
                                : "font-medium text-[#082F2C]/50"
                            }`}
                          >
                            {displayTime}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F4C45] bg-[#0F4C45]/8 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                            {itemIsVendor ? item.eventType : item.vendorCategory}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`text-xs truncate ${
                              hasUnread
                                ? "font-bold text-[#082F2C]"
                                : "text-[#082F2C]/65"
                            }`}
                          >
                            {isOwnLastMsg ? "You: " : ""}
                            {item.lastMessageSnippet}
                          </p>

                          {hasUnread && (
                            <span className="shrink-0 min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#C8A96A] text-[#082F2C] text-[10px] font-extrabold flex items-center justify-center">
                              {item.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center space-y-3 my-auto">
                  <Search className="w-8 h-8 text-[#C8A96A]/50 mx-auto" />
                  <p className="text-sm font-bold text-[#082F2C]">
                    No conversations found
                  </p>
                  <p className="text-xs text-[#082F2C]/60">
                    No conversations match &ldquo;{searchQuery}&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs font-semibold text-[#0F4C45] underline hover:text-[#C8A96A] cursor-pointer"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Chat Thread or Empty Selection */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col bg-white min-h-0">
              {/* Chat Thread Header */}
              <div className="px-4 py-3.5 border-b border-[#C8A96A]/15 bg-[#FAF7F2]/40 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedConvId("")}
                    className="md:hidden p-1.5 text-[#0F4C45] hover:bg-[#FAF7F2] rounded-xl cursor-pointer shrink-0"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <VendorAvatar
                    src={selectedIsVendor ? selectedConversation.customerAvatar : selectedConversation.vendorAvatar}
                    name={
                      selectedIsVendor
                        ? selectedConversation.customerName
                        : selectedConversation.vendorName
                    }
                    sizeClass="w-10 h-10 shrink-0"
                    textClass="text-xs"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-sm sm:text-base text-[#082F2C] truncate">
                        {selectedIsVendor
                          ? selectedConversation.customerName
                          : selectedConversation.vendorName}
                      </h3>
                      {!selectedIsVendor && (
                        <CheckCircle2 className="w-4 h-4 text-[#C8A96A] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#082F2C]/60 flex items-center gap-1 truncate">
                      <span>
                        {selectedIsVendor
                          ? selectedConversation.eventType
                          : selectedConversation.vendorCategory}
                      </span>
                      <span>•</span>
                      <MapPin className="w-3 h-3 text-[#0F4C45] shrink-0" />
                      <span className="truncate">
                        {selectedConversation.vendorCity}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Header CTA actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {!selectedIsVendor && selectedConversation.vendorPhone && (
                    <a
                      href={`tel:${selectedConversation.vendorPhone}`}
                      className="hidden sm:flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#C8A96A]/15 border border-[#C8A96A]/30 text-[#0F4C45] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                      title="Call vendor"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Call</span>
                    </a>
                  )}

                  {selectedIsVendor ? (
                    <Link
                      href="/vendor/leads"
                      className="flex items-center gap-1 bg-[#0F4C45] hover:bg-[#12584C] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors shadow-xs"
                    >
                      <span>Open CRM</span>
                      <ExternalLink className="w-3 h-3 text-[#C8A96A]" />
                    </Link>
                  ) : (
                    <Link
                      href={getVendorProfileHref(selectedConversation)}
                      className="flex items-center gap-1 bg-[#0F4C45] hover:bg-[#12584C] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors shadow-xs"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3 h-3 text-[#C8A96A]" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Pinned Inquiry Summary Banner */}
              <div className="bg-[#FAF7F2] px-4 py-2.5 border-b border-[#C8A96A]/10 text-xs flex flex-wrap items-center justify-between gap-2 shrink-0">
                <div className="flex flex-wrap items-center gap-3 text-[#082F2C]/80">
                  <span className="font-bold text-[#0F4C45] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C8A96A]" />
                    {selectedConversation.eventDate
                      ? new Date(selectedConversation.eventDate).toLocaleDateString(
                          "en-IN",
                          { dateStyle: "medium" }
                        )
                      : "Date TBD"}
                  </span>
                  <span>•</span>
                  <span>{selectedConversation.eventType}</span>
                  {selectedConversation.guestCount ? (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#C8A96A]" />
                        {selectedConversation.guestCount} Guests
                      </span>
                    </>
                  ) : null}
                  {selectedConversation.estimatedBudget ? (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-[#0F4C45]">
                        <DollarSign className="w-3.5 h-3.5 text-[#C8A96A]" />
                        Est. Budget: ₹
                        {selectedConversation.estimatedBudget.toLocaleString("en-IN")}
                      </span>
                    </>
                  ) : null}
                </div>

                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                    selectedConversation.hasVendorReply
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {selectedConversation.status === "new" &&
                  !selectedConversation.hasVendorReply
                    ? "Awaiting Vendor Reply"
                    : `Status: ${selectedConversation.status.toUpperCase()}`}
                </span>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FAF7F2]/30 to-white">
                <div className="text-center my-1">
                  <span className="bg-[#FAF7F2] text-[#082F2C]/50 border border-[#C8A96A]/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Conversation via Cloche
                  </span>
                </div>

                {selectedConversation.messages.map((msg, idx) => {
                  const isOwnBubble = selectedIsVendor
                    ? msg.sender === "vendor"
                    : msg.sender === "customer";

                  const prevMsg = idx > 0 ? selectedConversation.messages[idx - 1] : null;
                  const currDayKey = getDayKey(msg.rawCreatedAt);
                  const prevDayKey = getDayKey(prevMsg?.rawCreatedAt);
                  const showDayDivider = Boolean(currDayKey && currDayKey !== prevDayKey);

                  const quoteStatus = (msg.quotation?.status || "").toLowerCase();
                  const isQuoteResponded = [
                    "customer_interested",
                    "revision_requested",
                    "accepted",
                    "declined",
                  ].includes(quoteStatus);

                  return (
                    <React.Fragment key={msg.id}>
                      {showDayDivider && (
                        <div className="text-center my-2">
                          <span className="bg-white text-[#082F2C]/55 border border-[#C8A96A]/20 text-[10px] font-semibold px-3 py-1 rounded-full shadow-2xs">
                            {formatDayDividerLabel(msg.rawCreatedAt)}
                          </span>
                        </div>
                      )}

                      <div
                        className={`flex flex-col ${
                          isOwnBubble ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-end gap-2 max-w-[88%] sm:max-w-[75%]">
                          {!isOwnBubble && (
                            <VendorAvatar
                              src={
                                selectedIsVendor
                                  ? msg.senderAvatar || selectedConversation.customerAvatar
                                  : msg.senderAvatar ||
                                    selectedConversation.vendorAvatar
                              }
                              name={
                                selectedIsVendor
                                  ? selectedConversation.customerName
                                  : selectedConversation.vendorName
                              }
                              sizeClass="w-7 h-7 shrink-0 mb-5"
                              textClass="text-[10px]"
                            />
                          )}

                          <div className="space-y-1 min-w-0">
                            {/* Message Bubble */}
                            <div
                              className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                                isOwnBubble
                                  ? "bg-[#0F4C45] text-white rounded-br-xs"
                                  : "bg-white border border-[#C8A96A]/25 text-[#082F2C] rounded-bl-xs"
                              }`}
                            >
                              {msg.isAutoReply && (
                                <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#C8A96A] mb-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Instant Acknowledgement</span>
                                </div>
                              )}

                              <p className="whitespace-pre-wrap break-words">
                                {msg.text}
                              </p>

                              {/* Embed Quotation Card if present */}
                              {msg.quotation && (
                                <div className="mt-3 p-3.5 bg-[#FAF7F2] rounded-xl border border-[#C8A96A]/40 text-[#082F2C] space-y-2.5">
                                  <div className="flex items-start justify-between gap-2 border-b border-[#C8A96A]/20 pb-2">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <FileText className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                                        <span className="font-display font-bold text-sm text-[#0F4C45] truncate">
                                          {msg.quotation.title}
                                        </span>
                                      </div>
                                      {msg.quotation.validUntil && (
                                        <p className="text-[10px] text-[#082F2C]/55 flex items-center gap-1 mt-0.5">
                                          <Clock className="w-3 h-3" /> Valid until{" "}
                                          {new Date(
                                            msg.quotation.validUntil
                                          ).toLocaleDateString("en-IN", {
                                            dateStyle: "medium",
                                          })}
                                        </p>
                                      )}
                                    </div>
                                    <span className="font-bold text-base text-[#0F4C45] shrink-0">
                                      ₹{msg.quotation.amount.toLocaleString("en-IN")}
                                    </span>
                                  </div>

                                  {Array.isArray(msg.quotation.items) &&
                                    msg.quotation.items.length > 0 && (
                                      <div className="space-y-1 bg-white/80 rounded-lg p-2.5 border border-[#C8A96A]/15 text-[11px]">
                                        {msg.quotation.items.map((it, itemIdx) => (
                                          <div
                                            key={itemIdx}
                                            className="flex items-center justify-between gap-2"
                                          >
                                            <span className="text-[#082F2C]/85 truncate">
                                              {it.itemName} ({it.quantity}x)
                                            </span>
                                            <span className="font-semibold text-[#0F4C45] shrink-0">
                                              ₹{it.totalPrice.toLocaleString("en-IN")}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                  {msg.quotation.details && (
                                    <p className="text-xs text-[#082F2C]/80 leading-normal whitespace-pre-wrap">
                                      {msg.quotation.details}
                                    </p>
                                  )}

                                  {!selectedIsVendor && (
                                    <div className="pt-1 flex flex-wrap items-center gap-2">
                                      {isQuoteResponded && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                                          {quoteStatus.replace(/_/g, " ")}
                                        </span>
                                      )}
                                      <button
                                        type="button"
                                        disabled={quoteActionBusyId === msg.id}
                                        onClick={() =>
                                          handleQuotationResponse(msg, "accepted")
                                        }
                                        className="bg-[#0F4C45] hover:bg-[#12584C] disabled:opacity-50 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                                      >
                                        <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
                                        <span>Accept Quote</span>
                                      </button>
                                      <button
                                        type="button"
                                        disabled={quoteActionBusyId === msg.id}
                                        onClick={() =>
                                          handleQuotationResponse(
                                            msg,
                                            "revision_requested"
                                          )
                                        }
                                        className="bg-white hover:bg-[#FAF7F2] disabled:opacity-50 border border-[#C8A96A]/30 text-[#082F2C] font-semibold text-[11px] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                                      >
                                        Request Revision
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Time & Read Status */}
                            <div
                              className={`flex items-center gap-1 text-[10px] text-[#082F2C]/50 px-1 ${
                                isOwnBubble ? "justify-end" : "justify-start"
                              }`}
                            >
                              <span>
                                {formatMessageBubbleTime(
                                  msg.rawCreatedAt,
                                  msg.createdAt
                                )}
                              </span>
                              {isOwnBubble && (
                                <CheckCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Error banner if send failed */}
              {sendError && (
                <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-700 text-xs flex items-center justify-between shrink-0">
                  <span>{sendError}</span>
                  <button
                    type="button"
                    onClick={() => setSendError(null)}
                    className="text-rose-500 hover:text-rose-800 p-0.5 cursor-pointer"
                    aria-label="Dismiss error"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Quick Action Suggestion Chips */}
              {!selectedIsVendor && (
                <div className="px-4 py-2 bg-[#FAF7F2]/60 border-t border-[#C8A96A]/15 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px] shrink-0">
                  <span className="text-[#082F2C]/50 font-semibold shrink-0">
                    Quick reply:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleSendMessage("Are you available on our wedding date?")
                    }
                    className="bg-white hover:bg-[#FAF7F2] border border-[#C8A96A]/25 text-[#082F2C]/80 px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
                  >
                    Date availability?
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSendMessage(
                        "Could you share a detailed pricing and package breakdown?"
                      )
                    }
                    className="bg-white hover:bg-[#FAF7F2] border border-[#C8A96A]/25 text-[#082F2C]/80 px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
                  >
                    Send package breakdown
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleSendMessage(
                        "Can we schedule a call or visit this week?"
                      )
                    }
                    className="bg-white hover:bg-[#FAF7F2] border border-[#C8A96A]/25 text-[#082F2C]/80 px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
                  >
                    Schedule call / visit
                  </button>
                </div>
              )}

              {/* Auto-Resizing Message Composer */}
              <div className="p-3 sm:p-4 border-t border-[#C8A96A]/15 bg-white shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-end gap-2"
                >
                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 120) + "px";
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        (e.target as HTMLTextAreaElement).form?.requestSubmit();
                      }
                    }}
                    placeholder={`Message ${
                      selectedIsVendor
                        ? selectedConversation.customerName
                        : selectedConversation.vendorName
                    }...`}
                    className="flex-1 bg-[#FAF7F2] border border-[#C8A96A]/25 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#082F2C] placeholder:text-[#082F2C]/40 focus:outline-none focus:border-[#0F4C45] resize-none overflow-y-auto leading-relaxed transition-colors"
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="w-11 h-11 bg-[#0F4C45] hover:bg-[#12584C] disabled:opacity-40 text-white rounded-2xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 text-[#C8A96A]" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#C8A96A]/30 flex items-center justify-center text-[#0F4C45]">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#082F2C]">
                {isLoading
                  ? "Loading your inbox..."
                  : isGuest
                  ? "Sign in to access your inbox"
                  : conversations.length === 0
                  ? "No conversations yet"
                  : totalUnread > 0
                  ? `You have ${totalUnread} unread ${
                      totalUnread === 1 ? "reply" : "replies"
                    }`
                  : "Select a conversation"}
              </h3>
              <p className="text-xs text-[#082F2C]/60 max-w-sm leading-relaxed">
                {isLoading
                  ? "Retrieving your vendor inquiries, replies, and quotations."
                  : isGuest
                  ? "Log in to see all vendor replies, booking updates, and custom wedding quotations in one centralized inbox."
                  : conversations.length === 0
                  ? "Reach out to wedding photographers, venues, makeup artists, decorators, and studios to receive quotes and start chatting."
                  : "Choose a conversation from the inbox on the left to read replies, inspect quotations, and message vendors directly."}
              </p>
              {!isLoading &&
                (isGuest ? (
                  <Link
                    href="/login?redirect=/messages"
                    className="inline-flex items-center gap-1.5 bg-[#0F4C45] hover:bg-[#12584C] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shadow-xs"
                  >
                    <span>Log In to Messages</span>
                  </Link>
                ) : (
                  conversations.length === 0 && (
                    <Link
                      href="/venues"
                      className="inline-flex items-center gap-1.5 bg-[#0F4C45] hover:bg-[#12584C] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors shadow-xs"
                    >
                      <span>Explore Wedding Vendors</span>
                    </Link>
                  )
                ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
