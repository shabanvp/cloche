import { dbQuery } from "./db";
import { supabaseFetch } from "./supabase";

export * from "./realWeddingsData";
import { 
  RealWeddingStoryDb, 
  GalleryPhotoItem, 
  VendorCreditItem, 
  StorySubmissionPayload, 
  KERALA_REAL_WEDDING_STORIES,
  generateStorySlug 
} from "./realWeddingsData";

function parseStoryRow(row: any): RealWeddingStoryDb {
  let gallery: GalleryPhotoItem[] = [];
  if (Array.isArray(row.gallery)) {
    gallery = row.gallery;
  } else if (typeof row.gallery === "string") {
    try { gallery = JSON.parse(row.gallery); } catch (_) {}
  }

  let vendor_credits: VendorCreditItem[] = [];
  if (Array.isArray(row.vendor_credits)) {
    vendor_credits = row.vendor_credits;
  } else if (typeof row.vendor_credits === "string") {
    try { vendor_credits = JSON.parse(row.vendor_credits); } catch (_) {}
  }

  return {
    ...row,
    gallery: Array.isArray(gallery) ? gallery : [],
    vendor_credits: Array.isArray(vendor_credits) ? vendor_credits : [],
  };
}

/**
 * Fetch published real wedding stories with automatic Kerala fallback
 */
export async function getPublishedStories(options?: {
  style?: string;
  search?: string;
  sortBy?: "newest" | "popular" | "views";
  limit?: number;
  offset?: number;
}): Promise<{ stories: RealWeddingStoryDb[]; total: number }> {
  const { style, search, sortBy = "newest", limit = 20, offset = 0 } = options || {};

  try {
    const conditions: string[] = ["status = 'published'"];
    const params: any[] = [];
    let paramIdx = 1;

    if (style && style !== "All") {
      conditions.push(`style = $${paramIdx++}`);
      params.push(style);
    }

    if (search && search.trim()) {
      const q = `%${search.trim().toLowerCase()}%`;
      conditions.push(
        `(LOWER(title) LIKE $${paramIdx} OR LOWER(COALESCE(couple_names, '')) LIKE $${paramIdx} OR LOWER(COALESCE(city, '')) LIKE $${paramIdx} OR LOWER(story_text) LIKE $${paramIdx})`
      );
      params.push(q);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let orderBy = "created_at DESC";
    if (sortBy === "popular") {
      orderBy = "like_count DESC, created_at DESC";
    } else if (sortBy === "views") {
      orderBy = "view_count DESC, created_at DESC";
    }

    const countSql = `SELECT COUNT(*) as total FROM real_wedding_stories ${whereClause};`;
    const countRes = await dbQuery(countSql, params).catch(() => ({ rows: [] }));
    const total = parseInt(countRes.rows[0]?.total || "0", 10);

    if (total > 0) {
      const dataSql = `
        SELECT * FROM real_wedding_stories
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${paramIdx++} OFFSET $${paramIdx++};
      `;
      params.push(limit, offset);

      const res = await dbQuery<RealWeddingStoryDb>(dataSql, params).catch(() => ({ rows: [] }));
      if (res.rows.length > 0) {
        return {
          stories: res.rows.map(parseStoryRow),
          total,
        };
      }
    }
  } catch (err) {
    console.warn("[getPublishedStories] DB query failed, falling back to curated Kerala dataset:", err);
  }

  // Fallback to Curated Kerala Dataset
  let filtered = [...KERALA_REAL_WEDDING_STORIES];

  if (style && style !== "All") {
    filtered = filtered.filter((s) => s.style.toLowerCase() === style.toLowerCase());
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.couple_names && s.couple_names.toLowerCase().includes(q)) ||
        (s.city && s.city.toLowerCase().includes(q)) ||
        s.story_text.toLowerCase().includes(q)
    );
  }

  if (sortBy === "popular") {
    filtered.sort((a, b) => b.like_count - a.like_count);
  } else if (sortBy === "views") {
    filtered.sort((a, b) => b.view_count - a.view_count);
  }

  const paginated = filtered.slice(offset, offset + limit);

  return {
    stories: paginated,
    total: filtered.length,
  };
}

/**
 * Fetch a single story by slug
 */
export async function getStoryBySlug(slug: string): Promise<RealWeddingStoryDb | null> {
  try {
    const sql = `SELECT * FROM real_wedding_stories WHERE slug = $1 LIMIT 1;`;
    const res = await dbQuery<RealWeddingStoryDb>(sql, [slug]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      return parseStoryRow(res.rows[0]);
    }
  } catch (_) {}

  // Fallback to Curated Dataset
  const fallback = KERALA_REAL_WEDDING_STORIES.find((s) => s.slug === slug || s.id === slug);
  return fallback || null;
}

/**
 * Increment view count honestly on single view
 */
export async function incrementStoryViewCount(slugOrId: string): Promise<number> {
  try {
    const sql = `
      UPDATE real_wedding_stories
      SET view_count = view_count + 1
      WHERE slug = $1 OR id::text = $1
      RETURNING view_count;
    `;
    const res = await dbQuery(sql, [slugOrId]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) return res.rows[0]?.view_count ?? 0;
  } catch (_) {}

  const fallback = KERALA_REAL_WEDDING_STORIES.find((s) => s.slug === slugOrId || s.id === slugOrId);
  return fallback ? fallback.view_count + 1 : 1;
}

/**
 * Toggle real story like count
 */
export async function toggleStoryLike(slugOrId: string, increment: boolean): Promise<number> {
  try {
    const sql = `
      UPDATE real_wedding_stories
      SET like_count = GREATEST(0, like_count + ${increment ? 1 : -1})
      WHERE slug = $1 OR id::text = $1
      RETURNING like_count;
    `;
    const res = await dbQuery(sql, [slugOrId]).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) return res.rows[0]?.like_count ?? 0;
  } catch (_) {}

  const fallback = KERALA_REAL_WEDDING_STORIES.find((s) => s.slug === slugOrId || s.id === slugOrId);
  return fallback ? fallback.like_count + (increment ? 1 : -1) : 1;
}

/**
 * Insert a new story submission with status 'pending_review'
 */
export async function createStorySubmission(
  payload: StorySubmissionPayload
): Promise<RealWeddingStoryDb> {
  const slug = generateStorySlug(payload.title);
  const galleryFormatted = (payload.gallery || []).map((item) =>
    typeof item === "string" ? { url: item, caption: "" } : item
  );

  const sql = `
    INSERT INTO real_wedding_stories (
      slug, title, couple_names, city, wedding_date, style,
      cover_image_url, gallery, story_text, short_story, vendor_credits,
      status, submitted_by, submitter_name, submitter_email,
      view_count, like_count, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'pending_review', $12, $13, $14, 0, 0, NOW(), NOW())
    RETURNING *;
  `;

  const params = [
    slug,
    payload.title.trim(),
    payload.couple_names?.trim() || null,
    payload.city?.trim() || null,
    payload.wedding_date?.trim() || null,
    payload.style?.trim() || "Traditional Kerala",
    payload.cover_image_url.trim(),
    JSON.stringify(galleryFormatted),
    payload.story_text.trim(),
    payload.short_story?.trim() || null,
    JSON.stringify(payload.vendor_credits || []),
    payload.submitted_by || null,
    payload.submitter_name || null,
    payload.submitter_email || null,
  ];

  try {
    const res = await dbQuery<RealWeddingStoryDb>(sql, params);
    if (res.rows.length > 0) return parseStoryRow(res.rows[0]);
  } catch (err) {
    console.error("[createStorySubmission] DB insert failed:", err);
  }

  // Return formatted mock row if DB offline
  return {
    id: `submission-${Date.now()}`,
    slug,
    title: payload.title,
    couple_names: payload.couple_names || null,
    city: payload.city || null,
    wedding_date: payload.wedding_date || null,
    style: payload.style || "Traditional Kerala",
    cover_image_url: payload.cover_image_url,
    gallery: galleryFormatted,
    story_text: payload.story_text,
    short_story: payload.short_story || null,
    vendor_credits: payload.vendor_credits || [],
    status: "pending_review",
    submitted_by: payload.submitted_by || null,
    submitter_name: payload.submitter_name || null,
    submitter_email: payload.submitter_email || null,
    submitted_at: new Date().toISOString(),
    view_count: 0,
    like_count: 0,
    is_featured: false,
    is_trending: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Fetch all story submissions for admin review
 */
export async function getAdminSubmissions(
  options?: { status?: string; limit?: number; offset?: number }
): Promise<{ stories: RealWeddingStoryDb[]; total: number }> {
  const { status, limit = 20, offset = 0 } = options || {};
  try {
    const sql = status && status !== "all"
      ? `SELECT * FROM real_wedding_stories WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3;`
      : `SELECT * FROM real_wedding_stories ORDER BY created_at DESC LIMIT $1 OFFSET $2;`;
    const params = status && status !== "all" ? [status, limit, offset] : [limit, offset];
    const res = await dbQuery<RealWeddingStoryDb>(sql, params).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      return {
        stories: res.rows.map(parseStoryRow),
        total: res.rows.length,
      };
    }
  } catch (_) {}

  let filtered = [...KERALA_REAL_WEDDING_STORIES];
  if (status && status !== "all") {
    filtered = filtered.filter((s) => s.status === status);
  }

  return {
    stories: filtered.slice(offset, offset + limit),
    total: filtered.length,
  };
}

/**
 * Admin update story status (published / rejected)
 */
export async function updateAdminStoryStatus(
  id: string,
  updateData: { status?: any; rejection_reason?: any; is_featured?: any; is_trending?: any }
): Promise<{ success: boolean; status?: string }> {
  try {
    const fields: string[] = ["updated_at = NOW()"];
    const params: any[] = [];
    let idx = 1;

    if (updateData.status) {
      fields.push(`status = $${idx++}`);
      params.push(updateData.status);
    }
    if (updateData.rejection_reason !== undefined) {
      fields.push(`rejection_reason = $${idx++}`);
      params.push(updateData.rejection_reason);
    }
    if (updateData.is_featured !== undefined) {
      fields.push(`is_featured = $${idx++}`);
      params.push(updateData.is_featured);
    }
    if (updateData.is_trending !== undefined) {
      fields.push(`is_trending = $${idx++}`);
      params.push(updateData.is_trending);
    }

    params.push(id);
    const sql = `
      UPDATE real_wedding_stories
      SET ${fields.join(", ")}
      WHERE id::text = $${idx} OR slug = $${idx}
      RETURNING *;
    `;
    const res = await dbQuery(sql, params).catch(() => ({ rows: [] }));
    if (res.rows.length > 0) {
      return { success: true, status: res.rows[0].status };
    }
  } catch (_) {}

  return { success: true, status: updateData.status || "published" };
}

/**
 * Admin delete story
 */
export async function deleteAdminStory(id: string): Promise<boolean> {
  try {
    const sql = `DELETE FROM real_wedding_stories WHERE id::text = $1 OR slug = $1;`;
    await dbQuery(sql, [id]);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Search registered vendors from database for vendor credits dropdown
 */
export async function searchRegisteredVendors(
  searchQuery: string
): Promise<
  Array<{
    id: string;
    business_name: string;
    category: string;
    city: string;
    slug: string;
  }>
> {
  try {
    const q = (searchQuery || "").trim().toLowerCase();
    
    // First try Supabase REST
    const res = await supabaseFetch(
      `vendors?select=id,vendor_code,vendor_profiles(business_name,slug,city),vendor_categories(name,slug)&status=eq.active&deleted_at=is.null&limit=30`
    );

    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      const mapped = res.data
        .map((v: any) => {
          const profile = v.vendor_profiles || {};
          const cat = v.vendor_categories || {};
          const name = profile.business_name || v.vendor_code || "Unnamed Vendor";
          return {
            id: v.id,
            business_name: name,
            category: cat.name || "Vendor",
            city: profile.city || "Kerala",
            slug: profile.slug || v.id,
          };
        })
        .filter((v: any) => {
          if (!q) return true;
          return (
            v.business_name.toLowerCase().includes(q) ||
            v.category.toLowerCase().includes(q) ||
            v.city.toLowerCase().includes(q)
          );
        });

      return mapped;
    }
  } catch (err) {
    console.error("[searchRegisteredVendors] Error fetching vendors:", err);
  }

  return [];
}
