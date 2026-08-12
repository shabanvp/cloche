"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, Send, X, Star, MapPin, CheckCircle2, 
  ArrowRight, ExternalLink, RefreshCw, AlertCircle, 
  HeartHandshake, ChevronRight, UserPlus, LogIn
} from "lucide-react";
import { queryAuraAssistant, AuraResponse, AuraVendorItem } from "@/lib/auraEngine";

interface AuraChatMessage {
  id: string;
  sender: "aura" | "user";
  text: string;
  groundedVendors?: AuraVendorItem[];
  categoryUrl?: string;
  actionRequired?: "signup" | "login" | "none";
  timestamp: string;
}

interface AuraAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuraAssistantDrawer({ isOpen, onClose }: AuraAssistantDrawerProps) {
  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AuraChatMessage[]>([
    {
      id: "aura-welcome",
      sender: "aura",
      text: "Hi, I'm Aura, your Cloche AI Wedding Assistant. How can I help you today?",
      timestamp: "Just now",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputQuery).trim();
    if (!textToSend || isTyping) return;

    const userMessage: AuraChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputQuery("");
    setIsTyping(true);

    try {
      const response: AuraResponse = await queryAuraAssistant(textToSend);
      const auraMessage: AuraChatMessage = {
        id: `aura-${Date.now()}`,
        sender: "aura",
        text: response.reply,
        groundedVendors: response.groundedVendors,
        categoryUrl: response.categoryUrl,
        actionRequired: response.actionRequired,
        timestamp: "Just now",
      };
      setMessages((prev) => [...prev, auraMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `aura-err-${Date.now()}`,
          sender: "aura",
          text: "I encountered a network issue while searching our live directory. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const sampleChips = [
    "Find wedding venues in Kochi",
    "Top photographers in Kerala",
    "Bridal makeup artists",
    "Traditional Kerala Sadya catering",
    "Kerala Christian wedding traditions",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300 font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 border-l border-gold/20 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="bg-[#0F4C45] text-white p-4 sm:p-5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] text-[#0F4C45] flex items-center justify-center shadow-sm border border-white/40 shrink-0">
              <Sparkles className="h-5 w-5 fill-[#0F4C45] text-[#0F4C45]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-lg leading-none">Aura</h3>
                <span className="bg-emerald-800 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-600">
                  AI Assistant
                </span>
              </div>
              <p className="text-[11px] text-white/80 mt-0.5">Cloche Guest Discovery Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  m.sender === "user"
                    ? "bg-[#0F4C45] text-white rounded-br-none"
                    : "bg-white text-charcoal border border-gold/15 rounded-bl-none"
                }`}
              >
                {m.text}

                {/* Grounded Vendor Cards */}
                {m.groundedVendors && m.groundedVendors.length > 0 && (
                  <div className="mt-3 space-y-2.5 pt-2 border-t border-gold/10">
                    {m.groundedVendors.map((v) => {
                      const initials = v.name
                        .split(" ")
                        .map((w: string) => w[0])
                        .filter(Boolean)
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "V";

                      return (
                        <Link
                          key={v.id}
                          href={v.detailUrl}
                          onClick={onClose}
                          className="flex items-center gap-3 bg-[#FAF7F2] hover:bg-[#F3EDE2] p-2.5 rounded-xl border border-gold/15 transition-all group block"
                        >
                          {/* Thumbnail with Logo Avatar */}
                          <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[#0F4C45] shrink-0 border border-gold/20 flex items-center justify-center text-white">
                            {v.coverImage ? (
                              <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                            ) : v.logo ? (
                              <img src={v.logo} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-serif text-sm font-bold">{initials}</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal truncate group-hover:text-[#0F4C45] transition-colors">
                                {v.name}
                              </h4>
                              {v.isVerified && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-[#0F4C45] shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-charcoal/60 truncate flex items-center gap-1 mt-0.5">
                              <MapPin className="h-3 w-3 text-charcoal/40 shrink-0" />
                              <span>{v.city}, {v.state}</span>
                            </p>
                            <div className="flex items-center justify-between gap-2 mt-1">
                              <div className="flex items-center gap-1 text-[11px]">
                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                <span className="font-semibold text-charcoal">
                                  {v.rating > 0 ? v.rating.toFixed(1) : "New"}
                                </span>
                              </div>
                              <span className="text-[11px] font-bold text-[#0F4C45]">
                                {v.startingPrice}
                              </span>
                            </div>
                          </div>

                          <ChevronRight className="h-4 w-4 text-charcoal/40 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Category Browse Link */}
                {m.categoryUrl && (
                  <div className="mt-2.5 pt-2 border-t border-gold/10">
                    <Link
                      href={m.categoryUrl}
                      onClick={onClose}
                      className="text-[11px] font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                    >
                      <span>Explore all category listings</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                )}

                {/* Action Required Redirects (Sign up / Log in) */}
                {m.actionRequired === "signup" && (
                  <div className="mt-3 flex items-center gap-2 pt-2 border-t border-gold/10">
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="flex-1 bg-[#0F4C45] text-white py-1.5 px-3 rounded-lg text-center font-bold text-[11px] hover:bg-[#135951] transition-colors flex items-center justify-center gap-1"
                    >
                      <UserPlus className="h-3 w-3" /> Sign Up Free
                    </Link>
                    <Link
                      href="/login"
                      onClick={onClose}
                      className="flex-1 bg-[#FAF7F2] border border-gold/20 text-[#0F4C45] py-1.5 px-3 rounded-lg text-center font-bold text-[11px] hover:bg-gold/10 transition-colors flex items-center justify-center gap-1"
                    >
                      <LogIn className="h-3 w-3" /> Log In
                    </Link>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-charcoal/40 px-1 mt-1">{m.timestamp}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-charcoal/60 bg-white p-3 rounded-2xl border border-gold/15 w-fit shadow-xs animate-pulse">
              <Sparkles className="h-4 w-4 text-gold animate-spin" />
              <span>Aura is checking live directory...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-4 py-2 border-t border-gold/10 bg-white/70 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              disabled={isTyping}
              className="text-[11px] whitespace-nowrap bg-[#FAF7F2] hover:bg-gold/15 text-charcoal/80 border border-gold/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 sm:p-4 bg-white border-t border-gold/15 flex items-center gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Aura to find venues, caterers, photographers..."
            disabled={isTyping}
            className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="h-10 w-10 rounded-xl bg-[#0F4C45] hover:bg-[#135951] disabled:opacity-40 text-white flex items-center justify-center shadow-xs transition-colors shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="h-4 w-4 text-gold" />
          </button>
        </form>
      </div>
    </div>
  );
}
