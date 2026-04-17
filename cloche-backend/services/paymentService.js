const Razorpay = require("razorpay");
const crypto = require("crypto");

let razorpay;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("[PaymentService] Razorpay initialized successfully.");
  } else {
    console.warn("[PaymentService] RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing. Payment features will be disabled.");
  }
} catch (error) {
  console.error("[PaymentService] Failed to initialize Razorpay:", error.message);
}

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
        if (!razorpay) {
            throw new Error("Razorpay is not configured on the server. Please check environment variables.");
        }
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
    if (!process.env.RAZORPAY_KEY_SECRET) {
        console.error("[PaymentService] Cannot verify payment: RAZORPAY_KEY_SECRET is not configured.");
        return false;
    }
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
