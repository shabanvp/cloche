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

/**
 * Get all boutiques with ranking logic
 * Ranking: Premium > Professional > Early
 */
exports.getAllBoutiques = async (req, res) => {
    const city = String(req.query.city || "").trim().toLowerCase();
    const limit = parseInt(req.query.limit) || 100;

    try {
        // Fetch boutiques. We first try with the advanced ranking columns.
        // If these columns don't exist yet, it will throw a PostgreSQL error (500).
        // We'll catch that and retry with a simpler query.
        let boutiques;
        
        try {
            const { data, error } = await supabase
                .from("boutiques")
                .select("id, boutique_name, owner_name, email, phone, city, plan, is_featured, priority_score")
                .order("is_featured", { ascending: false })
                .order("priority_score", { ascending: false })
                .order("boutique_name", { ascending: true });
                
            if (error) throw error;
            boutiques = data;
        } catch (dbErr) {
            console.warn("[BoutiqueController] Advanced ranking failed, falling back to basic sort:", dbErr.message);
            const { data, error } = await supabase
                .from("boutiques")
                .select("id, boutique_name, owner_name, email, phone, city, plan")
                .order("boutique_name", { ascending: true });
                
            if (error) return res.status(500).json({ message: "Database error", error: error.message });
            boutiques = data;
        }

        // Fetch showcase data for images/location/tags.
        // Important: if boutique_showcase accidentally has multiple rows per boutique_id,
        // always pick the latest one (so tags shown on mobile match what the boutique saved).
        const boutiqueIds = boutiques.map(b => b.id).filter(Boolean);
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
                        .select("id, boutique_id, district, area, shop_location, tags, image_url, rating")
                        .in("boutique_id", boutiqueIds)
                        .order("id", { ascending: false });

                    if (error) throw error;
                    showcases = Array.isArray(data) ? data : [];
                } catch (e2) {
                    try {
                        const { data, error } = await supabase
                            .from("boutique_showcase")
                            .select("boutique_id, district, area, shop_location, tags, image_url, rating")
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
            // Keep the first row encountered (queries above try to return newest-first).
            if (showcaseMap[row.boutique_id]) continue;
            showcaseMap[row.boutique_id] = {
                ...row,
                tags: normalizeTags(row.tags)
            };
        }

        // 🔹 Final Ranking Logic (Premium > Professional > Early)
        // This ensures the site feels premium even if the database columns are missing.
        const normalizePlan = (plan) => {
            const normalized = String(plan || "").trim().toLowerCase();
            if (["early", "basic", "early partner", "early_partner"].includes(normalized)) return "early_partner";
            if (normalized === "pro") return "premium";
            return normalized;
        };
        const planWeight = { premium: 3, professional: 2, early_partner: 1 };
        
        // 🔹 Merge boutique data with showcase data
        const result = boutiques.map(b => ({
            ...b,
            ...(showcaseMap[b.id] || {})
        }));

        const sortedResult = result.sort((a, b) => {
            // 1. Featured first (if column exists)
            if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1;
            
            // 2. Plan tier
            if (normalizePlan(a.plan) === "premium" && normalizePlan(b.plan) !== "premium") return -1;
            if (normalizePlan(b.plan) === "premium" && normalizePlan(a.plan) !== "premium") return 1;

            const weightA = planWeight[normalizePlan(a.plan)] || 0;
            const weightB = planWeight[normalizePlan(b.plan)] || 0;
            if (weightA !== weightB) return weightB - weightA;
            
            // 3. Score (if column exists)
            if (a.priority_score !== b.priority_score) return (b.priority_score || 0) - (a.priority_score || 0);

            // 4. Rating
            if (a.rating !== b.rating) return (b.rating || 0) - (a.rating || 0);
            
            // 5. Alphabetical
            return a.boutique_name.localeCompare(b.boutique_name);
        });

        // Filter by city if provided
        let filtered = city 
            ? sortedResult.filter(b => 
                (b.city && b.city.toLowerCase().includes(city)) || 
                (b.district && b.district.toLowerCase().includes(city))
              )
            : sortedResult;

        return res.json(filtered.slice(0, limit));
    } catch (err) {
        console.error("[BoutiqueController] Error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
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

        // Prefer latest showcase row if duplicates exist
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

        return res.json({
            ...boutique,
            tags: normalizeTags(showcase?.tags),
            district: showcase?.district || "",
            area: showcase?.area || "",
            shop_location: showcase?.shop_location || "",
            showcase_image: showcase?.image_url || null,
            rating: showcase?.rating || 0
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
