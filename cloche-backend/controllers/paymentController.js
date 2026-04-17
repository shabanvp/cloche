const { createOrder, verifyPayment } = require("../services/paymentService");
const supabase = require("../supabase");
const { PLANS } = require("../services/planService");

exports.initiatePayment = async (req, res) => {
    const { boutiqueId, planType } = req.body;
    
    if (!boutiqueId || !planType) {
        return res.status(400).json({ message: "boutiqueId and planType are required" });
    }

    const planPrices = {
        professional: 2999,
        premium: 7999
    };

    const amount = planPrices[planType.toLowerCase()];
    if (!amount) {
        return res.status(400).json({ message: "Invalid plan type" });
    }

    try {
        const order = await createOrder(amount);
        return res.json({
            success: true,
            order_id: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        return res.status(500).json({ message: "Failed to create payment order" });
    }
};

exports.confirmPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, boutiqueId, planType } = req.body;

    if (!verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
        return res.status(400).json({ message: "Invalid payment signature" });
    }

    try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 30); // 30 days validity

        const { error } = await supabase
            .from("boutiques")
            .update({
                plan: planType.toLowerCase(),
                subscription_status: "active",
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                payment_id: razorpay_payment_id,
                is_featured: planType.toLowerCase() === PLANS.PREMIUM
            })
            .eq("id", boutiqueId);

        if (error) {
            console.error("Subscription Update Error:", error);
            return res.status(500).json({ message: "Payment verified but subscription update failed" });
        }

        return res.json({
            success: true,
            message: "Subscription activated successfully",
            plan: planType,
            expiresAt: endDate
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error during payment confirmation" });
    }
};
