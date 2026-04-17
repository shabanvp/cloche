const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a new order for subscription upgrade
 */
const createOrder = async (amount, currency = "INR") => {
    const options = {
        amount: amount * 100, // Amount in paise
        currency,
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        throw error;
    }
};

/**
 * Verify Razorpay payment signature
 */
const verifyPayment = (orderId, paymentId, signature) => {
    const text = orderId + "|" + paymentId;
    const generated_signature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest("hex");

    return generated_signature === signature;
};

module.exports = {
    createOrder,
    verifyPayment
};
