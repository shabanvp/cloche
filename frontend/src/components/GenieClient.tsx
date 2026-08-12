"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Building2,
  Camera,
  Heart,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Star,
  MapPin,
  X,
  UserPlus,
  LogIn,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { queryAuraAssistant, AuraResponse, AuraVendorItem } from "@/lib/auraEngine";
import { BottomNavBar } from "@/components/BottomNavBar";

interface ChatMessage {
  id: string;
  sender: "aura" | "user";
  text: string;
  groundedVendors?: AuraVendorItem[];
  categoryUrl?: string;
  actionRequired?: "signup" | "login" | "none";
  timestamp: string;
}

export function GenieClient() {
  const [promptInput, setPromptInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "aura-init",
      sender: "aura",
      text: "Hi, I'm Aura, your Cloche AI Wedding Assistant. How can I help you today?",
      timestamp: "Just now",
    },
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const samplePrompts = [
    "Find wedding venues in Kochi",
    "Top rated photographers in Kerala",
    "Bridal makeup artists",
    "Traditional Kerala Sadya catering",
    "Kerala Hindu wedding rituals and Sadya tips",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSendPrompt = async (textToSend?: string) => {
    const query = (textToSend || promptInput).trim();
    if (!query || isThinking) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setPromptInput("");
    setIsThinking(true);

    try {
      const response: AuraResponse = await queryAuraAssistant(query);
      const auraMessage: ChatMessage = {
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
          text: "I encountered a network error while searching our live directory. Please try again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2D2520] flex flex-col pt-4 font-sans">
      {/* Hero Header */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0A3833] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#D4B66E] mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Cloche Aura • AI Discovery Concierge
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Discover Verified Wedding Partners
            </h1>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Ask Aura to search live verified banquet halls, candid photographers, bridal makeup artists, and caterers across Kerala.
            </p>
          </div>
        </div>
      </section>

      {/* Main Chat Assistant Workspace */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-6">
        <div className="bg-white rounded-3xl border border-gold/15 shadow-sm p-4 sm:p-6 flex flex-col h-[580px]">
          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    m.sender === "user"
                      ? "bg-[#0F4C45] text-white rounded-br-none"
                      : "bg-[#FAF7F2] text-charcoal border border-gold/15 rounded-bl-none"
                  }`}
                >
                  {m.text}

                  {/* Grounded Live Vendor Cards */}
                  {m.groundedVendors && m.groundedVendors.length > 0 && (
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gold/10">
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
                            className="flex items-center gap-3 bg-white hover:bg-gold/10 p-3 rounded-xl border border-gold/20 transition-all group"
                          >
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[#0F4C45] shrink-0 border border-gold/20 flex items-center justify-center text-white">
                              {v.coverImage ? (
                                <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                              ) : v.logo ? (
                                <img src={v.logo} alt={v.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-serif text-sm font-bold">{initials}</span>
                              )}
                            </div>

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

                  {/* Category Explore Link */}
                  {m.categoryUrl && (
                    <div className="mt-2.5 pt-2 border-t border-gold/10">
                      <Link
                        href={m.categoryUrl}
                        className="text-[11px] font-bold text-[#0F4C45] hover:underline flex items-center gap-1"
                      >
                        <span>Explore full category catalog</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  )}

                  {/* Action Decline Redirect Buttons */}
                  {m.actionRequired === "signup" && (
                    <div className="mt-3 flex items-center gap-2 pt-2 border-t border-gold/10">
                      <Link
                        href="/signup"
                        className="flex-1 bg-[#0F4C45] text-white py-1.5 px-3 rounded-lg text-center font-bold text-[11px] hover:bg-[#135951] transition-colors flex items-center justify-center gap-1"
                      >
                        <UserPlus className="h-3 w-3" /> Sign Up Free
                      </Link>
                      <Link
                        href="/login"
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

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-charcoal/60 bg-[#FAF7F2] p-3 rounded-2xl border border-gold/15 w-fit animate-pulse">
                <Sparkles className="w-4 h-4 text-gold animate-spin" />
                <span>Aura is searching live directory...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="pt-3 pb-2 border-t border-gold/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(p)}
                disabled={isThinking}
                className="text-[11px] whitespace-nowrap bg-[#FAF7F2] hover:bg-gold/15 text-charcoal/80 border border-gold/15 px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="pt-2 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask Aura: 'Find wedding venues in Kochi', 'Photographers in Kerala'..."
              disabled={isThinking}
              className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-2xl px-4 py-3 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45]"
            />
            <button
              type="submit"
              disabled={!promptInput.trim() || isThinking}
              className="h-11 px-5 rounded-2xl bg-[#0F4C45] hover:bg-[#135951] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-gold" /> Ask Aura
            </button>
          </form>
        </div>
      </main>

      <Footer />
      <BottomNavBar activeTab="home" />
    </div>
  );
}
