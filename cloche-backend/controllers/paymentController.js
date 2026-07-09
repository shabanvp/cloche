const { createOrder, verifyPayment } = require("../services/paymentService");
const supabase = require("../supabase");
const { PLANS, normalizePlan } = require("../services/planService");

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-session-secure-token";

const getBearerToken = (req) => {
    const raw = String(req.headers.authorization || "").trim();
    const match = raw.match(/^Bearer\s+(.+)$/i);
    return match ? match[1].trim() : "";
};

const isAdminRequest = (req) => {
    const token = getBearerToken(req) || String(req.headers["x-admin-token"] || "").trim();
    return Boolean(token && token === ADMIN_TOKEN);
};

const requireAdmin = (req, res) => {
    if (isAdminRequest(req)) return true;
    res.status(401).json({ success: false, message: "Unauthorized" });
    return false;
};

const isValidPaidPlan = (plan) => {
    const normalized = normalizePlan(plan);
    return normalized === PLANS.PROFESSIONAL || normalized === PLANS.PREMIUM;
};

const getPlanEndDate = (billingCycle) => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (String(billingCycle || "").toLowerCase() === "annual") {
        endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
        endDate.setDate(startDate.getDate() + 30);
    }
    return { startDate, endDate };
};

exports.initiatePayment = async (req, res) => {
    const { boutiqueId, planType, billingCycle } = req.body;
    const normalizedPlan = normalizePlan(planType);
    const normalizedCycle = String(billingCycle || "monthly").trim().toLowerCase() === "annual" ? "annual" : "monthly";

    if (!boutiqueId || !normalizedPlan) {
        return res.status(400).json({ message: "boutiqueId and planType are required" });
    }

    const planPrices = {
        monthly: {
            [PLANS.PROFESSIONAL]: 2999,
            [PLANS.PREMIUM]: 7999
        },
        annual: {
            [PLANS.PROFESSIONAL]: 29990,
            [PLANS.PREMIUM]: 79990
        }
    };

    const amount = planPrices[normalizedCycle]?.[normalizedPlan];
    if (!amount) {
        return res.status(400).json({ message: "Invalid plan type" });
    }

    try {
        const order = await createOrder(amount);
        return res.json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID || "",
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            plan: normalizedPlan,
            billingCycle: normalizedCycle
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to create payment order" });
    }
};

exports.confirmPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, boutiqueId, planType, billingCycle } = req.body;
    const normalizedPlan = normalizePlan(planType);

    if (!boutiqueId || !isValidPaidPlan(normalizedPlan)) {
        return res.status(400).json({ message: "Invalid boutique or plan" });
    }

    if (!verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        return res.status(400).json({ message: "Invalid payment signature" });
    }

    try {
        const { startDate, endDate } = getPlanEndDate(billingCycle);

        const { error } = await supabase
            .from("boutiques")
            .update({
                plan: normalizedPlan,
                subscription_status: "active",
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                payment_id: razorpay_payment_id,
                is_featured: normalizedPlan === PLANS.PREMIUM
            })
            .eq("id", boutiqueId);

        if (error) {
            console.error("Subscription Update Error:", error);
            return res.status(500).json({ message: "Payment verified but subscription update failed" });
        }

        return res.json({
            success: true,
            message: "Subscription activated successfully",
            plan: normalizedPlan,
            expiresAt: endDate
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error during payment confirmation" });
    }
};

exports.submitPaymentProof = async (req, res) => {
    const { boutiqueId, plan, amount, billingCycle, screenshotUrl } = req.body;
    const safeBoutiqueId = Number(boutiqueId);
    const safePlan = normalizePlan(plan);
    const safeAmount = Number(amount || 0);
    const safeScreenshot = String(screenshotUrl || "").trim();
    const safeCycle = String(billingCycle || "monthly").trim().toLowerCase();

    if (!safeBoutiqueId || !isValidPaidPlan(safePlan) || !safeAmount || !safeScreenshot) {
        return res.status(400).json({
            success: false,
            message: "boutiqueId, paid plan, amount and screenshotUrl are required"
        });
    }

    try {
        const { data, error } = await supabase
            .from("payment_proofs")
            .insert([{
                boutique_id: safeBoutiqueId,
                plan: safePlan,
                amount: safeAmount,
                billing_cycle: safeCycle === "annual" ? "annual" : "monthly",
                screenshot_url: safeScreenshot,
                status: "pending"
            }])
            .select("*")
            .maybeSingle();

        if (error) {
            console.error("Payment proof insert error:", error);
            return res.status(500).json({
                success: false,
                message: "Could not save proof. Ensure payment_proofs table exists.",
                error: error.message
            });
        }

        return res.status(201).json({ success: true, proof: data });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error while saving proof" });
    }
};

exports.listPaymentProofs = async (req, res) => {
    if (!requireAdmin(req, res)) return;

    try {
        const { data, error } = await supabase
            .from("payment_proofs")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            return res.status(500).json({ success: false, message: error.message });
        }

        const boutiqueIds = [...new Set((data || []).map((p) => p.boutique_id).filter(Boolean))];
        const { data: boutiques } = boutiqueIds.length
            ? await supabase.from("boutiques").select("id, boutique_name, owner_name, email, phone").in("id", boutiqueIds)
            : { data: [] };
        const boutiqueById = new Map((boutiques || []).map((b) => [Number(b.id), b]));

        return res.json({
            success: true,
            proofs: (data || []).map((p) => ({
                ...p,
                boutique: boutiqueById.get(Number(p.boutique_id)) || null
            }))
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error while loading proofs" });
    }
};

exports.approvePaymentProof = async (req, res) => {
    if (!requireAdmin(req, res)) return;

    const proofId = Number(req.params.proofId);
    if (!proofId) return res.status(400).json({ success: false, message: "Invalid proof id" });

    try {
        const { data: proof, error: proofErr } = await supabase
            .from("payment_proofs")
            .select("*")
            .eq("id", proofId)
            .maybeSingle();

        if (proofErr) return res.status(500).json({ success: false, message: proofErr.message });
        if (!proof) return res.status(404).json({ success: false, message: "Proof not found" });

        const plan = normalizePlan(proof.plan);
        if (!isValidPaidPlan(plan)) return res.status(400).json({ success: false, message: "Invalid plan on proof" });

        const { startDate, endDate } = getPlanEndDate(proof.billing_cycle);

        const { error: boutiqueErr } = await supabase
            .from("boutiques")
            .update({
                plan,
                subscription_status: "active",
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                payment_id: `manual-proof-${proof.id}`,
                is_featured: plan === PLANS.PREMIUM
            })
            .eq("id", proof.boutique_id);

        if (boutiqueErr) {
            return res.status(500).json({ success: false, message: "Proof found, but plan unlock failed", error: boutiqueErr.message });
        }

        const { error: updateErr } = await supabase
            .from("payment_proofs")
            .update({
                status: "approved",
                reviewed_at: new Date().toISOString()
            })
            .eq("id", proofId);

        if (updateErr) return res.status(500).json({ success: false, message: updateErr.message });

        return res.json({ success: true, message: "Payment approved and plan activated", plan, expiresAt: endDate });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error while approving proof" });
    }
};

exports.rejectPaymentProof = async (req, res) => {
    if (!requireAdmin(req, res)) return;

    const proofId = Number(req.params.proofId);
    if (!proofId) return res.status(400).json({ success: false, message: "Invalid proof id" });

    try {
        const { error } = await supabase
            .from("payment_proofs")
            .update({
                status: "rejected",
                reviewed_at: new Date().toISOString()
            })
            .eq("id", proofId);

        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.json({ success: true, message: "Payment proof rejected" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error while rejecting proof" });
    }
};
