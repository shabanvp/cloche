const { sendEnquiryNotificationEmail, createEmailMessage, encodeMessage, gmail, isSetup } = require("../emailService");
const GMAIL_USER = process.env.GMAIL_USER || "cloche.luxury@gmail.com";

/**
 * Send plan expiry notification
 */
const sendExpiryNotification = async (boutiqueEmail, boutiqueName) => {
    if (!isSetup) return;

    const htmlBody = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #c1a671; background-color: #faf7f2;">
            <h1 style="color: #c1a671; text-align: center; letter-spacing: 5px;">CLOCHE</h1>
            <p style="font-size: 16px;">Hello <strong>${boutiqueName}</strong>,</p>
            <p>Your subscription has expired. Your account has been moved to the <strong>Early Plan</strong>.</p>
            <p>To regain your Professional or Premium benefits, please upgrade your plan from the dashboard.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://cloche-backend.onrender.com/subscription.html" style="background-color: #c1a671; color: #fff; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase;">Upgrade Now</a>
            </div>
            <p style="font-size: 11px; color: #888; text-align: center;">© 2024 CLOCHE LUXURY</p>
        </div>
    `;

    try {
        const rawMessage = Array.isArray(createEmailMessage) ? createEmailMessage(boutiqueEmail, "Your Cloche Subscription has expired", htmlBody) : `To: ${boutiqueEmail}\nSubject: Your Cloche Subscription has expired\nContent-Type: text/html\n\n${htmlBody}`;
        
        // Using internal createEmailMessage logic if not exported
        const emailLines = [
            `From: "CLOCHE" <${GMAIL_USER}>`,
            `To: ${boutiqueEmail}`,
            "Content-Type: text/html; charset=UTF-8",
            "MIME-Version: 1.0",
            `Subject: Your Cloche Subscription Has Expired`,
            "",
            htmlBody
        ];
        const raw = emailLines.join("\n");
        const encoded = Buffer.from(raw).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

        await gmail.users.messages.send({
            userId: "me",
            resource: { raw: encoded }
        });
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
        const emailLines = [
            `From: "CLOCHE" <${GMAIL_USER}>`,
            `To: ${boutiqueEmail}`,
            "Content-Type: text/html; charset=UTF-8",
            "MIME-Version: 1.0",
            `Subject: Action Required: ${type.toUpperCase()} Limit Reached`,
            "",
            htmlBody
        ];
        const raw = emailLines.join("\n");
        const encoded = Buffer.from(raw).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

        await gmail.users.messages.send({
            userId: "me",
            resource: { raw: encoded }
        });
    } catch (err) {
        console.error("[NotificationService] Failed to send limit email:", err.message);
    }
};

module.exports = {
    sendExpiryNotification,
    sendLimitReachedNotification
};
