"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Edit2,
  Eye,
  EyeOff,
  Film,
  FolderPlus,
  Image as ImageIcon,
  Loader2,
  Star,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { PHOTOGRAPHY_CATEGORIES } from "@/lib/photographerData";
import type {
  PhotographerAlbumItem,
  PhotographerPhotoItem,
  PhotographerVideoItem,
} from "../types";
import { uploadPhotographerAsset } from "../types";

interface Props {
  photos: PhotographerPhotoItem[];
  albums: PhotographerAlbumItem[];
  videos: PhotographerVideoItem[];
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}

export function PhotographerPortfolioSection({
  photos,
  albums,
  videos,
  onRefresh,
  showToast,
}: Props) {
  const [subTab, setSubTab] = useState<"photos" | "albums" | "videos">("photos");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [uploadCategory, setUploadCategory] = useState<string>("Wedding");
  const [uploadAlbumId, setUploadAlbumId] = useState<string>("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // Album creation
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumLocation, setAlbumLocation] = useState("");
  const [albumCategory, setAlbumCategory] = useState("Wedding");
  const [albumDescription, setAlbumDescription] = useState("");
  const [albumCoverMediaId, setAlbumCoverMediaId] = useState<string | null>(null);
  const [albumCoverPreview, setAlbumCoverPreview] = useState("");
  const [uploadingAlbumCover, setUploadingAlbumCover] = useState(false);
  const [savingAlbum, setSavingAlbum] = useState(false);

  // Edit Photo Modal
  const [editingPhoto, setEditingPhoto] = useState<PhotographerPhotoItem | null>(null);
  const [editPhotoCaption, setEditPhotoCaption] = useState("");
  const [editPhotoDesc, setEditPhotoDesc] = useState("");
  const [editPhotoCat, setEditPhotoCat] = useState("Wedding");
  const [editPhotoAlbumId, setEditPhotoAlbumId] = useState("");
  const [editPhotoCover, setEditPhotoCover] = useState(false);
  const [editPhotoPublic, setEditPhotoPublic] = useState(true);
  const [savingPhotoEdit, setSavingPhotoEdit] = useState(false);

  // Edit Album Modal
  const [editingAlbum, setEditingAlbum] = useState<PhotographerAlbumItem | null>(null);
  const [editAlbTitle, setEditAlbTitle] = useState("");
  const [editAlbLocation, setEditAlbLocation] = useState("");
  const [editAlbCategory, setEditAlbCategory] = useState("Wedding");
  const [editAlbDesc, setEditAlbDesc] = useState("");
  const [editAlbCoverMediaId, setEditAlbCoverMediaId] = useState<string | null>(null);
  const [editAlbCoverUrl, setEditAlbCoverUrl] = useState("");
  const [editAlbPublic, setEditAlbPublic] = useState(true);
  const [savingAlbEdit, setSavingAlbEdit] = useState(false);

  // Video creation & edit
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCategory, setVideoCategory] = useState("Cinematic");
  const [savingVideo, setSavingVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState<PhotographerVideoItem | null>(null);
  const [editVidTitle, setEditVidTitle] = useState("");
  const [editVidUrl, setEditVidUrl] = useState("");
  const [editVidCat, setEditVidCat] = useState("Cinematic");
  const [editVidPublic, setEditVidPublic] = useState(true);

  // Lightbox
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const handleMultiPhotoUpload = async (files: FileList) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setUploadingPhotos(true);
    try {
      const uploadedItems = [];
      for (const file of fileList) {
        const uploaded = await uploadPhotographerAsset(file, "gallery");
        uploadedItems.push({
          mediaId: uploaded.mediaId,
          caption: uploadCaption.trim() || file.name.replace(/\.[^.]+$/, ""),
          category: uploadCategory,
          albumId: uploadAlbumId || null,
          isCover: photos.length === 0 && uploadedItems.length === 0,
        });
      }

      const res = await fetch("/api/vendor/photographer/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ kind: "photo", items: uploadedItems }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to save photos");

      setUploadCaption("");
      await onRefresh();
      showToast(
        `${uploadedItems.length} photo${uploadedItems.length === 1 ? "" : "s"} uploaded to portfolio`,
        "success"
      );
    } catch (err: any) {
      showToast(err?.message || "Photo upload failed", "error");
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleUploadAlbumCover = async (file: File, forEdit = false) => {
    setUploadingAlbumCover(true);
    try {
      const up = await uploadPhotographerAsset(file, "album");
      if (forEdit) {
        setEditAlbCoverMediaId(up.mediaId);
        setEditAlbCoverUrl(up.url);
      } else {
        setAlbumCoverMediaId(up.mediaId);
        setAlbumCoverPreview(up.url);
      }
      showToast("Album cover uploaded", "success");
    } catch (err: any) {
      showToast(err?.message || "Cover upload failed", "error");
    } finally {
      setUploadingAlbumCover(false);
    }
  };

  const handlePatchItem = async (payload: Record<string, any>, successMsg?: string) => {
    try {
      const res = await fetch("/api/vendor/photographer/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || "Update failed");
      }
      await onRefresh();
      if (successMsg) showToast(successMsg, "success");
    } catch (err: any) {
      showToast(err?.message || "Update failed", "error");
    }
  };

  const handleMovePhoto = async (index: number, direction: -1 | 1) => {
    const nextIdx = index + direction;
    if (nextIdx < 0 || nextIdx >= photos.length) return;
    const ordered = [...photos];
    const [moved] = ordered.splice(index, 1);
    ordered.splice(nextIdx, 0, moved);

    await handlePatchItem({
      kind: "reorder",
      orderedIds: ordered.map((p) => p.id),
    });
  };

  const openPhotoEditor = (photo: PhotographerPhotoItem) => {
    setEditingPhoto(photo);
    setEditPhotoCaption(photo.caption || "");
    setEditPhotoDesc(photo.description || "");
    setEditPhotoCat(photo.category || "Wedding");
    setEditPhotoAlbumId(photo.albumId || "");
    setEditPhotoCover(photo.isCover);
    setEditPhotoPublic(photo.isPublic !== false);
  };

  const handleSavePhotoEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    setSavingPhotoEdit(true);
    try {
      await handlePatchItem(
        {
          kind: "photo",
          id: editingPhoto.id,
          caption: editPhotoCaption.trim(),
          description: editPhotoDesc.trim(),
          category: editPhotoCat,
          albumId: editPhotoAlbumId || null,
          isCover: editPhotoCover,
          isPublic: editPhotoPublic,
        },
        "Photo updated"
      );
      setEditingPhoto(null);
    } finally {
      setSavingPhotoEdit(false);
    }
  };

  const openAlbumEditor = (alb: PhotographerAlbumItem) => {
    setEditingAlbum(alb);
    setEditAlbTitle(alb.title);
    setEditAlbLocation(alb.location || "");
    setEditAlbCategory(alb.category || "Wedding");
    setEditAlbDesc(alb.description || "");
    setEditAlbCoverMediaId(alb.coverMediaId || null);
    setEditAlbCoverUrl(alb.coverUrl || "");
    setEditAlbPublic(alb.isPublic !== false);
  };

  const handleSaveAlbumEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum || !editAlbTitle.trim()) return;
    setSavingAlbEdit(true);
    try {
      await handlePatchItem(
        {
          kind: "album",
          id: editingAlbum.id,
          title: editAlbTitle.trim(),
          location: editAlbLocation.trim(),
          category: editAlbCategory,
          description: editAlbDesc.trim(),
          coverMediaId: editAlbCoverMediaId,
          isPublic: editAlbPublic,
        },
        "Album updated"
      );
      setEditingAlbum(null);
    } finally {
      setSavingAlbEdit(false);
    }
  };

  const openVideoEditor = (v: PhotographerVideoItem) => {
    setEditingVideo(v);
    setEditVidTitle(v.title);
    setEditVidUrl(v.videoUrl);
    setEditVidCat(v.category || "Cinematic");
    setEditVidPublic(v.isPublic !== false);
  };

  const handleSaveVideoEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo || !editVidTitle.trim() || !editVidUrl.trim()) return;
    await handlePatchItem(
      {
        kind: "video",
        id: editingVideo.id,
        title: editVidTitle.trim(),
        videoUrl: editVidUrl.trim(),
        category: editVidCat,
        isPublic: editVidPublic,
      },
      "Film updated"
    );
    setEditingVideo(null);
  };

  const handleDelete = async (id: string, kind: "photo" | "album" | "video") => {
    try {
      const res = await fetch(
        `/api/vendor/photographer/portfolio?kind=${kind}&id=${encodeURIComponent(id)}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Delete failed");
      await onRefresh();
      showToast(
        `${kind === "photo" ? "Photo" : kind === "album" ? "Album" : "Video"} deleted`,
        "success"
      );
    } catch (err: any) {
      showToast(err?.message || "Delete failed", "error");
    }
  };

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!albumTitle.trim()) return;
    setSavingAlbum(true);
    try {
      const res = await fetch("/api/vendor/photographer/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          kind: "album",
          title: albumTitle.trim(),
          location: albumLocation.trim(),
          category: albumCategory,
          description: albumDescription.trim(),
          coverMediaId: albumCoverMediaId,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create album");
      setAlbumTitle("");
      setAlbumLocation("");
      setAlbumDescription("");
      setAlbumCoverMediaId(null);
      setAlbumCoverPreview("");
      await onRefresh();
      showToast("Album created", "success");
    } catch (err: any) {
      showToast(err?.message || "Album creation failed", "error");
    } finally {
      setSavingAlbum(false);
    }
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;
    setSavingVideo(true);
    try {
      const res = await fetch("/api/vendor/photographer/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          kind: "video",
          title: videoTitle.trim(),
          videoUrl: videoUrl.trim(),
          category: videoCategory,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to add film");
      setVideoTitle("");
      setVideoUrl("");
      await onRefresh();
      showToast("Wedding film added", "success");
    } catch (err: any) {
      showToast(err?.message || "Failed to add video", "error");
    } finally {
      setSavingVideo(false);
    }
  };

  const visiblePhotos =
    selectedCategory === "All"
      ? photos
      : photos.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#26201D]">
            Portfolio &amp; Gallery
          </h2>
          <p className="text-xs text-[#7A6B5F] mt-0.5">
            Upload full-resolution imagery, organize story albums, add wedding films, and control public visibility
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-[#E5DAC8] bg-white p-1 self-start sm:self-auto">
          {[
            { id: "photos" as const, label: `Photos (${photos.length})` },
            { id: "albums" as const, label: `Albums (${albums.length})` },
            { id: "videos" as const, label: `Films (${videos.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                subTab === tab.id
                  ? "bg-[#26201D] text-[#FAF7F2]"
                  : "text-[#6C5E53] hover:text-[#26201D]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* PHOTOS SUB-TAB */}
      {subTab === "photos" && (
        <div className="space-y-5">
          {/* Upload Panel */}
          <div className="rounded-2xl border border-[#E5DAC8] bg-white p-5 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#26201D]">Upload Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#6C5E53] mb-1">
                  Category Tag
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E5DAC8] bg-[#FAF7F2] px-3 py-2 text-xs font-medium text-[#26201D]"
                >
                  {PHOTOGRAPHY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6C5E53] mb-1">
                  Assign to Album (Optional)
                </label>
                <select
                  value={uploadAlbumId}
                  onChange={(e) => setUploadAlbumId(e.target.value)}
                  className="w-full rounded-xl border border-[#E5DAC8] bg-[#FAF7F2] px-3 py-2 text-xs font-medium text-[#26201D]"
                >
                  <option value="">No specific album</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6C5E53] mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Couple portrait in golden hour..."
                  className="w-full rounded-xl border border-[#E5DAC8] bg-[#FAF7F2] px-3 py-2 text-xs text-[#26201D]"
                />
              </div>
            </div>

            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D7CBB9] bg-[#FAF7F2]/70 p-6 cursor-pointer hover:border-[#0F4C45] transition-colors">
              {uploadingPhotos ? (
                <Loader2 className="w-7 h-7 animate-spin text-[#0F4C45] mb-2" />
              ) : (
                <Upload className="w-7 h-7 text-[#C8A96A] mb-2" />
              )}
              <span className="text-sm font-semibold text-[#26201D] text-center">
                {uploadingPhotos
                  ? "Uploading high-res files to cloud storage..."
                  : "Select multiple wedding photos (JPG, PNG, WebP · Max 10MB each)"}
              </span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                disabled={uploadingPhotos}
                onChange={(e) => {
                  if (e.target.files) handleMultiPhotoUpload(e.target.files);
                }}
              />
            </label>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["All", ...PHOTOGRAPHY_CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium border ${
                  selectedCategory === cat
                    ? "bg-[#0F4C45] text-white border-[#0F4C45]"
                    : "bg-white text-[#6C5E53] border-[#E5DAC8]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {visiblePhotos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
              <ImageIcon className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
              <p className="text-sm font-medium text-[#26201D]">No photos in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visiblePhotos.map((photo, idx) => {
                const isVis = photo.isPublic !== false;
                return (
                  <div
                    key={photo.id}
                    className={`group rounded-2xl border bg-white overflow-hidden flex flex-col shadow-2xs transition-all ${
                      isVis ? "border-[#E5DAC8]" : "border-amber-300 opacity-85"
                    }`}
                  >
                    <div
                      className="relative aspect-[4/3] bg-[#FAF7F2] cursor-pointer overflow-hidden"
                      onClick={() => setLightboxUrl(photo.imageUrl)}
                    >
                      <img
                        src={photo.imageUrl}
                        alt={photo.caption || "Wedding portfolio photo"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-medium text-white">
                          {photo.category}
                        </span>
                        {photo.isCover && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#C8A96A] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                            <Star className="w-2.5 h-2.5 fill-white" /> Cover
                          </span>
                        )}
                        {!isVis && (
                          <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex flex-col justify-between gap-3 flex-1">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#26201D] truncate">
                          {photo.caption || "Untitled photograph"}
                        </p>
                        {photo.description && (
                          <p className="text-xs text-[#6C5E53] mt-0.5 line-clamp-2">
                            {photo.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-2 border-t border-[#F0EAE0]">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(idx, -1)}
                            disabled={idx === 0}
                            title="Move earlier"
                            className="p-1.5 rounded-lg border border-[#E5DAC8] text-[#5E544D] disabled:opacity-35"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(idx, 1)}
                            disabled={idx === visiblePhotos.length - 1}
                            title="Move later"
                            className="p-1.5 rounded-lg border border-[#E5DAC8] text-[#5E544D] disabled:opacity-35"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              handlePatchItem(
                                { kind: "photo", id: photo.id, isPublic: !isVis },
                                isVis ? "Photo hidden from public gallery" : "Photo visible publicly"
                              )
                            }
                            title={isVis ? "Hide from public" : "Make public"}
                            className="p-1.5 rounded-lg border border-[#E5DAC8] text-[#5E544D] hover:bg-[#FAF7F2]"
                          >
                            {isVis ? <Eye className="w-3.5 h-3.5 text-[#0F4C45]" /> : <EyeOff className="w-3.5 h-3.5 text-amber-700" />}
                          </button>
                          {!photo.isCover && (
                            <button
                              type="button"
                              onClick={() =>
                                handlePatchItem(
                                  { kind: "photo", id: photo.id, isCover: true },
                                  "Cover photo updated"
                                )
                              }
                              title="Set as portfolio cover"
                              className="p-1.5 rounded-lg border border-[#E5DAC8] text-[#7C5C24] hover:bg-[#FAF7F2]"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openPhotoEditor(photo)}
                            title="Edit caption, story & album"
                            className="p-1.5 rounded-lg border border-[#E5DAC8] text-[#26201D] hover:bg-[#FAF7F2]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(photo.id, "photo")}
                            title="Delete photo"
                            className="p-1.5 rounded-lg border border-[#E5DAC8] text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ALBUMS SUB-TAB */}
      {subTab === "albums" && (
        <div className="space-y-5">
          <form
            onSubmit={handleCreateAlbum}
            className="rounded-2xl border border-[#E5DAC8] bg-white p-5 space-y-4"
          >
            <h3 className="font-serif text-lg font-semibold text-[#26201D] flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-[#0F4C45]" />
              Create Curated Album
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                required
                placeholder="Album Title (e.g., Arjun & Meera — Lake Kumarakom)"
                className="rounded-xl border border-[#E5DAC8] px-3.5 py-2 text-xs text-[#26201D]"
              />
              <input
                type="text"
                value={albumLocation}
                onChange={(e) => setAlbumLocation(e.target.value)}
                placeholder="Wedding Location (e.g., Udaipur)"
                className="rounded-xl border border-[#E5DAC8] px-3.5 py-2 text-xs text-[#26201D]"
              />
              <select
                value={albumCategory}
                onChange={(e) => setAlbumCategory(e.target.value)}
                className="rounded-xl border border-[#E5DAC8] px-3.5 py-2 text-xs text-[#26201D]"
              >
                {PHOTOGRAPHY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                value={albumDescription}
                onChange={(e) => setAlbumDescription(e.target.value)}
                placeholder="Story description for this album..."
                className="flex-1 rounded-xl border border-[#E5DAC8] px-3.5 py-2 text-xs text-[#26201D]"
              />
              <label className="inline-flex items-center gap-2 rounded-xl border border-[#E5DAC8] bg-[#FAF7F2] px-3.5 py-2 text-xs font-medium text-[#26201D] cursor-pointer shrink-0">
                {uploadingAlbumCover ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5 text-[#C8A96A]" />
                )}
                {albumCoverPreview ? "Cover Uploaded ✓" : "Upload Cover"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUploadAlbumCover(f, false);
                  }}
                />
              </label>
              <button
                type="submit"
                disabled={savingAlbum}
                className="rounded-xl bg-[#0F4C45] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0B3A35] shrink-0"
              >
                {savingAlbum ? "Creating..." : "Create Album"}
              </button>
            </div>
          </form>

          {albums.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
              <p className="text-sm font-medium text-[#26201D]">No albums created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map((alb) => {
                const isVis = alb.isPublic !== false;
                return (
                  <div
                    key={alb.id}
                    className={`rounded-2xl border bg-white overflow-hidden flex flex-col justify-between ${
                      isVis ? "border-[#E5DAC8]" : "border-amber-300 opacity-85"
                    }`}
                  >
                    <div className="aspect-[16/10] bg-[#FAF7F2] relative">
                      {alb.coverUrl ? (
                        <img
                          src={alb.coverUrl}
                          alt={alb.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#7A6B5F] px-4 text-center">
                          Assign photos or upload cover image
                        </div>
                      )}
                      <span className="absolute top-2.5 left-2.5 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-medium text-white">
                        {alb.category} · {alb.photoCount} photos
                      </span>
                      {!isVis && (
                        <span className="absolute top-2.5 right-2.5 rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-serif font-semibold text-sm text-[#26201D]">
                          {alb.title}
                        </h4>
                        {alb.location && (
                          <p className="text-xs text-[#7A6B5F] mt-0.5">{alb.location}</p>
                        )}
                        {alb.description && (
                          <p className="text-xs text-[#5E544D] mt-1 line-clamp-2">
                            {alb.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handlePatchItem(
                              { kind: "album", id: alb.id, isPublic: !isVis },
                              isVis ? "Album hidden from public" : "Album published live"
                            )
                          }
                          title={isVis ? "Hide album" : "Publish album"}
                          className="p-1.5 rounded-lg border border-[#E5DAC8] text-[#5E544D] hover:bg-[#FAF7F2]"
                        >
                          {isVis ? <Eye className="w-3.5 h-3.5 text-[#0F4C45]" /> : <EyeOff className="w-3.5 h-3.5 text-amber-700" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => openAlbumEditor(alb)}
                          title="Edit album"
                          className="p-1.5 rounded-lg border border-[#E5DAC8] text-[#26201D] hover:bg-[#FAF7F2]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(alb.id, "album")}
                          className="p-1.5 rounded-lg border border-[#E5DAC8] text-red-600 hover:bg-red-50"
                          title="Delete album"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* VIDEOS SUB-TAB */}
      {subTab === "videos" && (
        <div className="space-y-5">
          <form
            onSubmit={handleAddVideo}
            className="rounded-2xl border border-[#E5DAC8] bg-white p-5 space-y-4"
          >
            <h3 className="font-serif text-lg font-semibold text-[#26201D] flex items-center gap-2">
              <Film className="w-4 h-4 text-[#C8A96A]" />
              Add Wedding Film / Reel Link
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                required
                placeholder="Film Title (e.g., Kerala Backwaters Wedding Teaser)"
                className="rounded-xl border border-[#E5DAC8] px-3.5 py-2 text-xs text-[#26201D]"
              />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                placeholder="YouTube, Vimeo, or Instagram Reel URL"
                className="rounded-xl border border-[#E5DAC8] px-3.5 py-2 text-xs text-[#26201D]"
              />
              <div className="flex gap-2">
                <select
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="flex-1 rounded-xl border border-[#E5DAC8] px-3 py-2 text-xs text-[#26201D]"
                >
                  {PHOTOGRAPHY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={savingVideo}
                  className="rounded-xl bg-[#0F4C45] px-4 py-2 text-xs font-semibold text-white"
                >
                  {savingVideo ? "Adding..." : "Add Film"}
                </button>
              </div>
            </div>
          </form>

          {videos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
              <Film className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
              <p className="text-sm font-medium text-[#26201D]">No wedding films added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((v) => {
                const isVis = v.isPublic !== false;
                return (
                  <div
                    key={v.id}
                    className={`rounded-2xl border bg-white p-4 flex items-center justify-between gap-4 ${
                      isVis ? "border-[#E5DAC8]" : "border-amber-300 opacity-85"
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="inline-block rounded-full bg-[#FAF7F2] border border-[#E5DAC8] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#7C5C24]">
                        {v.platform} · {v.category} {!isVis ? "· Hidden" : ""}
                      </span>
                      <h4 className="font-semibold text-sm text-[#26201D] mt-1">{v.title}</h4>
                      <a
                        href={v.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#0F4C45] hover:underline truncate block mt-0.5"
                      >
                        {v.videoUrl}
                      </a>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handlePatchItem(
                            { kind: "video", id: v.id, isPublic: !isVis },
                            isVis ? "Film hidden" : "Film visible publicly"
                          )
                        }
                        className="p-2 rounded-lg border border-[#E5DAC8] text-[#5E544D]"
                        title={isVis ? "Hide" : "Publish"}
                      >
                        {isVis ? <Eye className="w-4 h-4 text-[#0F4C45]" /> : <EyeOff className="w-4 h-4 text-amber-700" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => openVideoEditor(v)}
                        className="p-2 rounded-lg border border-[#E5DAC8] text-[#26201D]"
                        title="Edit film"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.id, "video")}
                        className="p-2 rounded-lg border border-[#E5DAC8] text-red-600 hover:bg-red-50"
                        title="Delete film"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditingPhoto(null)}
        >
          <form
            onSubmit={handleSavePhotoEdit}
            className="w-full max-w-md rounded-2xl bg-[#FDFBF7] border border-[#E5DAC8] p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-[#26201D]">Edit Photo Details</h3>
              <button type="button" onClick={() => setEditingPhoto(null)}>
                <X className="w-5 h-5 text-[#7A6B5F]" />
              </button>
            </div>
            <img
              src={editingPhoto.imageUrl}
              alt={editPhotoCaption}
              className="w-full h-40 object-cover rounded-xl border border-[#E5DAC8]"
            />
            <div>
              <label className="block text-xs font-medium text-[#6C5E53] mb-1">Caption</label>
              <input
                type="text"
                value={editPhotoCaption}
                onChange={(e) => setEditPhotoCaption(e.target.value)}
                className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6C5E53] mb-1">Description / Backstory</label>
              <textarea
                rows={2}
                value={editPhotoDesc}
                onChange={(e) => setEditPhotoDesc(e.target.value)}
                className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#6C5E53] mb-1">Category</label>
                <select
                  value={editPhotoCat}
                  onChange={(e) => setEditPhotoCat(e.target.value)}
                  className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
                >
                  {PHOTOGRAPHY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#6C5E53] mb-1">Album</label>
                <select
                  value={editPhotoAlbumId}
                  onChange={(e) => setEditPhotoAlbumId(e.target.value)}
                  className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
                >
                  <option value="">None</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>{a.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[#26201D]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPhotoCover}
                  onChange={(e) => setEditPhotoCover(e.target.checked)}
                />
                Use as Portfolio Cover
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editPhotoPublic}
                  onChange={(e) => setEditPhotoPublic(e.target.checked)}
                />
                Visible on Public Profile
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingPhoto(null)} className="px-4 py-2 text-xs text-[#7A6B5F]">
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingPhotoEdit}
                className="rounded-xl bg-[#0F4C45] px-5 py-2 text-xs font-semibold text-white"
              >
                {savingPhotoEdit ? "Saving..." : "Save Photo"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Album Modal */}
      {editingAlbum && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditingAlbum(null)}
        >
          <form
            onSubmit={handleSaveAlbumEdit}
            className="w-full max-w-md rounded-2xl bg-[#FDFBF7] border border-[#E5DAC8] p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-[#26201D]">Edit Album</h3>
              <button type="button" onClick={() => setEditingAlbum(null)}>
                <X className="w-5 h-5 text-[#7A6B5F]" />
              </button>
            </div>
            {editAlbCoverUrl && (
              <img
                src={editAlbCoverUrl}
                alt={editAlbTitle}
                className="w-full h-36 object-cover rounded-xl border border-[#E5DAC8]"
              />
            )}
            <label className="inline-flex items-center gap-2 rounded-xl border border-[#E5DAC8] bg-white px-3.5 py-2 text-xs font-medium text-[#26201D] cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#C8A96A]" />
              {uploadingAlbumCover ? "Uploading..." : "Change Album Cover Image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleUploadAlbumCover(f, true);
                }}
              />
            </label>
            <input
              type="text"
              required
              value={editAlbTitle}
              onChange={(e) => setEditAlbTitle(e.target.value)}
              placeholder="Album Title"
              className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={editAlbLocation}
                onChange={(e) => setEditAlbLocation(e.target.value)}
                placeholder="Location"
                className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
              />
              <select
                value={editAlbCategory}
                onChange={(e) => setEditAlbCategory(e.target.value)}
                className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
              >
                {PHOTOGRAPHY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <textarea
              rows={2}
              value={editAlbDesc}
              onChange={(e) => setEditAlbDesc(e.target.value)}
              placeholder="Album story..."
              className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
            />
            <label className="flex items-center gap-2 text-xs text-[#26201D] cursor-pointer">
              <input
                type="checkbox"
                checked={editAlbPublic}
                onChange={(e) => setEditAlbPublic(e.target.checked)}
              />
              Visible on Public Profile
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingAlbum(null)} className="px-4 py-2 text-xs text-[#7A6B5F]">
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingAlbEdit}
                className="rounded-xl bg-[#0F4C45] px-5 py-2 text-xs font-semibold text-white"
              >
                {savingAlbEdit ? "Saving..." : "Save Album"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Video Modal */}
      {editingVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setEditingVideo(null)}
        >
          <form
            onSubmit={handleSaveVideoEdit}
            className="w-full max-w-md rounded-2xl bg-[#FDFBF7] border border-[#E5DAC8] p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-semibold text-[#26201D]">Edit Wedding Film</h3>
              <button type="button" onClick={() => setEditingVideo(null)}>
                <X className="w-5 h-5 text-[#7A6B5F]" />
              </button>
            </div>
            <input
              type="text"
              required
              value={editVidTitle}
              onChange={(e) => setEditVidTitle(e.target.value)}
              className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
            />
            <input
              type="url"
              required
              value={editVidUrl}
              onChange={(e) => setEditVidUrl(e.target.value)}
              className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
            />
            <select
              value={editVidCat}
              onChange={(e) => setEditVidCat(e.target.value)}
              className="w-full rounded-xl border border-[#E5DAC8] bg-white px-3 py-2 text-xs text-[#26201D]"
            >
              {PHOTOGRAPHY_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-[#26201D] cursor-pointer">
              <input
                type="checkbox"
                checked={editVidPublic}
                onChange={(e) => setEditVidPublic(e.target.checked)}
              />
              Visible on Public Profile
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditingVideo(null)} className="px-4 py-2 text-xs text-[#7A6B5F]">
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#0F4C45] px-5 py-2 text-xs font-semibold text-white"
              >
                Save Film
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 rounded-full bg-white/15 p-2 text-white hover:bg-white/25"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxUrl}
            alt="Full size preview"
            className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
