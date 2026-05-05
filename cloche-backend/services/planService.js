/**
 * Plan constants and limits for CLOCHE
 */
const PLANS = {
    EARLY: 'early_partner',
    PROFESSIONAL: 'professional',
    PREMIUM: 'premium'
};

const normalizePlan = (plan) => {
    const normalized = String(plan || PLANS.EARLY).trim().toLowerCase();
    if (["early", "basic", "early partner", "early_partner"].includes(normalized)) return PLANS.EARLY;
    if (normalized === "pro") return PLANS.PREMIUM;
    return normalized;
};

const PLAN_LIMITS = {
    [PLANS.EARLY]: {
        maxProducts: 20,
        maxLeads: 20,
        features: {
            analytics: false,
            featured: false,
            aiInsights: false,
            priorityRanking: 3 // Standard
        }
    },
    [PLANS.PROFESSIONAL]: {
        maxProducts: 20,
        maxLeads: 50,
        features: {
            analytics: true,
            featured: false,
            aiInsights: false,
            priorityRanking: 2 // Priority
        }
    },
    [PLANS.PREMIUM]: {
        maxProducts: Infinity,
        maxLeads: Infinity,
        features: {
            analytics: true,
            featured: true,
            aiInsights: true,
            priorityRanking: 1 // Highest
        }
    }
};

/**
 * Get limits for a specific plan
 */
const getPlanLimits = (plan) => {
    const normalizedPlan = normalizePlan(plan);
    return PLAN_LIMITS[normalizedPlan] || PLAN_LIMITS[PLANS.EARLY];
};

/**
 * Check if a boutique can add more products
 */
const canAddProduct = (boutique) => {
    const limits = getPlanLimits(boutique.plan);
    return boutique.product_count < limits.maxProducts;
};

/**
 * Check if a boutique can receive more leads
 */
const canReceiveLead = (boutique) => {
    const limits = getPlanLimits(boutique.plan);
    return boutique.leads_used < limits.maxLeads;
};

module.exports = {
    PLANS,
    PLAN_LIMITS,
    normalizePlan,
    getPlanLimits,
    canAddProduct,
    canReceiveLead
};
