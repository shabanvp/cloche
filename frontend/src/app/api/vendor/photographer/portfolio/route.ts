import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseFetch } from "@/lib/supabase";
import {
  requireAuthenticatedPhotographer,
  verifyVendorOwnedRow,
} from "@/lib/photographerAuth";
import {
  PHOTOGRAPHY_CATEGORIES,
  PhotographerPortfolioMeta,
  addGalleryPhotoItem,
  calculateAndSyncCompletion,
  deleteGalleryPhotoItem,
  listPhotographerPortfolio,
  readVersionSection,
  updateGalleryPhotoItem,
  upsertVersionSection,
} from "@/lib/photographerData";

function revalidateStorefront(slug: string, vendorId: string) {
  try {
    revalidatePath("/photographers");
    revalidatePath(`/photographers/${slug}`);
    revalidatePath(`/photographers/${slug}/gallery`);
    revalidatePath(`/photographers/${vendorId}`);
    revalidatePath(`/photographers/${vendorId}/gallery`);
  } catch {
    // non-fatal
  }
}

export async function GET(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const data = await listPhotographerPortfolio(context.vendorId);
    return NextResponse.json({
      success: true,
      data,
      categories: PHOTOGRAPHY_CATEGORIES,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load photographer portfolio." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const kind = String(body?.kind || "photo").toLowerCase();

    if (kind === "album") {
      const title = String(body?.title || "").trim();
      if (!title) {
        return NextResponse.json({ error: "Album title is required." }, { status: 400 });
      }
      const { data: inserted, error } = await supabaseFetch<any[]>("vendor_portfolio", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          vendor_id: context.vendorId,
          title,
          description: String(body?.description || "").trim(),
          location: String(body?.location || "").trim(),
          event_date: body?.eventDate || null,
          cover_media_id: body?.coverMediaId || null,
        }),
      });
      if (error || !Array.isArray(inserted) || !inserted[0]?.id) {
        throw new Error(error?.message || "Failed to create album.");
      }
      if (body?.category) {
        const meta = await readVersionSection<PhotographerPortfolioMeta>(
          context.vendorId,
          "portfolio"
        );
        await upsertVersionSection(
          context.vendorId,
          "portfolio",
          {
            albumCategories: {
              ...(meta.albumCategories || {}),
              [inserted[0].id]: String(body.category),
            },
          },
          context.userId
        );
      }
      revalidateStorefront(context.slug, context.vendorId);
      const portfolio = await listPhotographerPortfolio(context.vendorId);
      return NextResponse.json({ success: true, created: inserted[0], data: portfolio }, { status: 201 });
    }

    if (kind === "video") {
      const title = String(body?.title || "").trim();
      const videoUrl = String(body?.videoUrl || "").trim();
      if (!title || !videoUrl) {
        return NextResponse.json({ error: "Video title and URL are required." }, { status: 400 });
      }
      const rawPlatform = String(body?.platform || "").toLowerCase();
      let platform: "youtube" | "vimeo" | "instagram" | "custom" = "custom";
      if (rawPlatform === "youtube" || /youtu\.?be/i.test(videoUrl)) platform = "youtube";
      else if (rawPlatform === "vimeo" || /vimeo\.com/i.test(videoUrl)) platform = "vimeo";
      else if (rawPlatform === "instagram" || /instagram\.com/i.test(videoUrl)) platform = "instagram";

      const { data: existingVideos } = await supabaseFetch<any[]>(
        `vendor_videos?vendor_id=eq.${encodeURIComponent(context.vendorId)}&select=id`
      );
      const { data: inserted, error } = await supabaseFetch<any[]>("vendor_videos", {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({
          vendor_id: context.vendorId,
          title,
          video_url: videoUrl,
          thumbnail_url: String(body?.thumbnailUrl || "").trim() || null,
          platform,
          sort_order: Array.isArray(existingVideos) ? existingVideos.length : 0,
        }),
      });
      if (error || !Array.isArray(inserted) || !inserted[0]?.id) {
        throw new Error(error?.message || "Failed to add wedding film.");
      }

      if (body?.category) {
        const meta = await readVersionSection<PhotographerPortfolioMeta>(
          context.vendorId,
          "portfolio"
        );
        await upsertVersionSection(
          context.vendorId,
          "portfolio",
          {
            videoCategories: {
              ...(meta.videoCategories || {}),
              [inserted[0].id]: String(body.category),
            },
          },
          context.userId
        );
      }

      await calculateAndSyncCompletion(context.vendorId);
      revalidateStorefront(context.slug, context.vendorId);
      const portfolio = await listPhotographerPortfolio(context.vendorId);
      return NextResponse.json({ success: true, created: inserted[0], data: portfolio }, { status: 201 });
    }

    // Photo item(s) linked via uploaded mediaId
    const items = Array.isArray(body?.items)
      ? body.items
      : body?.mediaId
        ? [body]
        : [];
    if (items.length === 0) {
      return NextResponse.json({ error: "mediaId is required for portfolio photo." }, { status: 400 });
    }

    const createdList = [];
    for (const item of items) {
      if (!item?.mediaId) continue;
      const ownedMedia = await verifyVendorOwnedRow("media", String(item.mediaId), context.vendorId);
      if (!ownedMedia) {
        return NextResponse.json({ error: "Forbidden: Uploaded media does not belong to vendor." }, { status: 403 });
      }
      if (item.albumId) {
        const ownedAlbum = await verifyVendorOwnedRow(
          "vendor_portfolio",
          String(item.albumId),
          context.vendorId
        );
        if (!ownedAlbum) {
          return NextResponse.json({ error: "Forbidden: Target album not found." }, { status: 403 });
        }
      }
      const created = await addGalleryPhotoItem(context.vendorId, context.userId, {
        mediaId: String(item.mediaId),
        caption: String(item.caption || ""),
        category: String(item.category || "Wedding"),
        albumId: item.albumId ? String(item.albumId) : null,
        isCover: Boolean(item.isCover),
      });
      createdList.push(created);
    }

    revalidateStorefront(context.slug, context.vendorId);
    const portfolio = await listPhotographerPortfolio(context.vendorId);
    return NextResponse.json({ success: true, created: createdList, data: portfolio }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to add portfolio item." },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const body = await req.json();
    const kind = String(body?.kind || "photo").toLowerCase();

    if (kind === "reorder" && Array.isArray(body?.orderedIds)) {
      await Promise.all(
        body.orderedIds.map((id: string, idx: number) =>
          supabaseFetch(
            `vendor_gallery?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(context.vendorId)}`,
            { method: "PATCH", body: JSON.stringify({ sort_order: idx }) }
          )
        )
      );
      revalidateStorefront(context.slug, context.vendorId);
      const portfolio = await listPhotographerPortfolio(context.vendorId);
      return NextResponse.json({ success: true, data: portfolio });
    }

    const id = String(body?.id || "");
    if (!id) {
      return NextResponse.json({ error: "Item id is required." }, { status: 400 });
    }

    if (kind === "album") {
      const owned = await verifyVendorOwnedRow("vendor_portfolio", id, context.vendorId);
      if (!owned) return NextResponse.json({ error: "Forbidden: Album not found." }, { status: 403 });
      const patch: Record<string, any> = { updated_at: new Date().toISOString() };
      if (body.title !== undefined) patch.title = String(body.title).trim();
      if (body.description !== undefined) patch.description = String(body.description).trim();
      if (body.location !== undefined) patch.location = String(body.location).trim();
      if (body.eventDate !== undefined) patch.event_date = body.eventDate || null;
      if (body.coverMediaId !== undefined) patch.cover_media_id = body.coverMediaId || null;
      await supabaseFetch(
        `vendor_portfolio?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(context.vendorId)}`,
        { method: "PATCH", body: JSON.stringify(patch) }
      );
      const meta = await readVersionSection<PhotographerPortfolioMeta>(context.vendorId, "portfolio");
      const nextMeta: Record<string, any> = {};
      if (body.category !== undefined) {
        nextMeta.albumCategories = { ...(meta.albumCategories || {}), [id]: String(body.category) };
      }
      if (body.isPublic !== undefined) {
        const hiddenSet = new Set(Array.isArray(meta.hiddenAlbumIds) ? meta.hiddenAlbumIds : []);
        if (body.isPublic) hiddenSet.delete(id);
        else hiddenSet.add(id);
        nextMeta.hiddenAlbumIds = Array.from(hiddenSet);
      }
      if (Object.keys(nextMeta).length > 0) {
        await upsertVersionSection(context.vendorId, "portfolio", nextMeta, context.userId);
      }
    } else if (kind === "video") {
      const owned = await verifyVendorOwnedRow("vendor_videos", id, context.vendorId);
      if (!owned) return NextResponse.json({ error: "Forbidden: Video not found." }, { status: 403 });
      const patch: Record<string, any> = {};
      if (body.title !== undefined) patch.title = String(body.title).trim();
      if (body.videoUrl !== undefined) {
        const vUrl = String(body.videoUrl).trim();
        patch.video_url = vUrl;
        if (/youtu\.?be/i.test(vUrl)) patch.platform = "youtube";
        else if (/vimeo\.com/i.test(vUrl)) patch.platform = "vimeo";
        else if (/instagram\.com/i.test(vUrl)) patch.platform = "instagram";
      }
      if (body.thumbnailUrl !== undefined) patch.thumbnail_url = String(body.thumbnailUrl).trim() || null;
      if (Object.keys(patch).length > 0) {
        await supabaseFetch(
          `vendor_videos?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(context.vendorId)}`,
          { method: "PATCH", body: JSON.stringify(patch) }
        );
      }
      if (body.category !== undefined || body.isPublic !== undefined) {
        const meta = await readVersionSection<PhotographerPortfolioMeta>(context.vendorId, "portfolio");
        const nextMeta: Record<string, any> = {};
        if (body.category !== undefined) {
          nextMeta.videoCategories = { ...(meta.videoCategories || {}), [id]: String(body.category) };
        }
        if (body.isPublic !== undefined) {
          const hiddenSet = new Set(Array.isArray(meta.hiddenVideoIds) ? meta.hiddenVideoIds : []);
          if (body.isPublic) hiddenSet.delete(id);
          else hiddenSet.add(id);
          nextMeta.hiddenVideoIds = Array.from(hiddenSet);
        }
        await upsertVersionSection(context.vendorId, "portfolio", nextMeta, context.userId);
      }
    } else {
      const owned = await verifyVendorOwnedRow("vendor_gallery", id, context.vendorId);
      if (!owned) return NextResponse.json({ error: "Forbidden: Photo not found." }, { status: 403 });
      await updateGalleryPhotoItem(context.vendorId, context.userId, id, body);
    }

    revalidateStorefront(context.slug, context.vendorId);
    const portfolio = await listPhotographerPortfolio(context.vendorId);
    return NextResponse.json({ success: true, data: portfolio });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update portfolio item." },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  const { context, response } = await requireAuthenticatedPhotographer(req);
  if (response || !context) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));
    const id = searchParams.get("id") || String(body?.id || "");
    const kind = (searchParams.get("kind") || String(body?.kind || "photo")).toLowerCase();

    if (!id) {
      return NextResponse.json({ error: "Item id is required." }, { status: 400 });
    }

    if (kind === "album") {
      const owned = await verifyVendorOwnedRow("vendor_portfolio", id, context.vendorId);
      if (!owned) return NextResponse.json({ error: "Forbidden: Album not found." }, { status: 403 });
      await supabaseFetch(
        `vendor_portfolio?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(context.vendorId)}`,
        { method: "DELETE" }
      );
    } else if (kind === "video") {
      const owned = await verifyVendorOwnedRow("vendor_videos", id, context.vendorId);
      if (!owned) return NextResponse.json({ error: "Forbidden: Video not found." }, { status: 403 });
      await supabaseFetch(
        `vendor_videos?id=eq.${encodeURIComponent(id)}&vendor_id=eq.${encodeURIComponent(context.vendorId)}`,
        { method: "DELETE" }
      );
      await calculateAndSyncCompletion(context.vendorId);
    } else {
      const owned = await verifyVendorOwnedRow("vendor_gallery", id, context.vendorId);
      if (!owned) return NextResponse.json({ error: "Forbidden: Photo not found." }, { status: 403 });
      await deleteGalleryPhotoItem(context.vendorId, context.userId, id);
    }

    revalidateStorefront(context.slug, context.vendorId);
    const portfolio = await listPhotographerPortfolio(context.vendorId);
    return NextResponse.json({ success: true, data: portfolio });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete portfolio item." },
      { status: 400 }
    );
  }
}
