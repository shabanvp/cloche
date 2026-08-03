"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Building2,
  Shirt,
  Camera,
  Heart,
  Calculator,
  MessageCircle,
  Phone,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  UserCheck,
  Zap,
  Star,
  DollarSign,
  Calendar,
  X,
} from "lucide-react";
import { Footer } from "@/components/Footer";

export function GenieClient() {
  const [promptInput, setPromptInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "user" | "genie"; text: string; data?: any }[]
  >([
    {
      sender: "genie",
      text: "Namaste! I am Cloche Genie — your personal luxury wedding AI concierge. Ask me anything about finding dream venues, bridal couture, jewelry stores, budget planning, or vendor recommendations!",
    },
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const [budget, setBudget] = useState(2500000); // 25 Lakhs
  const [guests, setGuests] = useState(500);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultName, setConsultName] = useState("");
  const [consultPhone, setConsultPhone] = useState("");
  const [consultCity, setConsultCity] = useState("Kochi");
  const [consultSuccess, setConsultSuccess] = useState(false);

  const samplePrompts = [
    "Find luxury waterfront venues in Kerala for 500 guests under ₹20 Lakhs",
    "Suggest top bridal lehenga boutiques & royal jewelry stores in Jaipur",
    "Calculate estimated budget breakdown for 600 guests wedding in Udaipur",
    "Top rated luxury wedding photographers and makeup artists in Delhi",
  ];

  const handleSendPrompt = (textToSend?: string) => {
    const query = textToSend || promptInput;
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    if (!textToSend) setPromptInput("");
    setIsThinking(true);

    setTimeout(() => {
      let genieReply = "";
      let replyData = null;

      const lower = query.toLowerCase();
      if (lower.includes("venue") || lower.includes("kerala") || lower.includes("udaipur")) {
        genieReply =
          "Here are our top recommended luxury wedding venues matching your preferences with waterfront views and grand guest capacity:";
        replyData = {
          type: "venues",
          items: [
            {
              id: "grand-solitaire-resort",
              name: "Grand Solitaire Island Resort",
              location: "Kochi, Kerala",
              price: "₹2,50,000 / day",
              capacity: "300 - 3000 Guests",
              image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "palace-estate",
              name: "The Palace Estate",
              location: "Udaipur, Rajasthan",
              price: "₹8,00,000 / day",
              capacity: "500 - 1200 Guests",
              image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=600&q=80",
            },
          ],
        };
      } else if (lower.includes("boutique") || lower.includes("lehenga") || lower.includes("attire")) {
        genieReply =
          "Here are premier bridal & groom wear boutiques featuring royal silk sarees, designer lehengas, and handcrafted tuxedos:";
        replyData = {
          type: "boutiques",
          items: [
            {
              id: "posh-wedding-rental",
              name: "Posh Wedding Rental",
              category: "Bridal & Groom Couture",
              location: "MG Road, Kochi",
              image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
            },
            {
              id: "royal-heritage-boutique",
              name: "Royal Heritage Boutique",
              category: "Bridal Wear",
              location: "Jaipur, Rajasthan",
              image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
            },
          ],
        };
      } else if (lower.includes("budget") || lower.includes("calculate") || lower.includes("cost")) {
        genieReply = `Based on a total budget of ₹${(budget / 100000).toFixed(1)} Lakhs for ${guests} guests, here is your optimal wedding budget distribution:`;
        replyData = {
          type: "budget",
          venue: Math.round(budget * 0.45),
          attire: Math.round(budget * 0.20),
          decor: Math.round(budget * 0.15),
          photo: Math.round(budget * 0.10),
          misc: Math.round(budget * 0.10),
        };
      } else {
        genieReply =
          "I have curated personalized recommendations tailored to your style, budget, and location preferences. You can also connect directly with a senior Cloche Concierge Specialist for 1-on-1 assistance!";
      }

      setMessages((prev) => [
        ...prev,
        { sender: "genie", text: genieReply, data: replyData },
      ]);
      setIsThinking(false);
    }, 900);
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultSuccess(true);
    setTimeout(() => {
      setConsultSuccess(false);
      setIsConsultModalOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#2D2520] flex flex-col pt-4">
      {/* ─── HERO HEADER ─── */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0A3833] rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#C8A96A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C8A96A]/20 text-[#C8A96A] text-xs font-bold uppercase tracking-wider border border-[#C8A96A]/30">
              <Sparkles className="w-4 h-4 text-[#C8A96A]" />
              <span>AI Wedding Concierge</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              Cloche Genie Services
            </h1>

            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              Your 24/7 AI-powered wedding assistant. Discover verified venues, designer couture, smart budget breakdowns, and instant concierge support for your dream celebration.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setIsConsultModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-[#C8A96A] text-[#1A1410] font-bold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#D4AF37] transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Book 1-on-1 Concierge Call</span>
              </button>

              <a
                href="https://wa.me/?text=Hi%20Cloche%20Concierge,%20I%20need%20help%20planning%20my%20wedding!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONCIERGE CHAT & BUDGET WIDGET GRID ─── */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE GENIE CHAT (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#E2D5C0]/80 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2D5C0]/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 flex items-center justify-center text-[#0F4C45]">
                <Sparkles className="w-5 h-5 text-[#C8A96A]" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-[#1A1410]">Genie AI Concierge Chat</h2>
                <p className="text-xs text-[#7A6E65]">Ask questions or click sample prompts below</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4CAF50]/10 text-[#4CAF50] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" /> Live AI Active
            </span>
          </div>

          {/* Sample Prompt Badges */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#9A8D7D] uppercase tracking-wider">Suggested Prompts:</p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(sp)}
                  className="text-left text-xs bg-[#F5F0E8] hover:bg-[#0F4C45]/10 text-[#2D2520] hover:text-[#0F4C45] px-3 py-2 rounded-xl border border-[#E2D5C0]/60 transition-colors cursor-pointer"
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Log */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                    m.sender === "user"
                      ? "bg-[#0F4C45] text-white rounded-br-none"
                      : "bg-[#F5F0E8] text-[#1A1410] border border-[#E2D5C0]/60 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>

                {/* Render Rich Cards Output from AI */}
                {m.data?.type === "venues" && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {m.data.items.map((item: any) => (
                      <Link
                        key={item.id}
                        href={`/venues/${item.id}`}
                        className="bg-white rounded-2xl overflow-hidden border border-[#E2D5C0] shadow-xs hover:shadow-md transition-all group p-3 space-y-2"
                      >
                        <div className="relative h-28 w-full rounded-xl overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1A1410] text-xs line-clamp-1">{item.name}</h4>
                          <p className="text-[11px] text-[#7A6E65]">{item.location}</p>
                          <p className="text-xs font-semibold text-[#0F4C45] mt-1">{item.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {m.data?.type === "boutiques" && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {m.data.items.map((item: any) => (
                      <Link
                        key={item.id}
                        href={`/boutiques/${item.id}`}
                        className="bg-white rounded-2xl overflow-hidden border border-[#E2D5C0] shadow-xs hover:shadow-md transition-all group p-3 space-y-2"
                      >
                        <div className="relative h-28 w-full rounded-xl overflow-hidden">
                          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1A1410] text-xs line-clamp-1">{item.name}</h4>
                          <p className="text-[11px] text-[#7A6E65]">{item.category}</p>
                          <p className="text-xs text-[#0F4C45] font-medium mt-1">{item.location}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {m.data?.type === "budget" && (
                  <div className="mt-3 bg-[#F5F0E8] rounded-2xl p-4 border border-[#E2D5C0] w-full space-y-2 text-xs">
                    <div className="flex justify-between font-semibold text-[#1A1410]">
                      <span>Venue & Catering (45%):</span>
                      <span className="text-[#0F4C45]">₹{(m.data.venue / 100000).toFixed(2)} Lakhs</span>
                    </div>
                    <div className="flex justify-between text-[#7A6E65]">
                      <span>Attire & Jewellery (20%):</span>
                      <span>₹{(m.data.attire / 100000).toFixed(2)} Lakhs</span>
                    </div>
                    <div className="flex justify-between text-[#7A6E65]">
                      <span>Decor & Production (15%):</span>
                      <span>₹{(m.data.decor / 100000).toFixed(2)} Lakhs</span>
                    </div>
                    <div className="flex justify-between text-[#7A6E65]">
                      <span>Photo & Video (10%):</span>
                      <span>₹{(m.data.photo / 100000).toFixed(2)} Lakhs</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-xs text-[#7A6E65] bg-[#F5F0E8] p-3 rounded-2xl w-fit">
                <Sparkles className="w-4 h-4 text-[#C8A96A] animate-spin" />
                <span>Genie is analyzing your preferences...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendPrompt();
            }}
            className="flex items-center gap-2 pt-2 border-t border-[#E2D5C0]/60"
          >
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask Genie (e.g. recommend 5-star resort venues in Kochi)..."
              className="flex-1 bg-[#F5F0E8] border border-[#E2D5C0] rounded-2xl px-4 py-3 text-sm text-[#1A1410] outline-none focus:border-[#0F4C45] transition-colors"
            />
            <button
              type="submit"
              disabled={isThinking || !promptInput.trim()}
              className="w-12 h-12 bg-[#0F4C45] hover:bg-[#12584E] disabled:opacity-50 text-white rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: QUICK BUDGET ESTIMATOR & VIP SERVICES (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* BUDGET ESTIMATOR CARD */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D5C0]/80 space-y-5">
            <div className="flex items-center gap-3 border-b border-[#E2D5C0]/60 pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#C8A96A]/15 flex items-center justify-center text-[#C8A96A]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#1A1410] text-base">Instant Budget Breakdown</h3>
                <p className="text-xs text-[#7A6E65]">Slide to test your total wedding budget</p>
              </div>
            </div>

            {/* Slider 1: Total Budget */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#7A6E65]">Estimated Total Budget:</span>
                <span className="text-[#0F4C45] font-bold">₹{(budget / 100000).toFixed(1)} Lakhs</span>
              </div>
              <input
                type="range"
                min={500000}
                max={15000000}
                step={250000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full accent-[#0F4C45] cursor-pointer"
              />
            </div>

            {/* Slider 2: Guests Count */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#7A6E65]">Expected Guest Count:</span>
                <span className="text-[#0F4C45] font-bold">{guests} Guests</span>
              </div>
              <input
                type="range"
                min={100}
                max={2500}
                step={50}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full accent-[#0F4C45] cursor-pointer"
              />
            </div>

            {/* Visual Budget Breakdown Bars */}
            <div className="bg-[#F5F0E8] rounded-2xl p-4 border border-[#E2D5C0]/60 space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1A1410]">Venue & Catering (45%)</span>
                  <span className="text-[#0F4C45]">₹{((budget * 0.45) / 100000).toFixed(2)} L</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F4C45] w-[45%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1A1410]">Attire & Jewellery (20%)</span>
                  <span className="text-[#0F4C45]">₹{((budget * 0.20) / 100000).toFixed(2)} L</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#C8A96A] w-[20%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1A1410]">Decor & Styling (15%)</span>
                  <span className="text-[#0F4C45]">₹{((budget * 0.15) / 100000).toFixed(2)} L</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#12584E] w-[15%]" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#1A1410]">Photo & Video (10%)</span>
                  <span className="text-[#0F4C45]">₹{((budget * 0.10) / 100000).toFixed(2)} L</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-[#9A8D7D] w-[10%]" />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSendPrompt(`Calculate detailed budget breakdown for ₹${(budget / 100000).toFixed(1)} Lakhs and ${guests} guests`)}
              className="w-full py-3 bg-[#0F4C45] hover:bg-[#12584E] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ask Genie to Optimize Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* VIP CONCIERGE ASSISTANCE CARD */}
          <div className="bg-gradient-to-br from-[#1A1410] to-[#2D2520] rounded-3xl p-6 text-white space-y-4 shadow-md border border-[#C8A96A]/30 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C8A96A]/20 flex items-center justify-center text-[#C8A96A]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#C8A96A] text-base">Human Concierge Desk</h3>
                <p className="text-xs text-white/70">Personal assistance for luxury weddings</p>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">
              Need direct negotiation with venues, custom designer appointments, or site inspection coordination? Our senior wedding managers are here to assist you.
            </p>

            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="w-full py-3 bg-[#C8A96A] hover:bg-[#D4AF37] text-[#1A1410] rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Request Personal Callback</span>
              <Phone className="w-4 h-4" />
            </button>
          </div>

        </div>

      </main>

      {/* ─── MODAL: 1-ON-1 CONCIERGE CALL ─── */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E2D5C0] relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsConsultModalOpen(false)}
              className="absolute top-4 right-4 text-[#9A8D7D] hover:text-[#1A1410] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 flex items-center justify-center text-[#0F4C45]">
                <Phone className="w-5 h-5 text-[#0F4C45]" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-[#1A1410]">Book Concierge Callback</h3>
                <p className="text-xs text-[#7A6E65]">Free 15-min consultation with a wedding specialist</p>
              </div>
            </div>

            {consultSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald/10 text-emerald rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-[#0F4C45]" />
                </div>
                <h4 className="font-bold text-[#1A1410] text-base">Request Received!</h4>
                <p className="text-xs text-[#7A6E65]">
                  Our senior concierge specialist will reach out to you within 2 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-[#1A1410] block mb-1">Your Name *</label>
                  <input
                    required
                    type="text"
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    placeholder="Ananya Sharma"
                    className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl px-4 py-2.5 outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1410] block mb-1">Phone Number *</label>
                  <input
                    required
                    type="tel"
                    value={consultPhone}
                    onChange={(e) => setConsultPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl px-4 py-2.5 outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1A1410] block mb-1">Preferred Wedding City</label>
                  <input
                    type="text"
                    value={consultCity}
                    onChange={(e) => setConsultCity(e.target.value)}
                    placeholder="Kochi, Udaipur, Jaipur..."
                    className="w-full bg-[#F5F0E8] border border-[#E2D5C0] rounded-xl px-4 py-2.5 outline-none focus:border-[#0F4C45]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0F4C45] hover:bg-[#0A3833] text-white rounded-2xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
                >
                  Request Call Back
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
