"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type AuthShellProps = {
  activeTab: "login" | "signup";
  subtitle: string;
  hideTabs?: boolean;
  showSocial?: boolean;
  footerText?: string;
  footerLink?: string;
  footerLinkLabel?: string;
  onGoogleSignIn?: () => void;
  children: ReactNode;
};

export function AuthShell({
  activeTab,
  subtitle,
  hideTabs = false,
  showSocial = false,
  footerText,
  footerLink,
  footerLinkLabel,
  onGoogleSignIn,
  children,
}: AuthShellProps) {
  const reduceMotion = useReducedMotion();

  const handleDefaultGoogleSignIn = () => {
    if (onGoogleSignIn) {
      onGoogleSignIn();
      return;
    }
    if (typeof window !== "undefined") {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fumfjbcixcudjrnezfjl.supabase.co";
      const redirectUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);
      window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`;
    }
  };

  return (
    <main className="min-h-screen w-full overflow-y-auto z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(250,246,239,0.96)_45%,rgba(245,239,229,1))] px-4 py-8 text-charcoal sm:px-6">
      <div className="mx-auto flex w-full max-w-[460px] flex-col items-center justify-center my-auto">
        <div className="w-full max-w-[420px] rounded-[26px] border border-[#E6DDCF] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,244,236,0.94))] px-5 py-6 shadow-[0_18px_60px_rgba(28,27,23,0.08)] backdrop-blur-sm sm:px-7 sm:py-7">
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full border border-[#D7C2A0] bg-[#FBF7EF] shadow-[0_8px_20px_rgba(15,76,69,0.08)]">
              <img src="/logo.png" alt="Cloche" className="h-7 w-7 object-contain" />
            </div>
            <h1 className="font-display text-[2.4rem] leading-none text-[#0F4C45]">
              Cloche
            </h1>
            <p className="mt-2 max-w-[240px] font-display text-[1.1rem] leading-[1.2] text-[#A97B3E]">
              {subtitle.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          {!hideTabs && (
            <div className="mb-4 flex border-b border-[#DDD3C5]">
              <Link href="/login" className="relative flex h-10 min-h-9 flex-1 items-center justify-center text-[15px] font-semibold transition-colors">
                <span className={activeTab === "login" ? "text-[#123f3a]" : "text-[#33312d]/80"}>Login</span>
                <span
                  className={`absolute bottom-[-1px] h-0.5 w-[82%] rounded-full bg-[#123f3a] transition-transform duration-300 ${
                    activeTab === "login" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
              <Link href="/signup" className="relative flex h-10 min-h-9 flex-1 items-center justify-center text-[15px] font-semibold transition-colors">
                <span className={activeTab === "signup" ? "text-[#123f3a]" : "text-[#33312d]/80"}>Sign Up</span>
                <span
                  className={`absolute bottom-[-1px] h-0.5 w-[82%] rounded-full bg-[#123f3a] transition-transform duration-300 ${
                    activeTab === "signup" ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-3">{children}</div>

            {showSocial && (
              <div className="pt-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-[#DDD3C5]" />
                  <span className="text-[12px] text-[#3C372F] font-medium">or continue with</span>
                  <div className="h-px flex-1 bg-[#DDD3C5]" />
                </div>

                <button
                  type="button"
                  onClick={handleDefaultGoogleSignIn}
                  className="w-full flex h-12 items-center justify-center gap-3 rounded-xl border border-[#D8CEC0] bg-white text-[#0F4C45] font-semibold text-sm shadow-[0_4px_12px_rgba(28,27,23,0.06)] transition-all hover:bg-[#FAF8F5] hover:border-[#C8A96A] hover:-translate-y-0.5 active:scale-[0.98]"
                  aria-label="Sign in with Google"
                >
                  <GoogleMark />
                  <span>Sign in with Google</span>
                </button>
              </div>
            )}

            {footerText && footerLink && footerLinkLabel && (
              <div className="text-center pt-2">
                <p className="text-[14px] text-[#4B463E]">
                  {footerText}{" "}
                  <Link href={footerLink} className="font-semibold text-[#0F4C45] underline decoration-[#0F4C45]/25 underline-offset-4">
                    {footerLinkLabel}
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.95h5.62c-.25 1.28-1.46 3.74-5.62 3.74a6.53 6.53 0 1 1 0-13.06c1.87 0 3.12.8 3.84 1.5l2.62-2.52C16.95 1.44 14.7.5 12 .5 5.93.5 1 5.43 1 11.5S5.93 22.5 12 22.5c6.32 0 10.51-4.44 10.51-10.69 0-.72-.08-1.27-.18-1.82H12Z" />
      <path fill="#4285F4" d="M23 11.9c0-.68-.06-1.19-.18-1.72H12v3.25h6.4c-.13.8-.66 2.01-1.88 2.82l-.02.11 2.71 2.1.19.02C21.72 16.56 23 14.56 23 11.9Z" />
      <path fill="#FBBC05" d="m4.66 14.2-.2.11-2.8 2.17-.07.16C2.98 19.16 7.12 22.5 12 22.5c3.37 0 6.2-1.1 8.28-2.96l-3.95-3.07c-1.06.74-2.49 1.26-4.33 1.26a6.53 6.53 0 0 1-6.15-4.54l-.19.01Z" />
      <path fill="#34A853" d="M12 4.44c2.03 0 3.4.87 4.18 1.6l3.06-2.99C18.2 1.25 15.97.5 12 .5 7.12.5 2.98 3.84 1.59 8.84l3.07 2.39A6.53 6.53 0 0 1 12 4.44Z" />
    </svg>
  );
}
