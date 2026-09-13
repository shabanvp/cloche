"use client";

import { useState, useEffect, useMemo } from "react";

export interface VendorOwnershipResult {
  isLoadingAuth: boolean;
  isAuthenticated: boolean;
  activeVendor: any | null;
  activeVendorId: string | null;
  isOwner: boolean;
  showOwnerUI: (editMode?: boolean, previewAsCustomer?: boolean) => boolean;
}

/**
 * Normalizes vendor IDs for strict comparison.
 * Handles strings, numbers, UUIDs, vendor codes.
 */

export function normalizeVendorId(id: any): string {
  if (id === null || id === undefined) return "";
  return String(id).trim().toLowerCase();
}

/**
 * Compares two vendor identities for strict ownership match.
 */
export function isVendorOwner(activeVendor: any, viewedVendorId: any): boolean {
  if (!activeVendor || !viewedVendorId) return false;

  const viewedIdStr = normalizeVendorId(viewedVendorId);
  if (!viewedIdStr) return false;

  const activeId = normalizeVendorId(activeVendor.id || activeVendor.vendor_id);
  const activeCode = normalizeVendorId(activeVendor.vendorCode || activeVendor.vendor_code);
  const activeSlug = normalizeVendorId(activeVendor.slug);

  return (
    (Boolean(activeId) && activeId === viewedIdStr) ||
    (Boolean(activeCode) && activeCode === viewedIdStr) ||
    (Boolean(activeSlug) && activeSlug === viewedIdStr)
  );
}

/**
 * Custom React Hook to safely compute storefront ownership on client side.
 * Prevents edit controls from flashing during page load / hydration.
 */
export function useVendorOwnership(viewedVendorId?: any): VendorOwnershipResult {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [activeVendor, setActiveVendor] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolveActiveVendor = () => {
      try {
        const rawActive = localStorage.getItem("cloche_active_vendor_identity");
        if (rawActive) {
          const parsed = JSON.parse(rawActive);
          if (parsed && (parsed.id || parsed.vendor_id)) {
            setActiveVendor(parsed);
            setIsLoadingAuth(false);
            return;
          }
        }
      } catch (e) {}

      // Fallback check from document cookies
      try {
        const cookieStr = document.cookie;
        const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
        if (match) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed && (parsed.id || parsed.role === "vendor")) {
            setActiveVendor(parsed);
            setIsLoadingAuth(false);
            return;
          }
        }
      } catch (e) {}

      setActiveVendor(null);
      setIsLoadingAuth(false);
    };

    resolveActiveVendor();

    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setActiveVendor((prev: any) => ({ ...prev, ...e.detail }));
      } else {
        resolveActiveVendor();
      }
    };

    window.addEventListener("cloche_vendor_profile_updated", handleProfileUpdate);
    window.addEventListener("storage", resolveActiveVendor);

    return () => {
      window.removeEventListener("cloche_vendor_profile_updated", handleProfileUpdate);
      window.removeEventListener("storage", resolveActiveVendor);
    };
  }, []);

  const isAuthenticated = Boolean(activeVendor && (activeVendor.id || activeVendor.vendor_id));

  const isOwner = useMemo(() => {
    if (!isAuthenticated || !viewedVendorId) return false;
    return isVendorOwner(activeVendor, viewedVendorId);
  }, [isAuthenticated, activeVendor, viewedVendorId]);

  const activeVendorId = useMemo(() => {
    return activeVendor?.id || activeVendor?.vendor_id || null;
  }, [activeVendor]);

  const showOwnerUI = (editMode = false, previewAsCustomer = false): boolean => {
    if (isLoadingAuth) return false;
    if (!isAuthenticated) return false;
    if (!isOwner) return false;
    if (previewAsCustomer) return false;
    return Boolean(editMode);
  };

  return {
    isLoadingAuth,
    isAuthenticated,
    activeVendor,
    activeVendorId,
    isOwner,
    showOwnerUI
  };
}
