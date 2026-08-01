"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  User, 
  Lock, 
  Mail, 
  Info, 
  Bell, 
  Globe, 
  CircleDollarSign, 
  Moon, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  LogOut
} from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  // Background and Text Styles depending on Theme
  const bgClass = darkMode ? "bg-[#1C201F]" : "bg-transparent";
  const textPrimary = darkMode ? "text-white" : "text-charcoal";
  const textSecondary = darkMode ? "text-white/60" : "text-charcoal/60";
  const borderClass = darkMode ? "border-white/10" : "border-[#E5DDD0]";
  const hoverClass = darkMode ? "hover:bg-white/5" : "hover:bg-black/5";
  const chevronClass = darkMode ? "text-white/40" : "text-charcoal/40";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-[#121615]" : "bg-[#FAF7F2]"} pb-24 transition-colors duration-300`}>
      {/* HEADER */}
      <header className={`px-5 pt-8 pb-4 sticky top-0 z-10 ${darkMode ? "bg-[#121615]/90" : "bg-[#FAF7F2]/90"} backdrop-blur-md transition-colors duration-300`}>
        <h1 className={`font-display text-2xl font-bold ${textPrimary} tracking-tight transition-colors duration-300`}>
          Settings
        </h1>
      </header>

      {/* CONTENT */}
      <div className="px-5 py-6 space-y-8">
        
        {/* ACCOUNT SECTION */}
        <section>
          <h2 className={`text-[12px] font-bold ${textSecondary} tracking-wider uppercase mb-3 px-1 transition-colors duration-300`}>
            Account
          </h2>
          <div className={`${bgClass} flex flex-col transition-colors duration-300`}>
            <Link href="/dashboard" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <User className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Edit Profile</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="/forgot-password" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Lock className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Change Password</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="/dashboard" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Mail className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Email Preferences</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="/content/privacy" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Info className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Privacy</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
          </div>
        </section>

        {/* APP SETTINGS SECTION */}
        <section>
          <h2 className={`text-[12px] font-bold ${textSecondary} tracking-wider uppercase mb-3 px-1 transition-colors duration-300`}>
            App Settings
          </h2>
          <div className={`${bgClass} flex flex-col transition-colors duration-300`}>
            <div className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Bell className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Notifications</span>
              </div>
              <span className={`${textSecondary} text-[13px]`}>Enabled</span>
            </div>
            
            <div className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Globe className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Language</span>
              </div>
              <span className={`${textSecondary} text-[13px]`}>English (IN)</span>
            </div>

            <div className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Moon className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Dark Mode</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-[28px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-[#0F4C45]' : 'bg-[#D6CFC1]'}`}
              >
                <span className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full shadow ring-0 transition duration-200 ease-in-out ${darkMode ? 'translate-x-[11px] bg-white' : '-translate-x-[11px] bg-white'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* SUPPORT SECTION */}
        <section>
          <h2 className={`text-[12px] font-bold ${textSecondary} tracking-wider uppercase mb-3 px-1 transition-colors duration-300`}>
            Support
          </h2>
          <div className={`${bgClass} flex flex-col transition-colors duration-300`}>
            <Link href="/contact" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <HelpCircle className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Help & Support</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="/content/terms" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <FileText className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Terms of Service</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
          </div>
        </section>

        {/* LOGOUT BUTTON */}
        <div className="pt-4">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-3.5 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-semibold text-sm rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Link>
        </div>

      </div>

      <BottomNavBar />
    </div>
  );
}
