"use client";

import React, { useEffect } from "react";
import { ErrorBoundaryFallback } from "@/components/ErrorBoundaryFallback";

export default function CategoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Category page error:", error);
  }, [error]);

  return (
    <ErrorBoundaryFallback
      error={error}
      reset={reset}
      title="Category Unavailable"
      message="We encountered an issue loading this category's vendor listings. Please try again."
    />
  );
}

