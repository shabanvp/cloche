"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import { showVendorToast } from "@/lib/vendorStore";

export interface VendorImageUploaderProps {
  label?: string;
  sublabel?: string;
  value?: string | string[];
  onChange?: (urls: string | string[]) => void;
  onImagesUploaded?: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMb?: number;
  folder?: string;
  className?: string;
}

interface ImagePreviewItem {
  id: string;
  url: string;
  file?: File;
  isUploading: boolean;
  error?: string;
}

export function VendorImageUploader({
  label = "Upload Image",
  sublabel = "Supports JPG, PNG, WEBP (Max 5MB per photo)",
  value,
  onChange,
  onImagesUploaded,
  multiple = false,
  maxFiles = 10,
  maxSizeMb = 5,
  folder = "cloche/vendors/gallery",
  className = "",
}: VendorImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState<ImagePreviewItem[]>([]);

  // Initialize preview items from value prop
  useEffect(() => {
    if (!value) {
      setItems([]);
      return;
    }

    const currentUrls = Array.isArray(value) ? value : [value];
    const existingUrls = items.map((i) => i.url);

    // Only update if external URLs differ meaningfully
    const urlSet = new Set(existingUrls);
    const hasChange = currentUrls.some((u) => u && !urlSet.has(u));

    if (hasChange) {
      const newItems = currentUrls
        .filter((u): u is string => Boolean(u && typeof u === "string" && u.trim() !== ""))
        .map((url, idx) => ({
          id: `init-${idx}-${url.slice(-10)}`,
          url,
          isUploading: false,
        }));
      setItems(newItems);
    }
  }, [value]);

  const notifyChanges = (updatedItems: ImagePreviewItem[]) => {
    const validUrls = updatedItems
      .filter((i) => !i.isUploading && !i.error && i.url)
      .map((i) => i.url);

    if (onImagesUploaded) {
      onImagesUploaded(validUrls);
    }

    if (onChange) {
      if (multiple) {
        onChange(validUrls);
      } else {
        onChange(validUrls[0] || "");
      }
    }
  };

  const validateAndUploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (!multiple && fileArray.length > 1) {
      showVendorToast("Single file mode: Uploading first selected image.", "info");
      fileArray.splice(1);
    }

    if (multiple && items.length + fileArray.length > maxFiles) {
      showVendorToast(`You can upload a maximum of ${maxFiles} images.`, "error");
      return;
    }

    const newPreviewItems: ImagePreviewItem[] = [];

    for (const file of fileArray) {
      // 1. MIME type validation
      if (!file.type.startsWith("image/")) {
        showVendorToast(`"${file.name}" is not a valid image file.`, "error");
        continue;
      }

      // 2. File size validation
      const fileSizeMb = file.size / (1024 * 1024);
      if (fileSizeMb > maxSizeMb) {
        showVendorToast(`"${file.name}" exceeds the ${maxSizeMb}MB size limit.`, "error");
        continue;
      }

      const tempId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const localPreviewUrl = URL.createObjectURL(file);

      newPreviewItems.push({
        id: tempId,
        url: localPreviewUrl,
        file,
        isUploading: true,
      });
    }

    if (newPreviewItems.length === 0) return;

    const updatedList = multiple ? [...items, ...newPreviewItems] : newPreviewItems;
    setItems(updatedList);

    // 3. Process Cloudinary CDN Uploads
    for (const item of newPreviewItems) {
      if (!item.file) continue;

      try {
        const res = await uploadImageToCloudinaryDetailed(item.file, folder);

        setItems((prev) => {
          const next = prev.map((p) => {
            if (p.id === item.id) {
              return {
                ...p,
                url: res.secure_url,
                isUploading: false,
              };
            }
            return p;
          });
          notifyChanges(next);
          return next;
        });
      } catch (err) {
        console.error("[VendorImageUploader] Upload failed:", err);
        showVendorToast(`Failed to upload "${item.file.name}". Please try again.`, "error");

        setItems((prev) => {
          const next = prev.filter((p) => p.id !== item.id);
          notifyChanges(next);
          return next;
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.target && (e as any).dataTransfer?.files) {
      validateAndUploadFiles((e as any).dataTransfer.files);
    }
  };

  const handleRemove = (idToRemove: string) => {
    const next = items.filter((item) => item.id !== idToRemove);
    setItems(next);
    notifyChanges(next);
  };

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {label && (
        <div>
          <label className="block text-xs font-bold text-charcoal/80 uppercase tracking-wider mb-0.5">
            {label}
          </label>
          {sublabel && <p className="text-[11px] text-charcoal/60">{sublabel}</p>}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            validateAndUploadFiles(e.target.files);
            e.target.value = "";
          }
        }}
      />

      {/* Dropzone & Device Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 relative overflow-hidden ${
          isDragging
            ? "border-[#0F4C45] bg-[#FAF7F2] shadow-inner"
            : "border-gold/30 hover:border-[#0F4C45] bg-[#FAF7F2]/50 hover:bg-[#FAF7F2]"
        }`}
      >
        <div className="w-12 h-12 rounded-full bg-white border border-gold/20 text-[#0F4C45] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
          <Upload className="w-5 h-5 text-[#0F4C45]" />
        </div>

        <div className="space-y-0.5">
          <p className="text-xs font-bold text-charcoal">
            <span className="text-[#0F4C45] underline decoration-gold/50 underline-offset-2">Click to select photo</span> or drag & drop
          </p>
          <p className="text-[10px] font-medium text-charcoal/50">
            {multiple ? "Select single or multiple photos from camera roll / device" : "Choose image file from your phone or computer"}
          </p>
        </div>
      </div>

      {/* Thumbnail Previews */}
      {items.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-bold text-charcoal/70 flex items-center justify-between">
            <span>Selected Images ({items.length})</span>
            {items.some((i) => i.isUploading) && (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-[#0F4C45]" /> Uploading to CDN...
              </span>
            )}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="relative aspect-square rounded-xl overflow-hidden border border-gold/20 bg-gray-100 group shadow-xs"
              >
                <img
                  src={item.url}
                  alt="Upload preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Uploading Overlay Spinner */}
                {item.isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-white text-[10px] font-bold text-center gap-1">
                    <Loader2 className="w-5 h-5 text-gold animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}

                {/* Remove Button */}
                {!item.isUploading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.id);
                    }}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer shadow-md"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
