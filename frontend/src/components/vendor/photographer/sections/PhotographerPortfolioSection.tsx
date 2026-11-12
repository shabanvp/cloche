"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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
  const [savingAlbum, setSavingAlbum] = useState(false);

  // Video creation
  const [videoTitle, setVideoTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoCategory, setVideoCategory] = useState("Cinematic");
  const [savingVideo, setSavingVideo] = useState(false);

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

  const handleSetCover = async (photoId: string) => {
    try {
      const res = await fetch("/api/vendor/photographer/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ kind: "photo", id: photoId, isCover: true }),
      });
      if (!res.ok) throw new Error("Failed to set cover");
      await onRefresh();
      showToast("Cover photo updated", "success");
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

    try {
      await fetch("/api/vendor/photographer/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          kind: "reorder",
          orderedIds: ordered.map((p) => p.id),
        }),
      });
      await onRefresh();
    } catch {
      showToast("Failed to reorder photos", "error");
    }
  };

  const handleDelete = async (id: string, kind: "photo" | "album" | "video") => {
    try {
      const res = await fetch(
        `/api/vendor/photographer/portfolio?kind=${kind}&id=${encodeURIComponent(id)}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error("Delete failed");
      await onRefresh();
      showToast(`${kind === "photo" ? "Photo" : kind === "album" ? "Album" : "Video"} deleted`, "success");
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
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed to create album");
      setAlbumTitle("");
      setAlbumLocation("");
      setAlbumDescription("");
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
          <h2 className="font-serif text-2xl font-semibold text-[#2B2523]">Portfolio & Gallery</h2>
          <p className="text-xs text-[#7A6F67] mt-0.5">
            Showcase high-resolution photographs, curated wedding albums, and cinema films
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-[#E6DDD0] bg-white p-1">
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
                  ? "bg-[#2B2523] text-white"
                  : "text-[#5E544D] hover:text-[#2B2523]"
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
          <div className="rounded-2xl border border-[#E6DDD0] bg-white p-5 space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#2B2523]">Upload Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5E544D] mb-1">Category Tag</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3 py-2 text-xs font-medium text-[#2B2523]"
                >
                  {PHOTOGRAPHY_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#5E544D] mb-1">
                  Assign to Album (Optional)
                </label>
                <select
                  value={uploadAlbumId}
                  onChange={(e) => setUploadAlbumId(e.target.value)}
                  className="w-full rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3 py-2 text-xs font-medium text-[#2B2523]"
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
                <label className="block text-xs font-medium text-[#5E544D] mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Couple portrait in twilight..."
                  className="w-full rounded-xl border border-[#E6DDD0] bg-[#FAF7F2] px-3 py-2 text-xs text-[#2B2523]"
                />
              </div>
            </div>

            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D7CBB9] bg-[#FAF7F2]/70 p-6 cursor-pointer hover:border-[#0F4C45] transition-colors">
              {uploadingPhotos ? (
                <Loader2 className="w-7 h-7 animate-spin text-[#0F4C45] mb-2" />
              ) : (
                <Upload className="w-7 h-7 text-[#C8A96A] mb-2" />
              )}
              <span className="text-sm font-semibold text-[#2B2523]">
                {uploadingPhotos
                  ? "Uploading high-res files to cloud storage..."
                  : "Click to select multiple wedding photos (JPG, PNG, WebP · Max 10MB each)"}
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
                    : "bg-white text-[#5E544D] border-[#E6DDD0]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {visiblePhotos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
              <ImageIcon className="w-8 h-8 mx-auto text-[#C8A96A] mb-2" />
              <p className="text-sm font-medium text-[#2B2523]">No photos in this category yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visiblePhotos.map((photo, idx) => (
                <div
                  key={photo.id}
                  className="group rounded-2xl border border-[#E6DDD0] bg-white overflow-hidden flex flex-col"
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
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-medium text-white">
                        {photo.category}
                      </span>
                      {photo.isCover && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#C8A96A] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                          <Star className="w-2.5 h-2.5 fill-white" /> Cover
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#2B2523] truncate">
                        {photo.caption || "Untitled frame"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMovePhoto(idx, -1)}
                        disabled={idx === 0}
                        title="Move earlier"
                        className="p-1.5 rounded-lg border border-[#E6DDD0] text-[#5E544D] disabled:opacity-35"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMovePhoto(idx, 1)}
                        disabled={idx === visiblePhotos.length - 1}
                        title="Move later"
                        className="p-1.5 rounded-lg border border-[#E6DDD0] text-[#5E544D] disabled:opacity-35"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      {!photo.isCover && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(photo.id)}
                          title="Set as portfolio cover"
                          className="p-1.5 rounded-lg border border-[#E6DDD0] text-[#7C5C24] hover:bg-[#FAF7F2]"
                        >
                          <Star className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(photo.id, "photo")}
                        title="Delete photo"
                        className="p-1.5 rounded-lg border border-[#E6DDD0] text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ALBUMS SUB-TAB */}
      {subTab === "albums" && (
        <div className="space-y-5">
          <form
            onSubmit={handleCreateAlbum}
            className="rounded-2xl border border-[#E6DDD0] bg-white p-5 space-y-4"
          >
            <h3 className="font-serif text-lg font-semibold text-[#2B2523] flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-[#0F4C45]" />
              Create Wedding Album
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={albumTitle}
                onChange={(e) => setAlbumTitle(e.target.value)}
                required
                placeholder="Album Title (e.g., Arjun & Meera — Lake Kumarakom)"
                className="rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs text-[#2B2523]"
              />
              <input
                type="text"
                value={albumLocation}
                onChange={(e) => setAlbumLocation(e.target.value)}
                placeholder="Wedding Location (e.g., Udaipur)"
                className="rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs text-[#2B2523]"
              />
              <select
                value={albumCategory}
                onChange={(e) => setAlbumCategory(e.target.value)}
                className="rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs text-[#2B2523]"
              >
                {PHOTOGRAPHY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={albumDescription}
                onChange={(e) => setAlbumDescription(e.target.value)}
                placeholder="Short story description for this album..."
                className="flex-1 rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs text-[#2B2523]"
              />
              <button
                type="submit"
                disabled={savingAlbum}
                className="rounded-xl bg-[#0F4C45] px-5 py-2 text-xs font-semibold text-white hover:bg-[#0C3D38]"
              >
                {savingAlbum ? "Creating..." : "Create Album"}
              </button>
            </div>
          </form>

          {albums.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#DED4C6] bg-white p-10 text-center">
              <p className="text-sm font-medium text-[#2B2523]">No albums created yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {albums.map((alb) => (
                <div
                  key={alb.id}
                  className="rounded-2xl border border-[#E6DDD0] bg-white overflow-hidden"
                >
                  <div className="aspect-[16/10] bg-[#FAF7F2] relative">
                    {alb.coverUrl ? (
                      <img
                        src={alb.coverUrl}
                        alt={alb.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-[#7A6F67]">
                        Upload photos and assign to this album
                      </div>
                    )}
                    <span className="absolute top-2.5 left-2.5 rounded-full bg-black/65 px-2.5 py-0.5 text-[10px] font-medium text-white">
                      {alb.category} · {alb.photoCount} photos
                    </span>
                  </div>
                  <div className="p-4 flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-[#2B2523]">{alb.title}</h4>
                      {alb.location && (
                        <p className="text-xs text-[#7A6F67] mt-0.5">{alb.location}</p>
                      )}
                      {alb.description && (
                        <p className="text-xs text-[#5E544D] mt-1 line-clamp-2">{alb.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(alb.id, "album")}
                      className="p-1.5 rounded-lg border border-[#E6DDD0] text-red-600 hover:bg-red-50"
                      title="Delete album"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIDEOS SUB-TAB */}
      {subTab === "videos" && (
        <div className="space-y-5">
          <form
            onSubmit={handleAddVideo}
            className="rounded-2xl border border-[#E6DDD0] bg-white p-5 space-y-4"
          >
            <h3 className="font-serif text-lg font-semibold text-[#2B2523] flex items-center gap-2">
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
                className="rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs text-[#2B2523]"
              />
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                placeholder="YouTube, Vimeo, or Instagram Reel URL"
                className="rounded-xl border border-[#E6DDD0] px-3.5 py-2 text-xs text-[#2B2523]"
              />
              <div className="flex gap-2">
                <select
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="flex-1 rounded-xl border border-[#E6DDD0] px-3 py-2 text-xs text-[#2B2523]"
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
              <p className="text-sm font-medium text-[#2B2523]">No wedding films added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((v) => (
                <div
                  key={v.id}
                  className="rounded-2xl border border-[#E6DDD0] bg-white p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-[#FAF7F2] border border-[#E6DDD0] px-2 py-0.5 text-[10px] font-semibold uppercase text-[#7C5C24]">
                      {v.platform} · {v.category}
                    </span>
                    <h4 className="font-semibold text-sm text-[#2B2523] mt-1">{v.title}</h4>
                    <a
                      href={v.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#0F4C45] hover:underline truncate block mt-0.5"
                    >
                      {v.videoUrl}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(v.id, "video")}
                    className="p-2 rounded-lg border border-[#E6DDD0] text-red-600 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
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

