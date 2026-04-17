const { getPlanLimits } = require("../services/planService");
const supabase = require("../supabase");

/**
 * Middleware to restrict access based on boutique plan features
 * @param {string} feature - The feature key to check (e.g., 'analytics', 'featured', 'aiInsights')
 */
const restrictByPlan = (feature) => {
    return async (req, res, next) => {
        const boutiqueId = req.headers['x-boutique-id'] || req.body.boutiqueId || req.query.boutiqueId;
        
        if (!boutiqueId) {
            return res.status(401).json({ message: "Boutique ID required for this feature" });
        }

        try {
            const { data: boutique, error } = await supabase
                .from("boutiques")
                .select("plan")
                .eq("id", boutiqueId)
                .maybeSingle();

            if (error || !boutique) {
                return res.status(404).json({ message: "Boutique not found" });
            }

            const limits = getPlanLimits(boutique.plan);
            
            if (!limits.features[feature]) {
                return res.status(403).json({ 
                    message: `${feature.charAt(0).toUpperCase() + feature.slice(1)} is only available on ${feature === 'analytics' ? 'Professional/Premium' : 'Premium'} plans.`,
                    locked: true,
                    requiredPlan: feature === 'analytics' ? 'professional' : 'premium'
                });
            }

            next();
        } catch (err) {
            return res.status(500).json({ message: "Server error" });
        }
    };
};

module.exports = {
    restrictByPlan
};
