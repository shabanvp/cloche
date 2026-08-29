"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function DelayedPageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer and hide transition immediately when route or query params change
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  }, [pathname, searchParams]);

  // Intercept client-side anchor clicks to start a 300ms delayed timer
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target || !target.href) return;

      const isInternal = target.href.startsWith(window.location.origin);
      const isSamePage = target.pathname === window.location.pathname && target.search === window.location.search;
      const isHashLink = Boolean(target.hash && target.pathname === window.location.pathname);

      if (isInternal && !isSamePage && !isHashLink && !target.target) {
        if (timerRef.current) clearTimeout(timerRef.current);
        // Only trigger overlay if navigation takes longer than 300ms
        timerRef.current = setTimeout(() => {
          setIsVisible(true);
        }, 300);
      }
    };

    document.addEventListener("click", handleAnchorClick as EventListener, true);

    return () => {
      document.removeEventListener("click", handleAnchorClick as EventListener, true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF7F2]/95 backdrop-blur-md pointer-events-none"
        >
          <div className="relative flex flex-col items-center">
            {/* Cloche Logo with Soft Pulse */}
            <motion.div
              animate={{ scale: [0.97, 1.03, 0.97] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#D7C2A0] bg-[#FBF7EF] shadow-md p-3"
            >
              <img src="/logo.png" alt="Cloche" className="h-12 w-12 object-contain" />
            </motion.div>

            {/* Gold Shimmer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute -inset-2 rounded-full border border-dashed border-[#C8A96A]/40 pointer-events-none"
            />

            <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-[#0F4C45]">
              Cloche
            </h2>
            <p className="mt-1 text-[10px] font-bold tracking-widest uppercase text-[#C8A96A]">
              Curated Luxury
            </p>

            {/* Gold Shimmer Progress Bar */}
            <div className="mt-5 h-1 w-32 overflow-hidden rounded-full bg-[#E6DDCF]">
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
