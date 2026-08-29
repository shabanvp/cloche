"use client";

import React from "react";
import Link from "next/link";
import { Calculator, Users, CheckSquare, Clock, LayoutGrid, DollarSign, ArrowRight, Sparkles } from "lucide-react";

interface PlanningTool {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  href: string;
  badge: string;
  color: string;
}

const PLANNING_TOOLS: PlanningTool[] = [
  {
    id: "tool-budget",
    title: "Budget Planner",
    subtitle: "Track allocations, payments & category caps",
    icon: Calculator,
    href: "/user/dashboard",
    badge: "Interactive",
    color: "bg-[#E7F0EF] text-[#0F4C45]",
  },
  {
    id: "tool-guests",
    title: "Guest Manager",
    subtitle: "RSVP tracking, dietary notes & WhatsApp invites",
    icon: Users,
    href: "/user/dashboard",
    badge: "Smart Sync",
    color: "bg-[#FFF5E6] text-[#A97B3E]",
  },
  {
    id: "tool-checklist",
    title: "Wedding Checklist",
    subtitle: "12-month countdown task list & deadlines",
    icon: CheckSquare,
    href: "/user/dashboard",
    badge: "Essential",
    color: "bg-[#F5EFE6] text-[#8C6B28]",
  },
  {
    id: "tool-timeline",
    title: "Day-Of Timeline",
    subtitle: "Hourly schedule for muhurtham, reception & photography",
    icon: Clock,
    href: "/user/dashboard",
    badge: "Organizer",
    color: "bg-[#E7F0EF] text-[#0F4C45]",
  },
  {
    id: "tool-seating",
    title: "Seating Planner",
    subtitle: "Visual table layout for guests & VIP seating",
    icon: LayoutGrid,
    href: "/user/dashboard",
    badge: "Visual Layout",
    color: "bg-[#FFF5E6] text-[#A97B3E]",
  },
  {
    id: "tool-expense",
    title: "Expense Tracker",
    subtitle: "Vendor advance logs, pending balances & receipts",
    icon: DollarSign,
    href: "/user/dashboard",
    badge: "Financials",
    color: "bg-[#F5EFE6] text-[#8C6B28]",
  },
];

export function PlanningToolsSection() {
  return (
    <section className="py-12 bg-[#FAF7F2] border-y border-[#EBE4D8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header with Progress Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-[#EBE4D8] shadow-sm">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A97B3E]" />
              <span className="text-xs font-semibold tracking-widest uppercase text-[#A97B3E]">
                Personal Command Desk
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#0F4C45] tracking-tight">
              Wedding Planning Ecosystem
            </h2>
            <p className="text-xs text-[#5C5549] font-light">
              Keep your venue bookings, guest lists, and budget synchronized in real time.
            </p>
          </div>

          {/* Progress Indicator Card */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EBE4D8] min-w-[260px] space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-[#0F4C45]">
              <span>Wedding Planning</span>
              <span className="text-[#A97B3E]">45% Complete</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#EBE4D8] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#0F4C45] to-[#C8A96A] rounded-full w-[45%]" />
            </div>
            <div className="flex justify-between items-center text-[10px] text-[#7A776E] pt-0.5">
              <span>9 Tasks Remaining</span>
              <Link href="/user/dashboard" className="text-[#0F4C45] font-bold hover:underline">
                Continue →
              </Link>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLANNING_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group bg-white rounded-3xl p-6 border border-[#EBE4D8] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tool.color} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#7A776E] border border-[#EBE4D8] text-[11px] font-semibold">
                    {tool.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-[#0F4C45] group-hover:text-[#A97B3E] transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-[#5C5549] mt-1 font-light leading-relaxed">
                    {tool.subtitle}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-semibold text-[#0F4C45] group-hover:text-[#A97B3E]">
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
