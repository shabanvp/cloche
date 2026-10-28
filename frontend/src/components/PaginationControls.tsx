"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  scrollToTop?: boolean;
}

export function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 1) return [1];
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // When totalPages > 5
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
  scrollToTop = true,
}: PaginationControlsProps) {
  if (totalPages <= 0) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const handlePageClick = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;
    onPageChange(page);
    if (scrollToTop && typeof window !== "undefined") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 mt-8 sm:mt-10 pt-6 border-t border-gold/15 select-none ${className}`}
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage <= 1}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gold/25 flex items-center justify-center text-charcoal hover:bg-[#0F4C45] hover:text-white transition-all shadow-xs disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-charcoal disabled:cursor-not-allowed active:scale-95"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Numbered Page Buttons & Ellipsis */}
      {pages.map((item, idx) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${idx}`}
              className="text-xs sm:text-sm text-charcoal/50 px-1 select-none flex items-center justify-center"
            >
              ...
            </span>
          );
        }

        const isCurrent = item === currentPage;
        return (
          <button
            key={`page-${item}`}
            type="button"
            onClick={() => handlePageClick(item)}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center transition-all ${
              isCurrent
                ? "bg-[#0F4C45] text-white shadow-xs border border-[#0F4C45]"
                : "bg-white border border-gold/25 text-charcoal hover:bg-gold/15 hover:border-[#0F4C45] active:scale-95"
            }`}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`Page ${item}`}
          >
            {item}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-gold/25 flex items-center justify-center text-charcoal hover:bg-[#0F4C45] hover:text-white transition-all shadow-xs disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-charcoal disabled:cursor-not-allowed active:scale-95"
        aria-label="Next Page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

