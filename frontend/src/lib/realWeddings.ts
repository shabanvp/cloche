import { dbQuery } from "./db";
import { supabaseFetch } from "./supabase";

export interface VendorCreditItem {
  vendor_id: string;
  role: string;
  business_name?: string;
  slug?: string;
  category?: string;
}

export interface GalleryPhotoItem {
  url: string;
  caption?: string;
  category?: string;
}

export interface RealWeddingStoryDb {
  id: string;
  slug: string;
  title: string;
  couple_names: string | null;
  city: string | null;
  wedding_date: string | null;
  style: string;
  cover_image_url: string;
  gallery: GalleryPhotoItem[];
  story_text: string;
  short_story: string | null;
  vendor_credits: VendorCreditItem[];
  status: "pending_review" | "published" | "rejected";
  rejection_reason?: string | null;
  submitted_by?: string | null;
  submitter_name?: string | null;
  submitter_email?: string | null;
  submitted_at: string;
  view_count: number;
  like_count: number;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
}

export interface StorySubmissionPayload {
  title: string;
  couple_names?: string;
  city?: string;
  wedding_date?: string;
  style?: string;
  cover_image_url: string;
  gallery?: (string | GalleryPhotoItem)[];
  story_text: string;
  short_story?: string;
  vendor_credits?: VendorCreditItem[];
  submitted_by?: string;
  submitter_name?: string;
  submitter_email?: string;
}

/**
 * Generate a clean, unique URL slug from a title and timestamp
 */
export function generateStorySlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${base || "wedding"}-${randomSuffix}`;
}

/**
 * Fetch published real wedding stories for public display
 */
export async function getPublishedStories(options?: {
  style?: string;
  search?: string;
  sortBy?: "newest" | "popular" | "views";
  limit?: number;
  offset?: number;
}): Promise<{ stories: RealWeddingStoryDb[]; total: number }> {
  const { style, search, sortBy = "newest", limit = 20, offset = 0 } = options || {};

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
  const countRes = await dbQuery(countSql, params);
  const total = parseInt(countRes.rows[0]?.total || "0", 10);

  const dataSql = `
    SELECT * FROM real_wedding_stories
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT $${paramIdx++} OFFSET $${paramIdx++};
  `;
  params.push(limit, offset);

  const res = await dbQuery<RealWeddingStoryDb>(dataSql, params);
  return {
    stories: res.rows.map(parseStoryRow),
    total,
  };
}

/**
 * Fetch a single story by slug
 */
export async function getStoryBySlug(slug: string): Promise<RealWeddingStoryDb | null> {
  const sql = `SELECT * FROM real_wedding_stories WHERE slug = $1 LIMIT 1;`;
  const res = await dbQuery<RealWeddingStoryDb>(sql, [slug]);
  if (res.rows.length === 0) return null;
  return parseStoryRow(res.rows[0]);
}

/**
 * Increment view count honestly on single view
 */
export async function incrementStoryViewCount(slugOrId: string): Promise<number> {
  const sql = `
    UPDATE real_wedding_stories
    SET view_count = view_count + 1
    WHERE slug = $1 OR id::text = $1
    RETURNING view_count;
  `;
  const res = await dbQuery(sql, [slugOrId]);
  return res.rows[0]?.view_count ?? 0;
}

/**
 * Toggle real story like count
 */
export async function toggleStoryLike(slugOrId: string, increment: boolean): Promise<number> {
  const sql = `
    UPDATE real_wedding_stories
    SET like_count = GREATEST(0, like_count + ${increment ? 1 : -1})
    WHERE slug = $1 OR id::text = $1
    RETURNING like_count;
  `;
  const res = await dbQuery(sql, [slugOrId]);
  return res.rows[0]?.like_count ?? 0;
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
    payload.short_story?.trim() || payload.story_text.trim().slice(0, 160) + "...",
    JSON.stringify(payload.vendor_credits || []),
    payload.submitted_by || null,
    payload.submitter_name?.trim() || null,
    payload.submitter_email?.trim() || null,
  ];

  const res = await dbQuery<RealWeddingStoryDb>(sql, params);
  return parseStoryRow(res.rows[0]);
}

/**
 * Admin: Fetch all submissions with filtering
 */
export async function getAdminSubmissions(options?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<{ stories: RealWeddingStoryDb[]; total: number }> {
  const { status, limit = 50, offset = 0 } = options || {};

  const conditions: string[] = [];
  const params: any[] = [];
  let paramIdx = 1;

  if (status && status !== "all") {
    conditions.push(`status = $${paramIdx++}`);
    params.push(status);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countSql = `SELECT COUNT(*) as total FROM real_wedding_stories ${whereClause};`;
  const countRes = await dbQuery(countSql, params);
  const total = parseInt(countRes.rows[0]?.total || "0", 10);

  const dataSql = `
    SELECT * FROM real_wedding_stories
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIdx++} OFFSET $${paramIdx++};
  `;
  params.push(limit, offset);

  const res = await dbQuery<RealWeddingStoryDb>(dataSql, params);
  return {
    stories: res.rows.map(parseStoryRow),
    total,
  };
}

/**
 * Admin: Update story review status (approve/reject/feature)
 */
export async function updateAdminStoryStatus(
  id: string,
  update: {
    status?: "pending_review" | "published" | "rejected";
    rejection_reason?: string;
    is_featured?: boolean;
    is_trending?: boolean;
  }
): Promise<RealWeddingStoryDb | null> {
  const sets: string[] = ["updated_at = NOW()"];
  const params: any[] = [id];
  let paramIdx = 2;

  if (update.status) {
    sets.push(`status = $${paramIdx++}`);
    params.push(update.status);
  }
  if (update.rejection_reason !== undefined) {
    sets.push(`rejection_reason = $${paramIdx++}`);
    params.push(update.rejection_reason);
  }
  if (update.is_featured !== undefined) {
    sets.push(`is_featured = $${paramIdx++}`);
    params.push(update.is_featured);
  }
  if (update.is_trending !== undefined) {
    sets.push(`is_trending = $${paramIdx++}`);
    params.push(update.is_trending);
  }

  const sql = `
    UPDATE real_wedding_stories
    SET ${sets.join(", ")}
    WHERE id = $1
    RETURNING *;
  `;

  const res = await dbQuery<RealWeddingStoryDb>(sql, params);
  if (res.rows.length === 0) return null;
  return parseStoryRow(res.rows[0]);
}

/**
 * Admin: Delete a story
 */
export async function deleteAdminStory(id: string): Promise<boolean> {
  const sql = `DELETE FROM real_wedding_stories WHERE id = $1;`;
  const res = await dbQuery(sql, [id]);
  return (res.rowCount ?? 0) > 0;
}

/**
 * Helper to parse JSON fields from db rows
 */
function parseStoryRow(row: any): RealWeddingStoryDb {
  return {
    ...row,
    gallery: typeof row.gallery === "string" ? JSON.parse(row.gallery) : row.gallery || [],
    vendor_credits:
      typeof row.vendor_credits === "string"
        ? JSON.parse(row.vendor_credits)
        : row.vendor_credits || [],
    view_count: Number(row.view_count || 0),
    like_count: Number(row.like_count || 0),
    is_featured: Boolean(row.is_featured),
    is_trending: Boolean(row.is_trending),
  };
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
      `vendors?select=id,vendor_code,vendor_profiles(business_name,slug,city),vendor_categories(name,slug)&status=eq.active&publication_status=eq.published&limit=30`
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

      if (mapped.length > 0) return mapped.slice(0, 15);
    }

    // Fallback to boutiques endpoint in Supabase
    const bRes = await supabaseFetch(`boutiques?select=id,name,boutique_name,category,city,slug&limit=30`);
    if (bRes.data && Array.isArray(bRes.data)) {
      return bRes.data
        .map((b: any) => ({
          id: b.id,
          business_name: b.boutique_name || b.name || "Boutique",
          category: b.category || "Bridal Wear",
          city: b.city || "Kerala",
          slug: b.slug || b.id,
        }))
        .filter((b: any) => {
          if (!q) return true;
          return (
            b.business_name.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q) ||
            b.city.toLowerCase().includes(q)
          );
        })
        .slice(0, 15);
    }
  } catch (err) {
    console.error("[searchRegisteredVendors] Error fetching vendors:", err);
  }

  return [];
}
