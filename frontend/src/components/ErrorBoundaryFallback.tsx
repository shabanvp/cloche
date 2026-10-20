"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface Props {
  error?: Error;
  reset?: () => void;
  title?: string;
  message?: string;
}

export function ErrorBoundaryFallback({
  error,
  reset,
  title = "Something went wrong",
  message = "We encountered a temporary connection issue. Please refresh or return home.",
}: Props) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-12 text-center bg-[#FAF9F6]">
      <div className="w-16 h-16 rounded-full bg-white border border-[#D7C2A0]/40 flex items-center justify-center text-[#0F4C45] mb-4 shadow-sm">
        <AlertCircle className="w-8 h-8 text-[#A97B3E]" />
      </div>

      <h2 className="font-display text-2xl font-bold text-[#0F4C45] mb-2">{title}</h2>
      <p className="text-sm text-[#5C5549] max-w-md mb-6 leading-relaxed">
        {error?.message && process.env.NODE_ENV !== "production"
          ? error.message
          : message}
      </p>

      <div className="flex items-center gap-3">
        {reset && (
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0F4C45] text-white text-sm font-medium hover:bg-[#0A3732] transition-colors shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        )}

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#EBE4D8] text-[#0F4C45] text-sm font-medium hover:bg-[#DDD3C5] transition-colors"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
