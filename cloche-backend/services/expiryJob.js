const supabase = require("../supabase");
const { sendExpiryNotification } = require("./notificationService");
const { PLANS } = require("./planService");

/**
 * Check for expired subscriptions and downgrade boutiques
 */
const checkExpiredSubscriptions = async () => {
    console.log("[ExpiryJob] Running daily subscription check...");
    
    try {
        const now = new Date().toISOString();
        
        // Find boutiques whose subscription has expired
        const { data: expiredBoutiques, error } = await supabase
            .from("boutiques")
            .select("id, boutique_name, email, plan")
            .lt("end_date", now)
            .neq("plan", PLANS.EARLY);

        if (error) {
            console.error("[ExpiryJob] Error fetching expired boutiques:", error.message);
            return;
        }

        if (!expiredBoutiques || expiredBoutiques.length === 0) {
            console.log("[ExpiryJob] No expired subscriptions found.");
            return;
        }

        console.log(`[ExpiryJob] Found ${expiredBoutiques.length} expired boutiques.`);

        for (const boutique of expiredBoutiques) {
            console.log(`[ExpiryJob] Downgrading ${boutique.boutique_name} (${boutique.id})...`);
            
            const { error: updateError } = await supabase
                .from("boutiques")
                .update({
                    plan: PLANS.EARLY,
                    subscription_status: "expired",
                    is_featured: false,
                    priority_score: 0
                })
                .eq("id", boutique.id);

            if (updateError) {
                console.error(`[ExpiryJob] Failed to downgrade boutique ${boutique.id}:`, updateError.message);
                continue;
            }

            // Send notification
            await sendExpiryNotification(boutique.email, boutique.boutique_name);
        }

        console.log("[ExpiryJob] Finished subscription check.");
    } catch (err) {
        console.error("[ExpiryJob] Unexpected error:", err.message);
    }
};

module.exports = {
    checkExpiredSubscriptions
};
