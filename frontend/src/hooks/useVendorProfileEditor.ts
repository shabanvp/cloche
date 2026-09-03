import { useState, useEffect, useCallback } from "react";
import { getActiveVendorIdentity, syncVendorProfileWithDatabase } from "@/lib/vendorStore";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";

export type SaveStatusState = "idle" | "editing" | "saving" | "saved" | "synced" | "error";

export interface VendorProfileEditorState {
  isOwner: boolean;
  editMode: boolean;
  previewAsCustomer: boolean;
  showOwnerControls: boolean;
  activeSectionKey: string | null;
  saveStatusMap: Record<string, SaveStatusState>;
  lastSavedTime: string | null;
  statusMessage: string | null;
  setEditMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  setPreviewAsCustomer: (val: boolean | ((prev: boolean) => boolean)) => void;
  openSectionEditor: (sectionKey: string) => void;
  closeSectionEditor: () => void;
  saveSection: (sectionKey: string, sectionPayload: Record<string, any>) => Promise<boolean>;
  retrySectionSave: (sectionKey: string, sectionPayload: Record<string, any>) => Promise<boolean>;
}

export function useVendorProfileEditor(vendor: any): VendorProfileEditorState {
  const [activeVendor, setActiveVendor] = useState<any>(() => {
    if (typeof window !== "undefined") {
      return getActiveVendorIdentity() || null;
    }
    return null;
  });

  const [editMode, setEditMode] = useState(false);
  const [previewAsCustomer, setPreviewAsCustomer] = useState(false);
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(null);
  const [saveStatusMap, setSaveStatusMap] = useState<Record<string, SaveStatusState>>({});
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const identity = getActiveVendorIdentity();
    if (identity) setActiveVendor(identity);
  }, []);

  const vendorId = vendor?.id || vendor?.vendor_id || activeVendor?.id;
  const isOwner = Boolean(
    activeVendor &&
      vendorId &&
      (String(activeVendor.id || "").toLowerCase() === String(vendorId).toLowerCase() ||
        String(activeVendor.user_id || "").toLowerCase() === String(vendor?.user_id || "").toLowerCase() ||
        String(activeVendor.vendor_id || "").toLowerCase() === String(vendorId).toLowerCase())
  );

  const showOwnerControls = isOwner && editMode && !previewAsCustomer;

  const openSectionEditor = useCallback((sectionKey: string) => {
    setActiveSectionKey(sectionKey);
    setSaveStatusMap((prev) => ({ ...prev, [sectionKey]: "editing" }));
  }, []);

  const closeSectionEditor = useCallback(() => {
    setActiveSectionKey(null);
  }, []);

  const saveSection = useCallback(
    async (sectionKey: string, sectionPayload: Record<string, any>): Promise<boolean> => {
      if (!vendorId) return false;

      // Update section status to saving
      setSaveStatusMap((prev) => ({ ...prev, [sectionKey]: "saving" }));

      // 1. Send PATCH payload with updatedAt concurrency timestamp
      const clientUpdatedAt = vendor?.updated_at || vendor?.updatedAt || new Date().toISOString();
      const patchData = {
        section: sectionKey,
        data: sectionPayload,
        updatedAt: clientUpdatedAt,
      };

      const res = await syncVendorProfileWithDatabase(patchData);

      if (res.success) {
        const now = new Date();
        const formattedTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        setLastSavedTime(formattedTime);
        setSaveStatusMap((prev) => ({ ...prev, [sectionKey]: "saved" }));

        // 2. Broadcast targeted section update event
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cloche_vendor_section_updated", {
              detail: {
                section: sectionKey,
                vendorId,
                updatedAt: now.toISOString(),
                data: res.data?.vendor || sectionPayload,
              },
            })
          );
        }

        // 3. Background DB fetch validation (Database is Ground Truth)
        try {
          const dbRefetch = await fetchPublicVendorProfileFromDb(vendorId);
          if (dbRefetch.data && typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("cloche_vendor_profile_updated", {
                detail: dbRefetch.data,
              })
            );
          }
        } catch (_) {}

        setTimeout(() => {
          setSaveStatusMap((prev) => ({ ...prev, [sectionKey]: "synced" }));
        }, 1200);

        return true;
      } else {
        setSaveStatusMap((prev) => ({ ...prev, [sectionKey]: "error" }));
        setStatusMessage(res.data?.message || `Couldn't save ${sectionKey}. Please retry.`);
        return false;
      }
    },
    [vendorId, vendor?.updated_at, vendor?.updatedAt]
  );

  const retrySectionSave = useCallback(
    (sectionKey: string, sectionPayload: Record<string, any>) => {
      return saveSection(sectionKey, sectionPayload);
    },
    [saveSection]
  );

  return {
    isOwner,
    editMode,
    previewAsCustomer,
    showOwnerControls,
    activeSectionKey,
    saveStatusMap,
    lastSavedTime,
    statusMessage,
    setEditMode,
    setPreviewAsCustomer,
    openSectionEditor,
    closeSectionEditor,
    saveSection,
    retrySectionSave,
  };
}
