"use client";

import React, { useEffect } from "react";
import { ErrorBoundaryFallback } from "@/components/ErrorBoundaryFallback";

export default function VendorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Vendor Portal error:", error);
  }, [error]);

  return (
    <ErrorBoundaryFallback
      error={error}
      reset={reset}
      title="Vendor Portal Error"
      message="We encountered an issue loading your vendor portal dashboard. Please try again."
    />
  );
}

