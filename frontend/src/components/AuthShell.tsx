"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Apple } from "lucide-react";
import type { ReactNode } from "react";

const AuthMotion = motion.section;

type AuthShellProps = {
  activeTab: "login" | "signup";
  subtitle: string;
  showSocial?: boolean;
  footerText: string;
  footerLink: string;
  footerLinkLabel: string;
  children: ReactNode;
};

const tabBase =
  "relative flex h-14 min-h-11 flex-1 items-center justify-center text-[18px] font-semibold transition-colors";

export function AuthShell({
  activeTab,
  subtitle,
  showSocial = false,
  footerText,
  footerLink,
  footerLinkLabel,
  children,
}: AuthShellProps) {
  const reduceMotion = useReducedMotion();

  return (
    <main className="h-screen w-screen overflow-hidden fixed inset-0 z-50 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(250,246,239,0.96)_45%,rgba(245,239,229,1))] px-4 text-charcoal sm:px-6">
      <div className="mx-auto flex h-full w-full max-w-[420px] flex-col items-center justify-center">
        <div className="w-full max-w-[380px] rounded-[24px] border border-[#E6DDCF] bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,244,236,0.94))] px-4 py-5 shadow-[0_16px_50px_rgba(28,27,23,0.08)] backdrop-blur-sm sm:px-6 sm:py-6">
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

          <div className="space-y-4">
            <div className="space-y-3">{children}</div>

            {showSocial && (
              <div className="pt-1">
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#DDD3C5]" />
                  <span className="text-[12px] text-[#3C372F]">or continue with</span>
                  <div className="h-px flex-1 bg-[#DDD3C5]" />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center rounded-xl border border-[#D8CEC0] bg-[#FBF8F1] text-[#0F4C45] shadow-[0_4px_12px_rgba(28,27,23,0.04)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                    aria-label="Continue with Google"
                  >
                    <GoogleMark />
                  </button>
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center rounded-xl border border-[#D8CEC0] bg-[#FBF8F1] text-[#0F4C45] shadow-[0_4px_12px_rgba(28,27,23,0.04)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                    aria-label="Continue with Apple"
                  >
                    <Apple className="h-6 w-6 text-black" />
                  </button>
                  <button
                    type="button"
                    className="flex h-14 items-center justify-center rounded-xl border border-[#D8CEC0] bg-[#FBF8F1] text-[#0F4C45] shadow-[0_4px_12px_rgba(28,27,23,0.04)] transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
                    aria-label="Continue with Facebook"
                  >
                    <FacebookMark />
                  </button>
                </div>
              </div>
            )}

            <div className="text-center">
              <p className="text-[14px] text-[#4B463E]">
                {footerText}{" "}
                <Link href={footerLink} className="font-semibold text-[#0F4C45] underline decoration-[#0F4C45]/25 underline-offset-4">
                  {footerLinkLabel}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true">
      <path fill="#EA4335" d="M12 10.2v3.95h5.62c-.25 1.28-1.46 3.74-5.62 3.74a6.53 6.53 0 1 1 0-13.06c1.87 0 3.12.8 3.84 1.5l2.62-2.52C16.95 1.44 14.7.5 12 .5 5.93.5 1 5.43 1 11.5S5.93 22.5 12 22.5c6.32 0 10.51-4.44 10.51-10.69 0-.72-.08-1.27-.18-1.82H12Z" />
      <path fill="#4285F4" d="M23 11.9c0-.68-.06-1.19-.18-1.72H12v3.25h6.4c-.13.8-.66 2.01-1.88 2.82l-.02.11 2.71 2.1.19.02C21.72 16.56 23 14.56 23 11.9Z" />
      <path fill="#FBBC05" d="m4.66 14.2-.2.11-2.8 2.17-.07.16C2.98 19.16 7.12 22.5 12 22.5c3.37 0 6.2-1.1 8.28-2.96l-3.95-3.07c-1.06.74-2.49 1.26-4.33 1.26a6.53 6.53 0 0 1-6.15-4.54l-.19.01Z" />
      <path fill="#34A853" d="M12 4.44c2.03 0 3.4.87 4.18 1.6l3.06-2.99C18.2 1.25 15.97.5 12 .5 7.12.5 2.98 3.84 1.59 8.84l3.07 2.39A6.53 6.53 0 0 1 12 4.44Z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="#1877F2" />
      <path fill="#fff" d="M13.5 8.5h1.6V6.2h-1.9c-2 0-3.2 1.2-3.2 3.2v1.4H8v2.3h2V18h2.5v-5h2l.3-2.3h-2.3v-1.1c0-.7.2-1.1 1-1.1Z" />
    </svg>
  );
}
