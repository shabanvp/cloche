const supabase = require("../supabase");
const { PLANS } = require("../services/planService");

const normalizeTags = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const tags = raw
        .split(",")
        .map((t) => String(t || "").trim())
        .filter(Boolean);

    if (!tags.length) return "";

    return tags.join(", ");
};

const normalizeText = (value) => String(value || "")
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const locationAliases = {
    perumbavoor: ["perumbavoor", "perumbavur"],
    perumbavur: ["perumbavoor", "perumbavur"],
    kochi: ["kochi", "cochin", "ernakulam"],
    cochin: ["kochi", "cochin", "ernakulam"],
    edappally: ["edappally", "edapally"],
    edapally: ["edappally", "edapally"],
    trivandrum: ["trivandrum", "thiruvananthapuram"],
    thiruvananthapuram: ["trivandrum", "thiruvananthapuram"]
};

const getLocationVariants = (value) => {
    const normalized = normalizeText(value);
    if (!normalized) return [];
    return locationAliases[normalized] || [normalized];
};

const levenshteinDistance = (a, b) => {
    const left = normalizeText(a);
    const right = normalizeText(b);
    if (left === right) return 0;
    if (!left) return right.length;
    if (!right) return left.length;

    const previous = Array.from({ length: right.length + 1 }, (_, i) => i);
    const current = Array(right.length + 1).fill(0);

    for (let i = 1; i <= left.length; i += 1) {
        current[0] = i;
        for (let j = 1; j <= right.length; j += 1) {
            const cost = left[i - 1] === right[j - 1] ? 0 : 1;
            current[j] = Math.min(
                current[j - 1] + 1,
                previous[j] + 1,
                previous[j - 1] + cost
            );
        }
        for (let j = 0; j <= right.length; j += 1) previous[j] = current[j];
    }

    return previous[right.length];
};

const fuzzyMatch = (source, query) => {
    const sourceText = normalizeText(source);
    const queryText = normalizeText(query);
    if (!sourceText || !queryText || queryText.length < 4) return false;

    const allowedDistance = queryText.length <= 6 ? 1 : 2;
    const sourceWords = sourceText.split(/[\s,/-]+/).filter(Boolean);
    const queryWords = queryText.split(/[\s,/-]+/).filter(Boolean);

    return queryWords.some((queryWord) =>
        sourceWords.some((sourceWord) => {
            if (sourceWord.length < 4) return false;
            return levenshteinDistance(sourceWord, queryWord) <= allowedDistance;
        })
    );
};

const locationMatches = (source, query) => {
    const sourceText = normalizeText(source);
    const queryText = normalizeText(query);
    if (!queryText) return true;
    const sourceVariants = [sourceText, ...getLocationVariants(sourceText)].filter(Boolean);
    const queryVariants = getLocationVariants(queryText);
    return queryVariants.some((q) =>
        sourceVariants.some((s) => s.includes(q) || q.includes(s) || fuzzyMatch(s, q))
    );
};

const normalizeImageUrl = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw) || /^data:image\//i.test(raw)) return raw;

    const cloudName = String(process.env.CLOUDINARY_CLOUD_NAME || "dycwsnzyd").trim();
    if (raw.includes("uploads/") || raw.startsWith("/uploads/")) return raw;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${raw.replace(/^\/+/, "")}`;
};

/**
 * Get all boutiques with ranking logic
 * Ranking: Premium > Professional > Early
 */
exports.getAllBoutiques = async (req, res) => {
    const city = normalizeText(req.query.city);
    const limit = parseInt(req.query.limit) || 100;

    try {
        // Fetch boutiques. We first try with the advanced ranking columns.
        // If these columns don't exist yet, it will throw a PostgreSQL error (500).
        // We'll catch that and retry with a simpler query.
        let boutiques = [];
        
        try {
            const { data, error } = await supabase
                .from("boutiques")
                .select("id, boutique_name, owner_name, email, phone, city, category, is_verified, created_at, plan, is_featured, priority_score, logo_url, cover_url, image_url")
                .order("is_featured", { ascending: false })
                .order("priority_score", { ascending: false })
                .order("boutique_name", { ascending: true });
                
            if (error) throw error;
            boutiques = data || [];
        } catch (dbErr) {
            console.warn("[BoutiqueController] Advanced ranking failed, falling back to basic sort:", dbErr.message);
            const { data, error } = await supabase
                .from("boutiques")
                .select("id, boutique_name, owner_name, email, phone, city, category, is_verified, created_at, plan, logo_url, cover_url, image_url")
                .order("boutique_name", { ascending: true });
                
            if (error) return res.status(500).json({ message: "Database error", error: error.message });
            boutiques = data || [];
        }

        // Fetch showcase data for images/location/tags.
        const boutiqueIds = (boutiques || []).map(b => b?.id).filter(Boolean);
        let showcases = [];

        if (boutiqueIds.length) {
            try {
                const { data, error } = await supabase
                    .from("boutique_showcase")
                    .select("id, boutique_id, district, area, shop_location, tags, image_url, rating, updated_at")
                    .in("boutique_id", boutiqueIds)
                    .order("updated_at", { ascending: false, nullsFirst: false })
                    .order("id", { ascending: false });

                if (error) throw error;
                showcases = Array.isArray(data) ? data : [];
            } catch (e1) {
                try {
                    const { data, error } = await supabase
                        .from("boutique_showcase")
                        .select("id, boutique_id, district, area, tags, image_url, rating")
                        .in("boutique_id", boutiqueIds)
                        .order("id", { ascending: false });

                    if (error) throw error;
                    showcases = Array.isArray(data) ? data : [];
                } catch (e2) {
                    try {
                        const { data, error } = await supabase
                            .from("boutique_showcase")
                            .select("boutique_id, district, area, tags, image_url, rating")
                            .in("boutique_id", boutiqueIds);

                        if (error) throw error;
                        showcases = Array.isArray(data) ? data : [];
                    } catch (e3) {
                        showcases = [];
                    }
                }
            }
        }

        const showcaseMap = {};
        for (const row of showcases) {
            if (!row || !row.boutique_id) continue;
            if (showcaseMap[row.boutique_id]) continue;
            
            const { id: _showcaseId, ...rest } = row;
            showcaseMap[row.boutique_id] = {
                ...rest,
                tags: normalizeTags(row.tags)
            };
        }

        // 🔹 Final Ranking Logic (Premium > Professional > Early)
        const normalizePlan = (plan) => {
            const normalized = String(plan || "").trim().toLowerCase();
            if (["early", "basic", "early partner", "early_partner"].includes(normalized)) return "early_partner";
            if (normalized === "pro") return "premium";
            return normalized;
        };
        const planWeight = { premium: 3, professional: 2, early_partner: 1 };
        
        // 🔹 Merge boutique data with showcase data safely
        const result = (boutiques || [])
            .filter(b => b && (b.is_verified === true || b.is_verified === "true" || b.is_verified === 1 || b.is_verified === "1"))
            .map(b => {
                const logoPic = b.logo_url || b.logo || b.profile_logo || b.image_url || showcaseMap[b.id]?.image_url || b.cover_url || "";
                const imagePic = showcaseMap[b.id]?.image_url || b.cover_url || b.image_url || b.logo_url || b.logo || "";
                return {
                    ...b,
                    ...(showcaseMap[b.id] || {}),
                    logo_url: normalizeImageUrl(logoPic),
                    profile_logo: normalizeImageUrl(logoPic),
                    logo: normalizeImageUrl(logoPic),
                    image_url: normalizeImageUrl(imagePic),
                    cover_url: normalizeImageUrl(b.cover_url || showcaseMap[b.id]?.image_url || "")
                };
            });

        const sortedResult = result.sort((a, b) => {
            // 1. Featured first
            if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1;
            
            // 2. Plan tier
            if (normalizePlan(a.plan) === "premium" && normalizePlan(b.plan) !== "premium") return -1;
            if (normalizePlan(b.plan) === "premium" && normalizePlan(a.plan) !== "premium") return 1;

            const weightA = planWeight[normalizePlan(a.plan)] || 0;
            const weightB = planWeight[normalizePlan(b.plan)] || 0;
            if (weightA !== weightB) return weightB - weightA;
            
            // 3. Score
            if (a.priority_score !== b.priority_score) return (b.priority_score || 0) - (a.priority_score || 0);

            // 4. Rating
            if (a.rating !== b.rating) return (b.rating || 0) - (a.rating || 0);
            
            // 5. Alphabetical (Safe localeCompare)
            const nameA = String(a?.boutique_name || "");
            const nameB = String(b?.boutique_name || "");
            return nameA.localeCompare(nameB);
        });

        // Filter by city if provided
        let filtered = city 
            ? sortedResult.filter(b => 
                locationMatches(b.city, city) ||
                locationMatches(b.district, city) ||
                locationMatches(b.area, city)
              )
            : sortedResult;

        return res.json(filtered.slice(0, limit));
    } catch (err) {
        console.error("[BoutiqueController] Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.searchBoutiques = async (req, res) => {
    try {
        const { keyword, district, category, verified, plan, page = 1, limit = 20 } = req.query;
        
        let query = supabase.from("boutique_showcase").select("*, boutiques!inner(id, boutique_name, owner_name, city, plan, category)", { count: "exact" });

        // Keyword search
        if (keyword) {
            const { data: bData } = await supabase.from('boutiques')
                .select('id')
                .or(`boutique_name.ilike.%${keyword}%,city.ilike.%${keyword}%`);
            
            const bIds = (bData || []).map(b => b.id);
            
            if (bIds.length > 0) {
                query = query.or(`boutique_id.in.(${bIds.join(',')}),tags.ilike.%${keyword}%,area.ilike.%${keyword}%`);
            } else {
                query = query.or(`tags.ilike.%${keyword}%,area.ilike.%${keyword}%`);
            }
        }

        // District filter
        if (district && district !== "all") {
            query = query.ilike("district", `%${district}%`);
        }

        // Category / tags filter
        if (category && category !== "all") {
            query = query.or(`tags.ilike.%${category}%,boutiques.category.ilike.%${category}%`);
        }

        // Plan / verified filter
        if (verified === 'true') {
            query = query.in("boutiques.plan", ["professional", "premium"]);
        }

        // Pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to).order('rating', { ascending: false });

        const { data, count, error } = await query;
        if (error) throw error;

        const flattened = (data || []).map(row => ({
            id: row.boutiques?.id || row.boutique_id,
            boutique_name: row.boutiques?.boutique_name || "",
            owner_name: row.boutiques?.owner_name || "",
            city: row.boutiques?.city || "",
            plan: row.boutiques?.plan || "",
            category: row.boutiques?.category || row.tags || "",
            district: row.district || "",
            area: row.area || "",
            tags: normalizeTags(row.tags),
            image_url: normalizeImageUrl(row.image_url),
            rating: row.rating || 0
        }));

        return res.json({
            success: true,
            data: flattened,
            pagination: {
                total: count || 0,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil((count || 0) / limit)
            }
        });

    } catch (err) {
        console.error("[BoutiqueController Search] Error:", err.message);
        return res.status(500).json({ success: false, message: "Search error", error: err.message });
    }
};

exports.getBoutiqueDetails = async (req, res) => {
    const { boutiqueId } = req.params;
    try {
        const { data: boutique, error } = await supabase
            .from("boutiques")
            .select("*")
            .eq("id", boutiqueId)
            .maybeSingle();

        if (error || !boutique) return res.status(404).json({ message: "Boutique not found" });

        let showcase = null;
        try {
            const { data, error: scErr } = await supabase
                .from("boutique_showcase")
                .select("*")
                .eq("boutique_id", boutiqueId)
                .order("updated_at", { ascending: false, nullsFirst: false })
                .order("id", { ascending: false })
                .limit(1);

            if (!scErr && Array.isArray(data) && data.length) showcase = data[0];
        } catch (_) { }

        if (!showcase) {
            try {
                const { data, error: scErr2 } = await supabase
                    .from("boutique_showcase")
                    .select("*")
                    .eq("boutique_id", boutiqueId)
                    .order("id", { ascending: false })
                    .limit(1);

                if (!scErr2 && Array.isArray(data) && data.length) showcase = data[0];
            } catch (_) { }
        }

        const logoPic = boutique?.logo_url || boutique?.logo || boutique?.profile_logo || boutique?.image_url || showcase?.image_url || boutique?.cover_url || "";
        const imagePic = showcase?.image_url || boutique?.image_url || boutique?.cover_url || boutique?.logo_url || "";

        return res.json({
            ...boutique,
            tags: normalizeTags(showcase?.tags),
            district: showcase?.district || "",
            area: showcase?.area || "",
            shop_location: showcase?.shop_location || "",
            logo_url: normalizeImageUrl(logoPic),
            logo: normalizeImageUrl(logoPic),
            profile_logo: normalizeImageUrl(logoPic),
            image_url: normalizeImageUrl(imagePic),
            cover_url: normalizeImageUrl(boutique?.cover_url || showcase?.image_url || ""),
            showcase_image: normalizeImageUrl(showcase?.image_url || boutique?.image_url || ""),
            rating: showcase?.rating || 0
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
