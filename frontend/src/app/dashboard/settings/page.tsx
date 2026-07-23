"use client";

import Link from "next/link";
import { 
  ArrowLeft, User, Lock, Mail, Info, 
  Bell, Globe, CircleDollarSign, Moon, 
  HelpCircle, FileText, LogOut, ChevronRight 
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="mx-auto w-full max-w-md bg-[#FAF7F2] min-h-[calc(100vh-100px)] rounded-[24px] shadow-sm border border-black/5 overflow-hidden font-sans pb-10">
      {/* Header */}
      <div className="relative flex items-center justify-center p-5 border-b border-[#EAE2D5]">
        <Link href="/dashboard" className="absolute left-5 p-1 text-[#0F4C45] hover:opacity-70 transition-opacity">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.8} />
        </Link>
        <h1 className="text-lg md:text-xl font-bold text-[#0F4C45]">Settings</h1>
      </div>

      <div className="px-5 py-6 space-y-8">
        
        {/* ACCOUNT SECTION */}
        <section>
          <h2 className="text-[12px] font-bold text-[#5A6561] tracking-wider uppercase mb-3 px-1">
            Account
          </h2>
          <div className="bg-[#FAF7F2] flex flex-col">
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <User className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Edit Profile</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
            </Link>
            
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <Lock className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Change Password</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
            </Link>
            
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <Mail className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Email Preferences</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
            </Link>
            
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <Info className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Privacy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
            </Link>
          </div>
        </section>

        {/* APP SETTINGS SECTION */}
        <section>
          <h2 className="text-[12px] font-bold text-[#5A6561] tracking-wider uppercase mb-3 px-1">
            App Settings
          </h2>
          <div className="bg-[#FAF7F2] flex flex-col">
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <Bell className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
            </Link>
            
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <Globe className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#5A6561] text-[15px]">English</span>
                <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
              </div>
            </Link>
            
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <CircleDollarSign className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Currency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#5A6561] text-[15px]">USD ($)</span>
                <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
              </div>
            </Link>

            <div className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5]">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <Moon className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Dark Mode</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-[28px] w-[50px] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-[#0F4C45]' : 'bg-[#D6CFC1]'}`}
              >
                <span className={`pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkMode ? 'translate-x-[11px]' : '-translate-x-[11px]'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* SUPPORT SECTION */}
        <section>
          <h2 className="text-[12px] font-bold text-[#5A6561] tracking-wider uppercase mb-3 px-1">
            Support
          </h2>
          <div className="bg-[#FAF7F2] flex flex-col">
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <HelpCircle className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Help & Support</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
            </Link>
            
            <Link href="#" className="flex items-center justify-between py-4 px-1 border-b border-[#EAE2D5] group hover:bg-black/5 transition-colors">
              <div className="flex items-center gap-4 text-[#0F4C45]">
                <FileText className="w-5 h-5 text-[#5A6561]" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Terms & Conditions</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A38B6B]" strokeWidth={2} />
            </Link>

            <button className="flex items-center justify-between py-4 px-1 group hover:bg-red-50/50 transition-colors w-full">
              <div className="flex items-center gap-4 text-[#C63A3A]">
                <LogOut className="w-5 h-5" strokeWidth={1.5} />
                <span className="font-medium text-[15px]">Log Out</span>
              </div>
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
