const supabase = require("../supabase");
const { PLANS } = require("../services/planService");

/**
 * Get all boutiques with ranking logic
 * Ranking: Premium > Professional > Early
 */
exports.getAllBoutiques = async (req, res) => {
    const city = String(req.query.city || "").trim().toLowerCase();
    const limit = parseInt(req.query.limit) || 100;

    try {
        // Fetch boutiques with their plan and priority details
        let query = supabase
            .from("boutiques")
            .select("id, boutique_name, owner_name, email, phone, city, plan, is_featured, priority_score")
            // First by featured status, then by plan (we'll handle plan sorting in JS if needed, or by priority_score)
            .order("is_featured", { ascending: false })
            .order("priority_score", { ascending: false })
            .order("boutique_name", { ascending: true });

        const { data: boutiques, error } = await query;

        if (error) {
            return res.status(500).json({ message: "Database error", error: error.message });
        }

        // Fetch showcase data for images and location normalization
        const boutiqueIds = boutiques.map(b => b.id);
        const { data: showcases } = await supabase
            .from("boutique_showcase")
            .select("boutique_id, district, area, image_url, rating")
            .in("boutique_id", boutiqueIds);

        const showcaseMap = {};
        (showcases || []).forEach(s => {
            showcaseMap[s.boutique_id] = s;
        });

        const result = boutiques.map(b => {
            const s = showcaseMap[b.id] || {};
            return {
                ...b,
                district: s.district || "",
                area: s.area || "",
                image_url: s.image_url || null,
                rating: s.rating || 5.0
            };
        });

        // Filter by city if provided
        let filtered = city 
            ? result.filter(b => b.city.toLowerCase().includes(city) || b.district.toLowerCase().includes(city))
            : result;

        return res.json(filtered.slice(0, limit));
    } catch (err) {
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

        const { data: showcase } = await supabase
            .from("boutique_showcase")
            .select("*")
            .eq("boutique_id", boutiqueId)
            .maybeSingle();

        return res.json({ ...boutique, showcase });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};
