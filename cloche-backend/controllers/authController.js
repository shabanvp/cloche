const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../supabase");
const { sendVerificationEmail, sendPasswordResetEmail, getEmailServiceStatus } = require("../emailService");
const { uploadBufferToStorage, deleteStorageObjectByUrl } = require("../storage");

const CLOUDINARY_CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const BACKEND_BASE_URL = String(process.env.BACKEND_BASE_URL || process.env.RENDER_EXTERNAL_URL || "https://cloche-backend.onrender.com").trim().replace(/\/+$/, "");
const FRONTEND_BASE_URL = String(process.env.FRONTEND_BASE_URL || "https://cloche-backend.onrender.com").trim().replace(/\/+$/, "");

const emailAcceptedPayload = (emailResult) => ({
    sent: true,
    messageId: emailResult?.messageId || null,
    method: emailResult?.method || null,
    is_test: emailResult?.isTest || false,
    test_url: emailResult?.testUrl || ""
});

const normalizeTags = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const tags = raw
        .split(",")
        .map((t) => String(t || "").trim())
        .filter(Boolean);

    if (!tags.length) return "";

    return tags.join(", ");
};

/**
 * Normalizes image URLs for Cloudinary
 */
const normalizeImageUrl = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return null;
    if (/^https?:\/\//i.test(raw) || /^data:image\//i.test(raw)) return raw;

    const cloudName = CLOUDINARY_CLOUD_NAME || 'dycwsnzyd';

    if (!raw.includes("image/upload")) {
        return `https://res.cloudinary.com/${cloudName}/image/upload/${raw.replace(/^\/+/, "")}`;
    }
    return raw;
};

const cleanText = (value) => String(value || "").trim().replace(/\s+/g, " ");

const isVerifiedTrue = (value) => value === true || value === "true" || value === 1 || value === "1";

const normalizeEmailValue = (value) => String(value || "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .toLowerCase();

const normalizePhoneValue = (value) => String(value || "").replace(/\D/g, "");

const isDuplicateKeyError = (error) => {
    const code = String(error?.code || "");
    const message = String(error?.message || "");
    return code === "23505" || /duplicate key value|unique constraint/i.test(message);
};

const duplicatePartnerMessage = (error) => {
    const detail = `${error?.message || ""} ${error?.details || ""}`.toLowerCase();
    if (detail.includes("phone")) return "This mobile number is already registered.";
    if (detail.includes("email")) return "This email is already registered. Please log in or use another email.";
    if (detail.includes("boutique_name")) return "A boutique with this name is already listed. Please adjust the boutique name and try again.";
    return "This partner account already exists. Please check the email or mobile number.";
};

const markAccountVerified = async (table, id) => {
    if (!table || !id) return false;
    const { error } = await supabase
        .from(table)
        .update({ is_verified: true, verification_token: null })
        .eq("id", id);

    if (error) {
        console.error(`[Auth] Failed to auto-verify ${table} account ${id}:`, error.message);
        return false;
    }

    return true;
};

const PASSWORD_RESET_MINUTES = 30;

const normalizeAccountType = (value) => value === "partner" ? "partner" : "user";

const buildVerificationUrl = (token, type) => `${BACKEND_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(
    String(token || "")
)}&type=${encodeURIComponent(String(type || ""))}`;

const getVerificationUrl = (emailResult, token, type) => emailResult?.verificationUrl || buildVerificationUrl(token, type);

const hashResetToken = (token) => crypto
    .createHash("sha256")
    .update(String(token || ""))
    .digest("hex");

const isStrongPassword = (password) => String(password || "").length >= 8;

const normalizeLocationFields = ({ area, district, city }) => {
    const safeCity = cleanText(city);
    const splitCityParts = (val) => val.includes(",") ? val.split(",").map(p => cleanText(p)).filter(Boolean) : [];
    const cityParts = splitCityParts(safeCity);
    const cityArea = cityParts[0] || "";
    const cityDistrict = cityParts.slice(1).join(", ");

    let safeArea = cleanText(area);
    let safeDistrict = cleanText(district);

    if (!safeArea && cityParts.length > 1) safeArea = cityArea;
    if (!safeDistrict && cityDistrict) safeDistrict = cityDistrict;
    if (!safeDistrict && safeCity) safeDistrict = safeCity;

    if (safeArea && safeDistrict && safeArea.toLowerCase() === safeDistrict.toLowerCase()) {
        safeArea = "";
    }

    return {
        area: safeArea || null,
        district: safeDistrict || null,
        city: safeCity || null
    };
};

/* ================= SIGNUP ================= */
exports.signup = async (req, res) => {
    const { account_type } = req.body;

    if (!account_type) return res.status(400).json({ message: "Account type required" });

    if (account_type === "user") {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

        try {
            const passwordHash = await bcrypt.hash(password, 10);
            const verificationToken = uuidv4();

            const { data: existingUser } = await supabase.from("users").select("id, is_verified").eq("email", email).maybeSingle();

            if (existingUser) {
                if (isVerifiedTrue(existingUser.is_verified)) return res.status(409).json({ message: "User already exists" });
                await supabase
                    .from("users")
                    .update({ name, password_hash: passwordHash, is_verified: true, verification_token: null })
                    .eq("id", existingUser.id);
                return res.json({ success: true, role: "user", auto_verified: true, message: "Account ready. You can log in now.", email: { sent: false } });
            }

            const { data: insertedUser, error } = await supabase
                .from("users")
                .insert([{ name, email, password_hash: passwordHash, is_verified: true, verification_token: null }])
                .select("id")
                .maybeSingle();
            if (error) return res.status(500).json({ message: error.message });

            return res.status(201).json({ success: true, role: "user", userId: insertedUser?.id, auto_verified: true, message: "Account ready. You can log in now.", email: { sent: false } });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    if (account_type === "partner") {
        const { boutique_name, owner_name, email, phone, city, area, district, password, tags } = req.body;
        if (!boutique_name || !owner_name || !email || !phone || !password) return res.status(400).json({ message: "All partner fields required" });
        if (!req.file) return res.status(400).json({ message: "Showcase image required" });

        try {
            const normalizedEmail = normalizeEmailValue(email);
            const normalizedPhone = normalizePhoneValue(phone);
            const passwordHash = await bcrypt.hash(password, 10);
            const verificationToken = uuidv4();
            const loc = normalizeLocationFields({
                area,
                district,
                city: city || (area && district ? `${area}, ${district}` : null)
            });

            const basePayload = {
                boutique_name: String(boutique_name).trim(),
                owner_name: String(owner_name).trim(),
                email: normalizedEmail,
                phone: normalizedPhone,
                city: loc.city || "",
                plan: "early_partner",
                is_verified: false,
                verification_token: verificationToken
            };

            const { data: existingBoutique, error: existingBoutiqueError } = await supabase
                .from("boutiques")
                .select("id, is_verified")
                .ilike("email", normalizedEmail)
                .maybeSingle();

            if (existingBoutiqueError) return res.status(500).json({ message: existingBoutiqueError.message });

            if (existingBoutique) {
                if (isVerifiedTrue(existingBoutique.is_verified)) {
                    return res.status(409).json({ message: "This email is already registered. Please log in or use another email." });
                }

                await supabase
                    .from("boutiques")
                    .update({ ...basePayload, password_hash: passwordHash, is_verified: true, verification_token: null })
                    .eq("id", existingBoutique.id);

                if (req.file) {
                    const { publicUrl } = await uploadBufferToStorage({ folder: `boutiques/showcase/${existingBoutique.id}`, file: req.file });
                    await supabase.from("boutique_showcase").upsert([{ boutique_id: existingBoutique.id, area: loc.area, district: loc.district, tags: tags || null, image_url: publicUrl }], { onConflict: "boutique_id" });
                }

                return res.json({ success: true, role: "partner", boutiqueId: existingBoutique.id, auto_verified: true, message: "Boutique account ready. You can log in now.", email: { sent: false } });
            }

            const { data: existingPhone, error: existingPhoneError } = await supabase
                .from("boutiques")
                .select("id")
                .eq("phone", normalizedPhone)
                .maybeSingle();

            if (existingPhoneError) return res.status(500).json({ message: existingPhoneError.message });
            if (existingPhone) return res.status(409).json({ message: "This mobile number is already registered." });

            const { data: inserted, error } = await supabase
                .from("boutiques")
                .insert([{ ...basePayload, password_hash: passwordHash, is_verified: true, verification_token: null }])
                .select("id")
                .maybeSingle();
            if (error) {
                if (isDuplicateKeyError(error)) return res.status(409).json({ message: duplicatePartnerMessage(error) });
                return res.status(500).json({ message: error.message });
            }

            if (inserted?.id && req.file) {
                const { publicUrl } = await uploadBufferToStorage({ folder: `boutiques/showcase/${inserted.id}`, file: req.file });
                await supabase.from("boutique_showcase").upsert([{ boutique_id: inserted.id, area: loc.area, district: loc.district, tags: tags || null, image_url: publicUrl }], { onConflict: "boutique_id" });
            }

            return res.status(201).json({ success: true, role: "partner", boutiqueId: inserted?.id, auto_verified: true, message: "Boutique account ready. You can log in now.", email: { sent: false } });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
    const { identifier, password } = req.body;
    if (!identifier || !password) return res.status(400).json({ message: "Credentials required" });

    try {
        const isEmail = identifier.includes("@");
        const { data: boutique, error } = await supabase.from("boutiques").select("*").eq(isEmail ? "email" : "phone", isEmail ? identifier.toLowerCase() : identifier).maybeSingle();

        if (!boutique || error) return res.status(401).json({ message: "Invalid credentials" });
        if (!isVerifiedTrue(boutique.is_verified)) return res.status(403).json({ message: "Please verify email first." });

        let match = false;
        if (boutique.password_hash) {
            match = await bcrypt.compare(password, boutique.password_hash);
        }
        if (!match && boutique.password) match = String(password) === String(boutique.password); // Fallback for old passwords

        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        return res.json({
            success: true,
            boutiqueId: boutique.id,
            boutiqueName: boutique.boutique_name,
            ownerName: boutique.owner_name,
            plan: boutique.plan || "early_partner"
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/* ================= LOGIN USER ================= */
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    try {
        const { data: user, error } = await supabase.from("users").select("*").eq("email", email.toLowerCase()).maybeSingle();

        if (!user || error) return res.status(401).json({ message: "Invalid credentials" });
        if (!isVerifiedTrue(user.is_verified)) return res.status(403).json({ message: "Please verify email first." });

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        return res.json({
            success: true,
            userId: user.id,
            name: user.name,
            email: user.email,
            plan: "early_partner"
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/* ================= VERIFY EMAIL ================= */
exports.verifyEmail = async (req, res) => {
    const { token, type } = req.query;
    if (!token || !type) return res.status(400).send("Missing info");

    const table = type === "partner" ? "boutiques" : "users";
    try {
        const { data: record } = await supabase.from(table).select("id").eq("verification_token", token).maybeSingle();
        if (!record) return res.status(400).send("Invalid link");

        await supabase.from(table).update({ is_verified: true, verification_token: null }).eq("id", record.id);
        return res.redirect(`${FRONTEND_BASE_URL}/boutiquelogin.html?status=verified&verified=true&type=${type}`);
    } catch (err) {
        return res.status(500).send("Verification failed");
    }
};

/* ================= RESEND VERIFICATION ================= */
exports.resendVerification = async (req, res) => {
    const { email, account_type } = req.body;
    if (!email || !account_type) {
        return res.status(400).json({ message: "Email and account type required" });
    }

    const table = account_type === "partner" ? "boutiques" : "users";
    const nameField = account_type === "partner" ? "owner_name" : "name";

    try {
        const { data: record, error } = await supabase
            .from(table)
            .select(`id, ${nameField}, is_verified`)
            .eq("email", email.toLowerCase())
            .maybeSingle();

        if (error || !record) {
            return res.status(404).json({ message: "Account not found" });
        }

        if (isVerifiedTrue(record.is_verified)) {
            return res.status(400).json({ message: "Account is already verified" });
        }

        const newToken = uuidv4();
        const { error: updateErr } = await supabase
            .from(table)
            .update({ verification_token: newToken })
            .eq("id", record.id);

        if (updateErr) throw updateErr;

        const emailResult = await sendVerificationEmail(
            email.toLowerCase(),
            record[nameField] || "User",
            newToken,
            account_type
        );

        if (!emailResult?.success) {
            console.error("[Auth] Email service returned error:", emailResult?.error);
            return res.status(500).json({
                message: "Failed to send verification email",
                error: emailResult?.error || "Email service unavailable"
            });
        }

        console.log(`[Auth] Verification email accepted for ${email} via ${emailResult.method || "unknown"}`);
        return res.json({
            success: true,
            message: "Verification email accepted.",
            email: emailAcceptedPayload(emailResult)
        });
    } catch (err) {
        console.error("[Auth] Resend verification exception:", err.message);
        console.error("[Auth] Full exception:", err);
        return res.status(500).json({ 
            message: "Failed to resend verification email",
            error: err.message || "Internal server error"
        });
    }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
    const accountType = normalizeAccountType(req.body.account_type);
    const email = String(req.body.email || "").trim().toLowerCase();

    if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Valid email is required" });
    }

    const table = accountType === "partner" ? "boutiques" : "users";
    const nameField = accountType === "partner" ? "owner_name" : "name";
    const genericResponse = {
        success: true,
        message: "If an account exists for that email, a password reset link has been sent."
    };

    try {
        const { data: record, error } = await supabase
            .from(table)
            .select(`id, email, ${nameField}`)
            .eq("email", email)
            .maybeSingle();

        if (error) throw error;
        if (!record) return res.json(genericResponse);

        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = hashResetToken(rawToken);
        const expiresAt = new Date(Date.now() + PASSWORD_RESET_MINUTES * 60 * 1000).toISOString();

        const { error: updateErr } = await supabase
            .from(table)
            .update({
                password_reset_token_hash: tokenHash,
                password_reset_expires_at: expiresAt
            })
            .eq("id", record.id);

        if (updateErr) throw updateErr;

        const emailResult = await sendPasswordResetEmail(
            email,
            record[nameField] || "User",
            rawToken,
            accountType
        );

        if (!emailResult?.success) {
            console.error("[Auth] Password reset email failed:", emailResult?.error);
            return res.status(500).json({
                message: "Failed to send password reset email",
                error: emailResult?.error || "Email service unavailable"
            });
        }

        return res.json(genericResponse);
    } catch (err) {
        console.error("[Auth] Forgot password exception:", err.message);
        return res.status(500).json({
            message: "Failed to start password reset",
            error: err.message || "Internal server error"
        });
    }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
    const accountType = normalizeAccountType(req.body.account_type);
    const token = String(req.body.token || "").trim();
    const password = String(req.body.password || "");

    if (!token || !password) {
        return res.status(400).json({ message: "Reset token and new password are required" });
    }

    if (!isStrongPassword(password)) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const table = accountType === "partner" ? "boutiques" : "users";
    const tokenHash = hashResetToken(token);

    try {
        const { data: record, error } = await supabase
            .from(table)
            .select("id, password_reset_expires_at")
            .eq("password_reset_token_hash", tokenHash)
            .maybeSingle();

        if (error) throw error;

        const expiresAt = record?.password_reset_expires_at ? new Date(record.password_reset_expires_at) : null;
        if (!record || !expiresAt || Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
            return res.status(400).json({ message: "Reset link is invalid or expired" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const { error: updateErr } = await supabase
            .from(table)
            .update({
                password_hash: passwordHash,
                password_reset_token_hash: null,
                password_reset_expires_at: null
            })
            .eq("id", record.id);

        if (updateErr) throw updateErr;

        return res.json({ success: true, message: "Password updated. You can now login." });
    } catch (err) {
        console.error("[Auth] Reset password exception:", err.message);
        return res.status(500).json({
            message: "Failed to reset password",
            error: err.message || "Internal server error"
        });
    }
};

/* ================= EMAIL STATUS (DEBUG) ================= */
exports.emailStatus = async (req, res) => {
    try {
        const status = typeof getEmailServiceStatus === "function" ? await getEmailServiceStatus() : { configured: false };
        return res.json({ success: true, ...status });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Failed to read email status" });
    }
};

/* ================= PROFILE ================= */
exports.getProfile = async (req, res) => {
    const { boutiqueId } = req.params;
    try {
        const [{ data: boutique }, { data: showcaseRows }] = await Promise.all([
            supabase.from("boutiques").select("*").eq("id", boutiqueId).maybeSingle(),
            supabase
                .from("boutique_showcase")
                .select("district, area, tags, image_url, id")
                .eq("boutique_id", boutiqueId)
                .order("id", { ascending: false })
                .limit(1)
        ]);

        if (!boutique) return res.status(404).json({ message: "Not found" });

        const showcase = Array.isArray(showcaseRows) ? showcaseRows[0] : null;

        return res.json({
            ...boutique,
            district: showcase?.district || "",
            area: showcase?.area || "",
            tags: normalizeTags(showcase?.tags),
            showcase_image: normalizeImageUrl(showcase?.image_url)
        });
    } catch (err) {
        console.error("[getProfile] Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    const { boutiqueId } = req.params;
    const { boutique_name, owner_name, email, phone, city, district, area, tags } = req.body;

    try {
        const { error } = await supabase.from("boutiques").update({
            boutique_name,
            owner_name,
            email: String(email).trim().toLowerCase(),
            phone: String(phone).trim(),
            city: city
        }).eq("id", boutiqueId);

        if (error) return res.status(500).json({ message: "Update failed", error: error.message });

        const normalizedTags = normalizeTags(tags) || null;

        await supabase.from("boutique_showcase").upsert([{
            boutique_id: Number(boutiqueId),
            district,
            area,
            tags: normalizedTags
        }], { onConflict: "boutique_id" });

        return res.json({ success: true, message: "Profile updated" });
    } catch (err) {
        console.error("[updateProfile] Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ================= SHOWCASE ================= */
exports.getShowcase = async (req, res) => {
    const { boutiqueId } = req.params;
    try {
        const { data: showcaseRows, error } = await supabase
            .from("boutique_showcase")
            .select("*")
            .eq("boutique_id", boutiqueId)
            .order("id", { ascending: false })
            .limit(1);

        if (error && error.code !== "PGRST116") {
            return res.status(500).json({ message: "Database error", error: error.message });
        }

        const showcase = Array.isArray(showcaseRows) ? showcaseRows[0] : null;
        if (!showcase) return res.json({ boutique_id: Number(boutiqueId), district: "", area: "", tags: "", shop_location: "", image_url: "" });
        return res.json({ ...showcase, tags: normalizeTags(showcase.tags) });
    } catch (err) {
        console.error("[getShowcase] Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateShowcase = async (req, res) => {
    const { boutiqueId } = req.params;
    const { district, area, tags, shop_location } = req.body;
    try {
        const normalizedTags = normalizeTags(tags) || null;
        const { error } = await supabase.from("boutique_showcase").upsert([{
            boutique_id: Number(boutiqueId),
            district: district || null,
            area: area || null,
            tags: normalizedTags,
            shop_location: String(shop_location || "").trim() || null
        }], { onConflict: "boutique_id" });

        if (error) return res.status(500).json({ message: "Failed to save showcase", error: error.message });
        return res.json({ success: true, message: "Showcase updated" });
    } catch (err) {
        console.error("[updateShowcase] Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateShowcaseImage = async (req, res) => {
    const { boutiqueId } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) return res.status(400).json({ message: "imageUrl is required" });

    try {
        const normalizedUrl = normalizeImageUrl(imageUrl);
        const { error } = await supabase.from("boutique_showcase").upsert([{
            boutique_id: Number(boutiqueId),
            image_url: normalizedUrl
        }], { onConflict: "boutique_id" });

        if (error) return res.status(500).json({ message: "Failed to save image", error: error.message });
        return res.json({ success: true, image_url: normalizedUrl, message: "Showcase image updated" });
    } catch (err) {
        console.error("[updateShowcaseImage] Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updatePassword = async (req, res) => {
    const { boutiqueId } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) return res.status(400).json({ message: "Current and new password required" });

    try {
        const { data: boutique, error } = await supabase.from("boutiques").select("password_hash, password").eq("id", boutiqueId).maybeSingle();
        if (!boutique || error) return res.status(404).json({ message: "Boutique not found" });

        let match = false;
        if (boutique.password_hash) {
            match = await bcrypt.compare(currentPassword, boutique.password_hash);
        } else if (boutique.password) {
            match = String(currentPassword) === String(boutique.password);
        }

        if (!match) return res.status(401).json({ message: "Incorrect current password" });

        const newHash = await bcrypt.hash(newPassword, 10);
        await supabase.from("boutiques").update({ password_hash: newHash }).eq("id", boutiqueId);

        return res.json({ success: true, message: "Password updated" });
    } catch (err) {
        console.error("[updatePassword] Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

/* ================= DASHBOARD ================= */
exports.getDashboard = async (req, res) => {
    const { boutiqueId } = req.params;
    try {
        const { data: boutique, error } = await supabase.from("boutiques").select("*").eq("id", boutiqueId).maybeSingle();
        if (error || !boutique) return res.status(404).json({ message: "Boutique not found" });

        const subscriptionStart = boutique.start_date || boutique.created_at || null;
        let introUnlimited = false;
        let introEndsAt = null;
        if (subscriptionStart) {
            const start = new Date(subscriptionStart);
            if (!Number.isNaN(start.getTime())) {
                const end = new Date(start);
                end.setUTCMonth(end.getUTCMonth() + 6);
                introEndsAt = end.toISOString();
                introUnlimited = Date.now() < end.getTime();
            }
        }

        const [leads, products, conversations] = await Promise.all([
            supabase.from("leads").select("*", { count: "exact", head: true }).eq("boutique_id", boutiqueId),
            supabase.from("products").select("*", { count: "exact", head: true }).eq("boutique_id", boutiqueId),
            supabase.from("conversations").select("id", { count: "exact" }).eq("boutique_id", boutiqueId)
        ]);

        const convRows = Array.isArray(conversations?.data) ? conversations.data : [];
        const convIds = convRows.map((c) => c.id).filter(Boolean);

        let messagesUsed = 0;
        if (convIds.length) {
            const { count: msgCount, error: msgErr } = await supabase
                .from("messages")
                .select("*", { count: "exact", head: true })
                .in("conversation_id", convIds)
                .eq("sender_type", "boutique");

            if (!msgErr) messagesUsed = Number(msgCount || 0);
        }

        return res.json({
            boutiqueName: boutique.boutique_name,
            ownerName: boutique.owner_name,
            totalLeads: leads.count || 0,
            leadsUsed: leads.count || 0,
            messagesUsed,
            totalConversations: conversations.count || 0,
            productsUsed: products.count || 0,
            subscriptionStartDate: subscriptionStart,
            introUnlimited,
            introEndsAt,
            plan: boutique.plan || "early_partner"
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get Cloudinary config for the frontend
 */
exports.getCloudinaryConfig = (req, res) => {
    res.json({
        success: true,
        cloudName: CLOUDINARY_CLOUD_NAME || 'dycwsnzyd'
    });
};
