"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function LuxuryPageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hide overlay immediately when path or search params change (page arrived)
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLoading(false);
  }, [pathname, searchParams]);

  // Delegated click handler on document body for fast, reliable link detection
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a") as HTMLAnchorElement | null;
      if (!target || !target.href) return;

      const isInternal = target.href.startsWith(window.location.origin);
      const isSamePage = target.pathname === window.location.pathname && target.search === window.location.search;
      const isAnchorHash = target.hash && target.pathname === window.location.pathname;

      if (isInternal && !isSamePage && !isAnchorHash && !target.target) {
        if (timerRef.current) clearTimeout(timerRef.current);

        // Display luxury overlay ONLY if navigation takes longer than 300ms
        timerRef.current = setTimeout(() => {
          setIsLoading(true);
        }, 300);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => {
      document.removeEventListener("click", handleGlobalClick);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/95 backdrop-blur-md pointer-events-none"
        >
          {/* Central Logo Container with Soft Pulse */}
          <div className="relative flex flex-col items-center">
            <motion.div
              animate={{ scale: [0.96, 1.04, 0.96] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#D7C2A0]/60 bg-[#FAF7F2] shadow-[0_12px_32px_rgba(15,76,69,0.08)] p-3"
            >
              <img src="/logo.png" alt="Cloche" className="h-12 w-12 object-contain" />
            </motion.div>

            {/* Gold Shimmer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-dashed border-[#C8A96A]/50 pointer-events-none"
            />

            {/* Brand Title & Subtitle */}
            <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-[#0F4C45]">
              Cloche
            </h2>
            <p className="mt-1 text-xs font-medium tracking-widest uppercase text-[#A97B3E]">
              Curated Luxury
            </p>

            {/* Shimmer Bar Progress */}
            <div className="mt-5 h-1 w-36 overflow-hidden rounded-full bg-[#E6DDCF]/80">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="h-full w-full bg-gradient-to-r from-[#D7C2A0] via-[#C8A96A] to-[#0F4C45]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

