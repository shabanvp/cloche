const { sendEmailMessage, isSetup } = require("../emailService");

/**
 * Send plan expiry notification
 */
const sendExpiryNotification = async (boutiqueEmail, boutiqueName) => {
    if (!isSetup) return;

    const htmlBody = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #c1a671; background-color: #faf7f2;">
            <h1 style="color: #c1a671; text-align: center; letter-spacing: 5px;">CLOCHE</h1>
            <p style="font-size: 16px;">Hello <strong>${boutiqueName}</strong>,</p>
            <p>Your subscription has expired. Your account has been moved to the <strong>Basic Plan</strong>.</p>
            <p>To regain your Professional or Premium benefits, please upgrade your plan from the dashboard.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cloche-backend.onrender.com/subscription.html" style="background-color: #c1a671; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Upgrade Now</a>
            </div>
            <p style="font-size: 11px; color: #888; text-align: center;">© 2024 CLOCHE LUXURY</p>
        </div>
    `;

    try {
        const result = await sendEmailMessage({
            to: boutiqueEmail,
            subject: "Your Cloche Subscription Has Expired",
            html: htmlBody,
            fromName: "CLOCHE"
        });

        if (!result?.success) throw new Error(result?.internalError || result?.error || "Email send failed");

        console.log(`[NotificationService] Expiry email sent to ${boutiqueEmail}`);
    } catch (err) {
        console.error("[NotificationService] Failed to send expiry email:", err.message);
    }
};

/**
 * Send lead limit reached notification
 */
const sendLimitReachedNotification = async (boutiqueEmail, boutiqueName, type = 'lead') => {
    if (!isSetup) return;

    const htmlBody = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #c1a671; background-color: #faf7f2;">
            <h1 style="color: #c1a671; text-align: center; letter-spacing: 5px;">CLOCHE</h1>
            <p style="font-size: 16px;">Hello <strong>${boutiqueName}</strong>,</p>
            <p>You have reached your ${type} limit for this month. New ${type}s will be hidden until you upgrade or your cycle resets.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cloche-backend.onrender.com/subscription.html" style="background-color: #c1a671; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Upgrade Plan</a>
            </div>
        </div>
    `;

    try {
        const result = await sendEmailMessage({
            to: boutiqueEmail,
            subject: `Action Required: ${type.toUpperCase()} Limit Reached`,
            html: htmlBody,
            fromName: "CLOCHE"
        });

        if (!result?.success) throw new Error(result?.internalError || result?.error || "Email send failed");
    } catch (err) {
        console.error("[NotificationService] Failed to send limit email:", err.message);
    }
};

module.exports = {
    sendExpiryNotification,
    sendLimitReachedNotification
};
