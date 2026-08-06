"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export function VendorToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: "success" | "error" }>;
      if (customEvent.detail) {
        setToast(customEvent.detail);
        setTimeout(() => {
          setToast(null);
        }, 4000);
      }
    };

    window.addEventListener("cloche_toast", handleToast);
    return () => window.removeEventListener("cloche_toast", handleToast);
  }, []);

  if (!toast) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 duration-300 font-sans">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md ${
        toast.type === "success" 
          ? "bg-[#0F4C45] text-white border-gold/30 shadow-[#0F4C45]/20" 
          : "bg-red-600 text-white border-red-700 shadow-red-600/20"
      }`}>
        {toast.type === "success" ? (
          <CheckCircle2 className="w-5 h-5 text-[#C8A96A] shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-white shrink-0" />
        )}
        <span className="text-xs font-bold tracking-wide">{toast.message}</span>
        <button 
          onClick={() => setToast(null)}
          className="ml-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
