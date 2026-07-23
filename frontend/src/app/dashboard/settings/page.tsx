"use client";

import Link from "next/link";
import { 
  ArrowLeft, User, Lock, Mail, Info, 
  Bell, Globe, CircleDollarSign, Moon, 
  HelpCircle, FileText, LogOut, ChevronRight 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth";

export default function SettingsPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutMsg, setShowLogoutMsg] = useState(false);

  // Apply dark background to body when dark mode is enabled
  useEffect(() => {
    if (darkMode) {
      document.body.style.backgroundColor = "#111412";
      document.documentElement.style.backgroundColor = "#111412";
    } else {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    }
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, [darkMode]);

  const bgClass = darkMode ? "bg-[#111412]" : "bg-[#FAF7F2]";
  const textPrimary = darkMode ? "text-[#E6EBE9]" : "text-[#0F4C45]";
  const textSecondary = darkMode ? "text-[#8A9590]" : "text-[#5A6561]";
  const borderClass = darkMode ? "border-white/10" : "border-[#EAE2D5]";
  const hoverClass = darkMode ? "hover:bg-white/5" : "hover:bg-black/5";
  const chevronClass = darkMode ? "text-[#D6C4A6]" : "text-[#A38B6B]";
  const containerBorder = darkMode ? "border-white/5" : "border-black/5";

  return (
    <div className={`mx-auto w-full max-w-md ${bgClass} min-h-[calc(100vh-100px)] rounded-[24px] shadow-sm border ${containerBorder} overflow-hidden font-sans pb-10 transition-colors duration-300`}>
      {/* Header */}
      <div className={`relative flex items-center justify-center p-5 border-b ${borderClass} transition-colors duration-300`}>
        <Link href="/dashboard" className={`absolute left-5 p-1 ${textPrimary} hover:opacity-70 transition-opacity`}>
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.8} />
        </Link>
        <h1 className={`text-lg md:text-xl font-bold ${textPrimary} transition-colors duration-300`}>Settings</h1>
      </div>

      <div className="px-5 py-6 space-y-8">
        
        {/* ACCOUNT SECTION */}
        <section>
          <h2 className={`text-[12px] font-bold ${textSecondary} tracking-wider uppercase mb-3 px-1 transition-colors duration-300`}>
            Account
          </h2>
          <div className={`${bgClass} flex flex-col transition-colors duration-300`}>
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <User className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Edit Profile</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Lock className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Change Password</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Mail className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Email Preferences</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
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
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Bell className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Notifications</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <Globe className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${textSecondary} text-[15px] transition-colors duration-300`}>English</span>
                <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
              </div>
            </Link>
            
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <CircleDollarSign className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Currency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${textSecondary} text-[15px] transition-colors duration-300`}>USD ($)</span>
                <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
              </div>
            </Link>

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
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <HelpCircle className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Help & Support</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>
            
            <Link href="#" className={`flex items-center justify-between py-4 px-1 border-b ${borderClass} group ${hoverClass} transition-colors duration-300`}>
              <div className={`flex items-center gap-4 ${textPrimary} transition-colors duration-300`}>
                <FileText className={`w-5 h-5 ${textSecondary} transition-colors duration-300`} strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Terms & Conditions</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${chevronClass} transition-colors duration-300`} strokeWidth={2} />
            </Link>

            <button 
              onClick={async () => {
                await logout();
                router.push('/login?logout=success');
              }}
              className="flex items-center justify-between py-4 px-1 group hover:bg-red-500/10 transition-colors w-full"
            >
              <div className="flex items-center gap-4 text-[#E56A6A]">
                <LogOut className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Log Out</span>
              </div>
            </button>
          </div>
        </section>

      </div>
      
      {/* Hide surrounding layout background visually if possible by making an absolute pseudo-backdrop */}
      {darkMode && (
        <div className="fixed inset-0 bg-[#111412] -z-10 transition-colors duration-300" />
      )}
      
    </div>
  );
}
