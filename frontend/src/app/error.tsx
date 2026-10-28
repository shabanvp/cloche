"use client";

import React, { useEffect } from "react";
import { ErrorBoundaryFallback } from "@/components/ErrorBoundaryFallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <ErrorBoundaryFallback
      error={error}
      reset={reset}
    />
  );
}

