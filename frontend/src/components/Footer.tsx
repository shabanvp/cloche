"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Mail, Phone, Send, CheckCircle2, Smartphone, Apple } from "lucide-react";

export function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  const handleAdminAccess = () => {
    router.push("/login?role=admin");
  };

  return (
    <footer className="bg-[#0F4C45] text-white pt-20 pb-10 border-t border-[#D7C2A0]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Newsletter Bar */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-white/20 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl space-y-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#C8A96A]">
              Exclusive Wedding Inspirations
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
              Subscribe to Cloche Luxury Newsletter
            </h3>
            <p className="text-xs text-white/80 font-light leading-relaxed">
              Get weekly curated vendor deals, seasonal bridal trends, and real Kerala wedding stories delivered to your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full px-5 py-3.5 rounded-full bg-white text-[#2B2B2B] text-sm placeholder-[#7A776E] focus:outline-none focus:ring-2 focus:ring-[#C8A96A] shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#C8A96A] text-[#0F4C45] font-bold text-sm hover:bg-[#E6C687] transition-all shadow-md shrink-0"
            >
              {subscribed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#0F4C45]" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Core Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative flex items-center justify-center w-[55px] h-[50px]">
                <img src="/logo.png" alt="Cloche Logo" className="absolute inset-0 w-full h-full object-contain scale-[1.8] origin-center" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-3xl tracking-widest text-white font-bold uppercase">Cloche</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C8A96A]">Curated Luxury Weddings</span>
              </div>
            </Link>

            <p className="text-white/70 text-xs font-light leading-relaxed max-w-sm">
              Cloche is Kerala&apos;s premier luxury wedding platform connecting couples with handpicked photographers, venues, bridal studios, makeup artists, and interactive digital invitations.
            </p>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center space-x-4 text-xs font-semibold text-[#C8A96A]">
              <a href="https://instagram.com/clocheweddings" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Instagram
              </a>
              <span>•</span>
              <a href="https://facebook.com/clocheweddings" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Facebook
              </a>
              <span>•</span>
              <a href="https://x.com/clocheweddings" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Twitter / X
              </a>
              <span>•</span>
              <a href="https://pinterest.com/clocheweddings" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Pinterest
              </a>
            </div>

            {/* App Download Badges */}
            <div className="pt-3 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-white/60 block">Download Cloche App</span>
              <div className="flex items-center gap-3">
                <a href="/download" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors">
                  <Apple className="w-4 h-4 text-[#C8A96A]" />
                  <span>App Store</span>
                </a>
                <a href="/download" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors">
                  <Smartphone className="w-4 h-4 text-[#C8A96A]" />
                  <span>Google Play</span>
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Company & About */}
          <div>
            <h4 className="font-display text-base font-bold mb-4 text-[#C8A96A]">Company</h4>
            <ul className="space-y-3 text-xs text-white/80 font-light">
              <li><Link href="/about" className="hover:text-white transition-colors">About Cloche</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/content/careers" className="hover:text-white transition-colors">Careers & Hiring</Link></li>
              <li><Link href="/real-weddings" className="hover:text-white transition-colors">Real Kerala Weddings</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition-colors">Wedding Blog & Guides</Link></li>
            </ul>
          </div>

          {/* Column 3: For Vendors */}
          <div>
            <h4 className="font-display text-base font-bold mb-4 text-[#C8A96A]">For Vendors</h4>
            <ul className="space-y-3 text-xs text-white/80 font-light">
              <li><Link href="/vendor/register" className="hover:text-white transition-colors">Register as Vendor</Link></li>
              <li><Link href="/login?role=vendor" className="hover:text-white transition-colors">Vendor Portal Login</Link></li>
              <li><Link href="/content/vendor-agreement" className="hover:text-white transition-colors">Vendor Agreement</Link></li>
              <li><Link href="/content/pricing" className="hover:text-white transition-colors">Subscription Pricing</Link></li>
              <li><a href="/partner?mode=create" className="hover:text-white transition-colors">Sign up as Partner</a></li>
              <li><a href="/partner" className="hover:text-white transition-colors">Partner Login</a></li>
            </ul>
          </div>

          {/* Column 4: Contact & Office */}
          <div>
            <h4 className="font-display text-base font-bold mb-4 text-[#C8A96A]">Get In Touch</h4>
            <ul className="space-y-3 text-xs text-white/80 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-[#C8A96A] shrink-0" />
                <span>Malappuram & Kochi, Kerala, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8A96A] shrink-0" />
                <a href="mailto:cloche.luxury@gmail.com" className="hover:text-white transition-colors">cloche.luxury@gmail.com</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8A96A] shrink-0" />
                <a href="tel:+917306633171" className="hover:text-white transition-colors">+91 73066 33171</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 font-light">
          <p>
            &copy; {new Date().getFullYear()} Cloche Luxury Weddings. All rights reserved
            <span
              onClick={handleAdminAccess}
              className="cursor-pointer hover:text-white transition-colors ml-1"
              title="Admin Portal Access"
            >
              .
            </span>
          </p>
          <div className="flex space-x-6">
            <Link href="/content/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/content/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/content/cookies" className="hover:text-white transition-colors">Cookie Preferences</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
