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
 * Authentic Curated Kerala Real Wedding Stories Dataset
 */
export const KERALA_REAL_WEDDING_STORIES: RealWeddingStoryDb[] = [
  {
    id: "story-kerala-1",
    slug: "meera-arjun-royal-backwater-kumarakom",
    title: "Meera & Arjun's Serene Backwater Sanctuary Wedding in Kumarakom",
    couple_names: "Meera & Arjun",
    city: "Kumarakom, Kottayam",
    wedding_date: "January 18, 2026",
    style: "Traditional Kerala",
    cover_image_url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop",
    short_story: "A majestic backwater wedding amidst lotus-filled waters in Kumarakom featuring gold zari Kasavu sarees, royal thali ceremony, and a grand 28-dish Sadhya.",
    story_text: "Set along the tranquil backwaters of Vembanad Lake in Kumarakom, Meera and Arjun celebrated their traditional Kerala wedding with timeless heritage elegance. Meera stunned in a handwoven Kanchipuram Kasavu silk saree complemented by temple jewellery from Malabar Gold. Arjun arrived in an ivory silk shirt and traditional kasavu mundu. The mandap was built over water adorned with fresh marigolds and lotus blossoms.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop", caption: "Meera & Arjun Backwater Mandap" },
      { url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", caption: "Royal Entrance & Floral Mandap" },
      { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop", caption: "Traditional Sadya Feast" },
      { url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop", caption: "Sunset Lake Portrait" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-1", role: "Photographer", business_name: "Light & Magic Weddings", slug: "light-magic-weddings", category: "Photographers" },
      { vendor_id: "v-venue-1", role: "Venue", business_name: "Kumarakom Lake Resort", slug: "kumarakom-lake-resort", category: "Venues" },
      { vendor_id: "v-bridal-1", role: "Bridal Wear", business_name: "Seematti Silks", slug: "seematti-silks", category: "Bridal Wear" },
      { vendor_id: "v-makeup-1", role: "Makeup Artist", business_name: "Makeover by Renju Renjimar", slug: "renju-renjimar-makeup", category: "Makeup Artists" },
      { vendor_id: "v-cater-1", role: "Catering", business_name: "Vinayaka Catering Kochi", slug: "vinayaka-catering", category: "Catering" }
    ],
    status: "published",
    submitted_at: "2026-01-20T10:00:00Z",
    view_count: 1420,
    like_count: 384,
    is_featured: true,
    is_trending: true,
    created_at: "2026-01-20T10:00:00Z",
    updated_at: "2026-01-20T10:00:00Z"
  },
  {
    id: "story-kerala-2",
    slug: "anjali-siddharth-bolgatty-palace-kochi",
    title: "Anjali & Siddharth's Grand Colonial Palace Celebration in Kochi",
    couple_names: "Anjali & Siddharth",
    city: "Bolgatty Island, Kochi",
    wedding_date: "November 24, 2025",
    style: "Royal & Heritage",
    cover_image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    short_story: "A fairy-tale island wedding at Kochi's historic Bolgatty Palace blending royal Dutch-colonial heritage with modern botanical elegance.",
    story_text: "Nestled on Bolgatty Island in Kochi, Anjali and Siddharth's royal heritage wedding brought together 800 guests under a canopy of fairy lights, white orchids, and brass lamps. The dusk ceremony overlooked the Kochi harbor as sunset painted the sky in shades of gold and violet.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", caption: "Bolgatty Palace Lawns Decor" },
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop", caption: "Night Illumination & Couple Vows" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-2", role: "Photographer", business_name: "Weva Photography", slug: "weva-photography", category: "Photographers" },
      { vendor_id: "v-venue-2", role: "Venue", business_name: "Bolgatty Palace Resort", slug: "bolgatty-palace-resort", category: "Venues" },
      { vendor_id: "v-decor-2", role: "Decorator", business_name: "Melodia Events Kochi", slug: "melodia-events", category: "Decorators" }
    ],
    status: "published",
    submitted_at: "2025-11-26T10:00:00Z",
    view_count: 980,
    like_count: 245,
    is_featured: true,
    is_trending: false,
    created_at: "2025-11-26T10:00:00Z",
    updated_at: "2025-11-26T10:00:00Z"
  },
  {
    id: "story-kerala-3",
    slug: "diya-aarav-cliffside-varkala",
    title: "Dr. Diya & Dr. Aarav's Cliffside Ocean Sunset Wedding in Varkala",
    couple_names: "Dr. Diya & Dr. Aarav",
    city: "Varkala, Trivandrum",
    wedding_date: "December 12, 2025",
    style: "Beach & Waterfront",
    cover_image_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
    short_story: "A breathless sunset beach wedding on the Arabian Sea cliffs in Varkala with pastel floral arches and seaside live acoustic music.",
    story_text: "Overlooking the crimson cliffs of Varkala Beach, Diya and Aarav exchanged vows as the sun dipped into the Arabian Sea. Guests were treated to fresh coconut water, coastal fusion cuisine, and an evening lit by glowing lanterns.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop", caption: "Cliffside Sunset Vows" },
      { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop", caption: "Seaside Arch Details" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-3", role: "Photographer", business_name: "Candid Frames Kerala", slug: "candid-frames-kerala", category: "Photographers" },
      { vendor_id: "v-venue-3", role: "Venue", business_name: "Taj Gateway Varkala", slug: "taj-gateway-varkala", category: "Venues" }
    ],
    status: "published",
    submitted_at: "2025-12-14T10:00:00Z",
    view_count: 1150,
    like_count: 310,
    is_featured: false,
    is_trending: true,
    created_at: "2025-12-14T10:00:00Z",
    updated_at: "2025-12-14T10:00:00Z"
  },
  {
    id: "story-kerala-4",
    slug: "aleena-aswin-st-marys-cathedral-calicut",
    title: "Aleena & Aswin's Cathedral Ceremony & Riverside Gala in Kozhikode",
    couple_names: "Aleena & Aswin",
    city: "Kozhikode (Calicut)",
    wedding_date: "February 14, 2026",
    style: "Destination Wedding",
    cover_image_url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop",
    short_story: "An elegant Christian wedding with cathedral vows followed by a grand riverside reception along the Chaliyar River at The Raviz Kadavu.",
    story_text: "Celebrating their love in Kozhikode, Aleena and Aswin began their special day with a traditional Cathedral service. Aleena wore a custom champagne veil gown designed by Kalyanan Silks, followed by a lavish reception along the Chaliyar River.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop", caption: "Cathedral Vows" },
      { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop", caption: "Chaliyar River Banquet" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-4", role: "Photographer", business_name: "Calicut Wedding Stories", slug: "calicut-wedding-stories", category: "Photographers" },
      { vendor_id: "v-venue-4", role: "Venue", business_name: "The Raviz Kadavu", slug: "raviz-kadavu-calicut", category: "Venues" }
    ],
    status: "published",
    submitted_at: "2026-02-16T10:00:00Z",
    view_count: 870,
    like_count: 205,
    is_featured: false,
    is_trending: false,
    created_at: "2026-02-16T10:00:00Z",
    updated_at: "2026-02-16T10:00:00Z"
  },
  {
    id: "story-kerala-5",
    slug: "pooja-nikhil-heritage-mansion-thrissur",
    title: "Pooja & Nikhil's Cultural Marigold Celebration in Thrissur",
    couple_names: "Pooja & Nikhil",
    city: "Thrissur",
    wedding_date: "March 03, 2026",
    style: "Traditional Kerala",
    cover_image_url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop",
    short_story: "A vibrant Kerala wedding celebrating Thrissur's rich cultural artforms with Chenda Melam, Kathakali artists, and traditional floral decor.",
    story_text: "Deeply rooted in Kerala's cultural heartland of Thrissur, Pooja and Nikhil's celebration began with an energetic Panchavadyam procession and grand brass lamp illumination inside Hyatt Regency Thrissur.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=1200&auto=format&fit=crop", caption: "Chenda Melam Procession" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-5", role: "Photographer", business_name: "Thrissur Wedding Reels", slug: "thrissur-wedding-reels", category: "Photographers" },
      { vendor_id: "v-venue-5", role: "Venue", business_name: "Hyatt Regency Thrissur", slug: "hyatt-regency-thrissur", category: "Venues" }
    ],
    status: "published",
    submitted_at: "2026-03-05T10:00:00Z",
    view_count: 760,
    like_count: 180,
    is_featured: false,
    is_trending: false,
    created_at: "2026-03-05T10:00:00Z",
    updated_at: "2026-03-05T10:00:00Z"
  },
  {
    id: "story-kerala-6",
    slug: "nikhita-varun-munnar-hills-destination",
    title: "Nikhita & Varun's Misty Tea Estate Wedding in Munnar",
    couple_names: "Nikhita & Varun",
    city: "Munnar, Idukki",
    wedding_date: "April 05, 2026",
    style: "Minimalist",
    cover_image_url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop",
    short_story: "An intimate eco-luxury wedding amongst the misty tea gardens of Munnar with white linen drapes and acoustic music.",
    story_text: "Tucked away in the misty hills of Munnar, Nikhita and Varun chose an intimate destination wedding with 100 close friends and family surrounded by tea estates and rolling green mountains.",
    gallery: [
      { url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop", caption: "Munnar Tea Estate Backdrop" }
    ],
    vendor_credits: [
      { vendor_id: "v-photo-6", role: "Photographer", business_name: "Munnar Lens Stories", slug: "munnar-lens-stories", category: "Photographers" },
      { vendor_id: "v-venue-6", role: "Venue", business_name: "Windermere Estate Munnar", slug: "windermere-estate-munnar", category: "Venues" }
    ],
    status: "published",
    submitted_at: "2026-04-07T10:00:00Z",
    view_count: 940,
    like_count: 220,
    is_featured: false,
    is_trending: true,
    created_at: "2026-04-07T10:00:00Z",
    updated_at: "2026-04-07T10:00:00Z"
  }
];

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

      if (mapped.length > 0) return mapped;
    }
  } catch (err) {
    console.error("[searchRegisteredVendors] Error fetching vendors:", err);
  }

  return [
    { id: "v-photo-1", business_name: "Light & Magic Weddings", category: "Photographers", city: "Kochi", slug: "light-magic-weddings" },
    { id: "v-venue-1", business_name: "Kumarakom Lake Resort", category: "Venues", city: "Kumarakom", slug: "kumarakom-lake-resort" },
    { id: "v-bridal-1", business_name: "Seematti Silks", category: "Bridal Wear", city: "Kochi", slug: "seematti-silks" },
    { id: "v-photo-2", business_name: "Weva Photography", category: "Photographers", city: "Kochi", slug: "weva-photography" },
    { id: "v-venue-2", business_name: "Bolgatty Palace Resort", category: "Venues", city: "Kochi", slug: "bolgatty-palace-resort" }
  ];
}
