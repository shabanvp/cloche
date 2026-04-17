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

        // 🔹 Final Ranking Logic (Premium > Professional > Early)
        // This ensures the site feels premium even if the database columns are missing.
        const planWeight = { premium: 3, professional: 2, early: 1 };
        
        const sortedResult = result.sort((a, b) => {
            // 1. Featured first (if column exists)
            if (a.is_featured !== b.is_featured) return b.is_featured ? 1 : -1;
            
            // 2. Plan tier
            const weightA = planWeight[a.plan?.toLowerCase()] || 0;
            const weightB = planWeight[b.plan?.toLowerCase()] || 0;
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
            ? sortedResult.filter(b => b.city.toLowerCase().includes(city) || b.district.toLowerCase().includes(city))
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
