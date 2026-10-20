"use client";

import Link from "next/link";
import { 
  Building2, 
  Camera, 
  Shirt, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Compass,
  CheckSquare
} from "lucide-react";

interface JourneyStep {
  number: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  href: string;
  ctaText: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    number: "01",
    title: "Reserve Your Dream Venue",
    category: "Step 1: The Foundation",
    description: "Lock in Kerala's finest banquet halls, heritage palaces, or beachside destination lawns.",
    icon: Building2,
    href: "/venues",
    ctaText: "Browse Venues",
  },
  {
    number: "02",
    title: "Book Photo & Cinema",
    category: "Step 2: Storytelling",
    description: "Secure candid cinematographers and photographers to immortalize every ceremonial glance.",
    icon: Camera,
    href: "/photographers",
    ctaText: "Find Studios",
  },
  {
    number: "03",
    title: "Curate Wedding Couture",
    category: "Step 3: Attire & Styling",
    description: "Explore bridal lehengas, Kanchipuram silks, bespoke groom sherwanis, and bridal makeup.",
    icon: Shirt,
    href: "/categories/bridal-studio",
    ctaText: "Explore Studios",
  },
  {
    number: "04",
    title: "Stage Decor & Sadya Feasts",
    category: "Step 4: Ambiance & Food",
    description: "Coordinate floral mandaps, ambient lighting, and traditional Kerala wedding catering feasts.",
    icon: Sparkles,
    href: "/categories/decor-planning",
    ctaText: "Plan Decor & Food",
  },
  {
    number: "05",
    title: "Send Signature Invites",
    category: "Step 5: The Announcement",
    description: "Craft bespoke stationery suites and animated digital video invitations with live RSVP.",
    icon: Mail,
    href: "/digital-invitations",
    ctaText: "Design Invites",
  },
];

export function WeddingPlanningJourneySection() {
  return (
    <section className="pt-5 pb-7 md:pt-6 md:pb-9">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-0.5 rounded-full bg-white border border-[#C6A568]/20 text-[#064E43] text-xs font-bold tracking-wider uppercase shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-[#C6A568]" /> Planning Roadmap
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-[#242321]">
            Your Wedding Planning Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#242321]/65 leading-relaxed">
            From discovering your premier venue to the final invitation send-out — simplify your wedding timeline with Cloche
          </p>
        </div>

        {/* 5-Step Journey Horizontal Grid / Mobile Swipe */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl p-5 border border-[#C6A568]/20 hover:border-[#064E43] transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
              >
                <div>
                  {/* Step Header with Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif font-black text-xl text-[#064E43]/40 group-hover:text-[#064E43] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#C6A568]/25 text-[#064E43] flex items-center justify-center shadow-2xs group-hover:bg-[#064E43] group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <span className="text-[10.5px] font-bold text-[#C6A568] uppercase tracking-wider block mb-1">
                    {step.category}
                  </span>

                  <h3 className="font-serif font-bold text-base text-[#242321] group-hover:text-[#064E43] transition-colors leading-snug mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#242321]/65 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                {/* Direct Category Route Link */}
                <Link
                  href={step.href}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#064E43] group-hover:text-[#C6A568] transition-colors pt-2 border-t border-black/5"
                >
                  <span>{step.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Bottom Checklist Banner */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#064E43] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#C6A568] shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm sm:text-base text-white">
                Want a personalized interactive wedding checklist?
              </h4>
              <p className="text-xs text-white/70">
                Track appointments, budgets, and vendor milestones in real-time.
              </p>
            </div>
          </div>

          <Link
            href="/user/dashboard/checklist"
            className="px-5 py-2.5 rounded-full bg-[#C6A568] hover:bg-[#D4B66E] text-[#064E43] font-bold text-xs transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            Open Wedding Checklist
          </Link>
        </div>

      </div>
    </section>
  );
}
