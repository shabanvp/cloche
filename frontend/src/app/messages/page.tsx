"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Clock,
  Check,
  CheckCheck,
  Camera,
  Palette,
  Sparkle,
  Filter,
  RefreshCw,
} from "lucide-react";
import { ChatMessage, ConversationItem } from "@/app/api/v1/messages/route";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "quotes" | "photography" | "venues" | "makeup">("all");
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [userRole, setUserRole] = useState<string>("customer");
  const [isGuest, setIsGuest] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Load conversations
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/messages", { cache: "no-store" }).then((r) => r.json());
      if (res.success && Array.isArray(res.data?.conversations)) {
        let loaded: ConversationItem[] = res.data.conversations;

        // Merge any locally saved extra messages from localStorage
        try {
          const localStored = localStorage.getItem("cloche_user_chat_messages");
          if (localStored) {
            const parsed = JSON.parse(localStored);
            if (typeof parsed === "object" && parsed !== null) {
              loaded = loaded.map((c) => {
                const extras: ChatMessage[] = parsed[c.id] || [];
                if (extras.length > 0) {
                  const combined = [...c.messages];
                  const existingIds = new Set(combined.map((m) => m.id));
                  for (const ext of extras) {
                    if (!existingIds.has(ext.id)) {
                      combined.push(ext);
                    }
                  }
                  return {
                    ...c,
                    messages: combined,
                    lastMessageSnippet: combined[combined.length - 1].text,
                    lastMessageTime: combined[combined.length - 1].createdAt,
                  };
                }
                return c;
              });
            }
          }
        } catch (e) {}

        setConversations(loaded);
        if (loaded.length > 0 && !selectedConvId) {
          setSelectedConvId(loaded[0].id);
        }
        setIsGuest(!res.data.authenticatedUser);
      }
    } catch (e) {
      console.error("[MessagesPage] Error fetching messages:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConvId) || conversations[0] || null;
  }, [conversations, selectedConvId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (selectedConversation) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedConversation?.messages.length, selectedConvId]);

  // Handle Mark as Read
  const handleSelectConversation = (id: string) => {
    setSelectedConvId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        c.vendorName.toLowerCase().includes(q) ||
        c.vendorCategory.toLowerCase().includes(q) ||
        c.vendorCity.toLowerCase().includes(q) ||
        c.lastMessageSnippet.toLowerCase().includes(q);

      if (!matchSearch) return false;

      if (activeFilter === "unread") return c.unreadCount > 0;
      if (activeFilter === "quotes") return c.status === "quoted" || c.messages.some((m) => !!m.quotation);
      if (activeFilter === "photography") return c.vendorCategory.toLowerCase().includes("photo") || c.vendorCategory.toLowerCase().includes("video");
      if (activeFilter === "venues") return c.vendorCategory.toLowerCase().includes("venue");
      if (activeFilter === "makeup") return c.vendorCategory.toLowerCase().includes("makeup") || c.vendorCategory.toLowerCase().includes("styling");

      return true;
    });
  }, [conversations, searchQuery, activeFilter]);

  // Send new message
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || !selectedConversation) return;

    setIsSending(true);
    const newMsg: ChatMessage = {
      id: `local-msg-${Date.now()}`,
      sender: "customer",
      senderName: "You",
      text: content,
      createdAt: "Just now",
      isRead: true,
    };

    // Optimistically update conversation state
    const updatedConvs = conversations.map((c) => {
      if (c.id === selectedConversation.id) {
        return {
          ...c,
          lastMessageSnippet: content,
          lastMessageTime: "Just now",
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setInputText("");

    // Persist to localStorage
    try {
      const stored = localStorage.getItem("cloche_user_chat_messages") || "{}";
      const parsed = JSON.parse(stored);
      parsed[selectedConversation.id] = [...(parsed[selectedConversation.id] || []), newMsg];
      localStorage.setItem("cloche_user_chat_messages", JSON.stringify(parsed));
      window.dispatchEvent(new Event("cloche_messages_updated"));
    } catch (e) {}

    // Dispatch API POST
    try {
      await fetch("/api/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          leadId: selectedConversation.leadId,
          text: content,
          sender: "customer",
        }),
      });
    } catch (e) {
      console.warn("Offline or simulated message response:", e);
    } finally {
      setIsSending(false);
    }
  };

  // Accept Quotation handler
  const handleAcceptQuotation = (quotationTitle: string, amount: number) => {
    const confirmationText = `We have accepted your quotation for "${quotationTitle}" (₹${amount.toLocaleString("en-IN")}). Please share the contract terms and payment schedule to confirm booking.`;
    handleSendMessage(confirmationText);
  };

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#082F2C]">

      {/* Main Inbox Container */}
      <main className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 py-4 sm:py-6">
        <div className="bg-white rounded-3xl border border-[#C8A96A]/20 shadow-[0_12px_45px_rgba(0,0,0,0.06)] overflow-hidden min-h-[640px] flex flex-col md:flex-row">
          
          {/* LEFT COLUMN: Conversation List */}
          <div
            className={`w-full md:w-[360px] lg:w-[400px] border-r border-[#C8A96A]/15 flex flex-col bg-[#FAF7F2]/50 ${
              selectedConvId && "hidden md:flex"
            }`}
          >
            {/* Search & Filter Header */}
            <div className="p-4 border-b border-[#C8A96A]/15 bg-white space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#C8A96A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search vendor or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#C8A96A]/25 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#082F2C] placeholder:text-[#082F2C]/40 focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
                    activeFilter === "all"
                      ? "bg-[#0F4C45] text-white"
                      : "bg-[#FAF7F2] text-[#082F2C]/70 hover:bg-[#C8A96A]/15"
                  }`}
                >
                  All ({conversations.length})
                </button>
                <button
                  onClick={() => setActiveFilter("unread")}
                  className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
                    activeFilter === "unread"
                      ? "bg-[#0F4C45] text-white"
                      : "bg-[#FAF7F2] text-[#082F2C]/70 hover:bg-[#C8A96A]/15"
                  }`}
                >
                  Unread ({totalUnreadCount})
                </button>
                <button
                  onClick={() => setActiveFilter("quotes")}
                  className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
                    activeFilter === "quotes"
                      ? "bg-[#0F4C45] text-white"
                      : "bg-[#FAF7F2] text-[#082F2C]/70 hover:bg-[#C8A96A]/15"
                  }`}
                >
                  Quotes
                </button>
                <button
                  onClick={() => setActiveFilter("photography")}
                  className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
                    activeFilter === "photography"
                      ? "bg-[#0F4C45] text-white"
                      : "bg-[#FAF7F2] text-[#082F2C]/70 hover:bg-[#C8A96A]/15"
                  }`}
                >
                  Photos
                </button>
                <button
                  onClick={() => setActiveFilter("venues")}
                  className={`px-3 py-1 rounded-full font-semibold shrink-0 transition-colors ${
                    activeFilter === "venues"
                      ? "bg-[#0F4C45] text-white"
                      : "bg-[#FAF7F2] text-[#082F2C]/70 hover:bg-[#C8A96A]/15"
                  }`}
                >
                  Venues
                </button>
              </div>
            </div>

            {/* Conversation Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#C8A96A]/10">
              {isLoading ? (
                <div className="p-8 text-center text-xs text-[#082F2C]/60 space-y-2">
                  <RefreshCw className="w-5 h-5 text-[#C8A96A] animate-spin mx-auto" />
                  <p>Loading messages...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((item) => {
                  const isSelected = item.id === selectedConversation?.id;
                  const hasUnread = item.unreadCount > 0;
                  const latestMsg = item.messages[item.messages.length - 1];
                  const hasQuote = latestMsg?.quotation || item.status === "quoted";

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectConversation(item.id)}
                      className={`p-4 cursor-pointer transition-all flex items-start gap-3 relative ${
                        isSelected
                          ? "bg-white shadow-xs border-l-4 border-l-[#0F4C45]"
                          : "hover:bg-white/80"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={item.vendorAvatar || "https://images.unsplash.com/photo-1519741497674-611481863552?w=150"}
                          alt={item.vendorName}
                          className="w-12 h-12 rounded-full object-cover border border-[#C8A96A]/30 shadow-xs"
                        />
                        {hasUnread && (
                          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#C8A96A] border-2 border-white rounded-full" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="font-bold text-xs sm:text-sm text-[#082F2C] truncate flex items-center gap-1">
                            <span>{item.vendorName}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A96A] shrink-0" />
                          </h4>
                          <span className="text-[10px] text-[#082F2C]/50 shrink-0 font-medium">
                            {item.lastMessageTime.split("at")[0].trim()}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F4C45] bg-[#0F4C45]/8 px-2 py-0.5 rounded-md">
                            {item.vendorCategory}
                          </span>
                          {hasQuote && (
                            <span className="text-[10px] font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-2 py-0.5 rounded-md">
                              Quote Available
                            </span>
                          )}
                        </div>

                        <p
                          className={`text-xs truncate ${
                            hasUnread ? "font-bold text-[#082F2C]" : "text-[#082F2C]/70"
                          }`}
                        >
                          {item.lastMessageSnippet}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center space-y-3">
                  <MessageSquare className="w-8 h-8 text-[#C8A96A]/40 mx-auto" />
                  <p className="text-xs font-semibold text-[#082F2C]/80">No conversations found</p>
                  <p className="text-[11px] text-[#082F2C]/50">
                    Try changing your search terms or explore vendors to send quote requests.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Chat Thread */}
          {selectedConversation ? (
            <div
              className={`flex-1 flex flex-col bg-white ${
                !selectedConvId ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Chat Thread Header */}
              <div className="px-4 py-3.5 border-b border-[#C8A96A]/15 bg-[#FAF7F2]/40 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setSelectedConvId("")}
                    className="md:hidden p-1.5 text-[#0F4C45] hover:bg-[#FAF7F2] rounded-xl"
                    aria-label="Back to conversations list"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <img
                    src={selectedConversation.vendorAvatar}
                    alt={selectedConversation.vendorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#C8A96A]/30 shrink-0"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-bold text-sm sm:text-base text-[#082F2C] truncate">
                        {selectedConversation.vendorName}
                      </h3>
                      <CheckCircle2 className="w-4 h-4 text-[#C8A96A] shrink-0" />
                    </div>
                    <p className="text-[11px] text-[#082F2C]/60 flex items-center gap-1 truncate">
                      <span>{selectedConversation.vendorCategory}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3 text-[#0F4C45]" />
                      <span>{selectedConversation.vendorCity}</span>
                    </p>
                  </div>
                </div>

                {/* Header CTA actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {selectedConversation.vendorPhone && (
                    <a
                      href={`tel:${selectedConversation.vendorPhone}`}
                      className="hidden sm:flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#C8A96A]/15 border border-[#C8A96A]/30 text-[#0F4C45] text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                      title="Call vendor"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C8A96A]" />
                      <span>Call</span>
                    </a>
                  )}

                  <Link
                    href={`/boutiques`}
                    className="flex items-center gap-1 bg-[#0F4C45] hover:bg-[#12584C] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors shadow-xs"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3 text-[#C8A96A]" />
                  </Link>
                </div>
              </div>

              {/* Pinned Inquiry Summary Banner */}
              <div className="bg-[#FAF7F2] px-4 py-2.5 border-b border-[#C8A96A]/10 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-3 text-[#082F2C]/80">
                  <span className="font-bold text-[#0F4C45] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#C8A96A]" />
                    {selectedConversation.eventDate ? new Date(selectedConversation.eventDate).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Date TBD"}
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
                        Est. Budget: ₹{selectedConversation.estimatedBudget.toLocaleString("en-IN")}
                      </span>
                    </>
                  ) : null}
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Status: {selectedConversation.status.toUpperCase()}
                </span>
              </div>

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FAF7F2]/30 to-white">
                <div className="text-center my-2">
                  <span className="bg-[#FAF7F2] text-[#082F2C]/50 border border-[#C8A96A]/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Conversation Started via Cloche
                  </span>
                </div>

                {selectedConversation.messages.map((msg) => {
                  const isUser = msg.sender === "customer";

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                        {!isUser && (
                          <img
                            src={msg.senderAvatar || selectedConversation.vendorAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-[#C8A96A]/30 shrink-0 mb-1"
                          />
                        )}

                        <div className="space-y-1">
                          {/* Message Bubble */}
                          <div
                            className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                              isUser
                                ? "bg-[#0F4C45] text-white rounded-br-xs"
                                : "bg-white border border-[#C8A96A]/25 text-[#082F2C] rounded-bl-xs"
                            }`}
                          >
                            <p>{msg.text}</p>

                            {/* Embed Quotation Card if present */}
                            {msg.quotation && (
                              <div className="mt-3 p-3.5 bg-[#FAF7F2] rounded-xl border border-[#C8A96A]/40 text-[#082F2C] space-y-2">
                                <div className="flex items-center justify-between gap-2 border-b border-[#C8A96A]/20 pb-2">
                                  <span className="font-display font-bold text-sm text-[#0F4C45]">
                                    {msg.quotation.title}
                                  </span>
                                  <span className="font-bold text-base text-[#0F4C45]">
                                    ₹{msg.quotation.amount.toLocaleString("en-IN")}
                                  </span>
                                </div>

                                {msg.quotation.details && (
                                  <p className="text-xs text-[#082F2C]/80 leading-normal">
                                    {msg.quotation.details}
                                  </p>
                                )}

                                <div className="pt-2 flex flex-wrap items-center gap-2">
                                  <button
                                    onClick={() =>
                                      handleAcceptQuotation(
                                        msg.quotation?.title || "Quotation",
                                        msg.quotation?.amount || 0
                                      )
                                    }
                                    className="bg-[#0F4C45] hover:bg-[#12584C] text-white font-bold text-[11px] px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5 text-[#C8A96A]" />
                                    <span>Accept Quote</span>
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleSendMessage(
                                        `Thank you for the proposal. Could you provide an option to customize the inclusions for our wedding?`
                                      )
                                    }
                                    className="bg-white hover:bg-[#FAF7F2] border border-[#C8A96A]/30 text-[#082F2C] font-semibold text-[11px] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                                  >
                                    Request Revision
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Time & Read Status */}
                          <div
                            className={`flex items-center gap-1 text-[10px] text-[#082F2C]/50 px-1 ${
                              isUser ? "justify-end" : "justify-start"
                            }`}
                          >
                            <span>{msg.createdAt}</span>
                            {isUser && (
                              <CheckCheck className="w-3.5 h-3.5 text-[#C8A96A]" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Suggestion Chips */}
              <div className="px-4 py-2 bg-[#FAF7F2]/60 border-t border-[#C8A96A]/15 flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
                <span className="text-[#082F2C]/50 font-semibold shrink-0">Quick reply:</span>
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
                    handleSendMessage("Could you share a detailed pricing and package breakdown?")
                  }
                  className="bg-white hover:bg-[#FAF7F2] border border-[#C8A96A]/25 text-[#082F2C]/80 px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
                >
                  Send package breakdown
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleSendMessage("Can we schedule a call or in-person meeting this week?")
                  }
                  className="bg-white hover:bg-[#FAF7F2] border border-[#C8A96A]/25 text-[#082F2C]/80 px-2.5 py-1 rounded-full shrink-0 transition-colors cursor-pointer"
                >
                  Schedule meeting
                </button>
              </div>

              {/* Message Composer */}
              <div className="p-3 sm:p-4 border-t border-[#C8A96A]/15 bg-white">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${selectedConversation.vendorName}...`}
                    className="flex-1 bg-[#FAF7F2] border border-[#C8A96A]/25 rounded-2xl px-4 py-3 text-xs sm:text-sm text-[#082F2C] placeholder:text-[#082F2C]/40 focus:outline-none focus:border-[#0F4C45]"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="bg-[#0F4C45] hover:bg-[#12584C] disabled:opacity-40 text-white p-3 rounded-2xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 text-[#C8A96A]" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex flex-col items-center justify-center p-12 text-center space-y-4 bg-white">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#C8A96A]/30 flex items-center justify-center text-[#C8A96A]">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#082F2C]">
                Select a conversation
              </h3>
              <p className="text-xs text-[#082F2C]/60 max-w-sm">
                Choose a vendor conversation on the left to review your wedding inquiries, messages, and quotation proposals.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

