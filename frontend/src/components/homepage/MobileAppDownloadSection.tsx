"use client";

import React from "react";
import { QrCode, Smartphone, Apple, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export function MobileAppDownloadSection() {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0F4C45] via-[#166057] to-[#0F4C45] text-white p-8 md:p-12 overflow-hidden shadow-2xl border border-[#D7C2A0]/30">
        
        {/* Background Decorative Rings */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Copy & Badges (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#C8A96A] text-[#0F4C45] text-xs font-extrabold tracking-wider uppercase shadow-sm">
                CLOCHE MOBILE APP
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Plan Your Dream Wedding On The Go
            </h2>

            <p className="text-sm md:text-base text-white/85 font-light leading-relaxed max-w-xl">
              Download the free Cloche iOS & Android app. Access verified vendors, chat directly, manage your budget, and track guest RSVPs anywhere.
            </p>

            {/* Feature Checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
                <span>Instant Vendor Direct Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
                <span>Offline Budget & Guest Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
                <span>Exclusive App-Only Discounts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
                <span>Live WhatsApp Invitations</span>
              </div>
            </div>

            {/* Store Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="/download"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-[#0F4C45] font-bold text-xs hover:bg-[#FAF7F2] transition-all shadow-md group"
              >
                <Apple className="w-5 h-5 text-[#0F4C45]" />
                <div className="text-left">
                  <span className="text-[10px] text-[#7A776E] block font-normal leading-none">Download on the</span>
                  <span className="text-sm font-extrabold leading-tight">App Store</span>
                </div>
              </a>

              <a
                href="/download"
                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white text-[#0F4C45] font-bold text-xs hover:bg-[#FAF7F2] transition-all shadow-md group"
              >
                <Smartphone className="w-5 h-5 text-[#0F4C45]" />
                <div className="text-left">
                  <span className="text-[10px] text-[#7A776E] block font-normal leading-none">GET IT ON</span>
                  <span className="text-sm font-extrabold leading-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: QR Code & Mockup Widget (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center space-y-3 max-w-xs shadow-2xl">
              <div className="w-36 h-36 mx-auto bg-white p-3 rounded-2xl shadow-inner flex items-center justify-center">
                <QrCode className="w-full h-full text-[#0F4C45]" />
              </div>
              <div>
                <span className="font-bold text-sm block text-white">Scan to Download App</span>
                <span className="text-[11px] text-white/70">Point phone camera to install instantly</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
