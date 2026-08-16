"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export function VendorModal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = "lg",
}: VendorModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white w-full ${maxWidthClass} rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gold/20 flex flex-col max-h-[92vh] sm:max-h-[85vh] my-0 sm:my-auto overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white px-5 sm:px-6 py-4 border-b border-gold/15 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-serif font-bold text-lg text-charcoal">{title}</h3>
            {subtitle && <p className="text-xs text-charcoal/60 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-charcoal/60 hover:text-charcoal flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content with Safe Mobile Bottom Padding */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 overscroll-contain pb-6">
          {children}
        </div>

        {/* Sticky Footer for Action Buttons */}
        {footer && (
          <div className="sticky bottom-0 z-20 bg-white px-5 sm:px-6 py-3.5 border-t border-gold/15 flex items-center justify-end gap-2 shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-[max(14px,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
