const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const supabase = require("../supabase");
const { sendVerificationEmail, getEmailServiceStatus } = require("../emailService");
const { uploadBufferToStorage, deleteStorageObjectByUrl } = require("../storage");

const CLOUDINARY_CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const FRONTEND_BASE_URL = String(process.env.FRONTEND_BASE_URL || "https://cloche-backend.onrender.com").trim().replace(/\/+$/, "");

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
                await supabase.from("users").update({ name, password_hash: passwordHash, verification_token: verificationToken }).eq("id", existingUser.id);
                const emailResult = await sendVerificationEmail(email, name, verificationToken, "user");
                const verificationUrl = `${FRONTEND_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(String(verificationToken))}&type=user`;
                if (!emailResult?.success) {
                    console.error("[Auth] Verification email failed (user resend):", email, emailResult?.error || emailResult);
                    return res.json({ success: true, message: "Account updated but verification email failed. Please use manual link or try resending.", email_failed: true, email_error: emailResult?.error, verification_url: verificationUrl });
                }
                return res.json({ success: true, message: "Verification email resent.", email: { sent: true, messageId: emailResult?.messageId || null } });
            }

            const { error } = await supabase.from("users").insert([{ name, email, password_hash: passwordHash, is_verified: false, verification_token: verificationToken }]);
            if (error) return res.status(500).json({ message: error.message });

            const emailResult = await sendVerificationEmail(email, name, verificationToken, "user");

            const verificationUrl = `${FRONTEND_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(String(verificationToken))}&type=user`;
            if (!emailResult?.success) {
                console.error("[Auth] Verification email failed (user signup):", email, emailResult?.error || emailResult);
                return res.status(201).json({ success: true, message: "Account created but verification email failed.", email_failed: true, email_error: emailResult?.error, verification_url: verificationUrl });
            }
            return res.status(201).json({ success: true, message: "User account created. Check your email.", email: { sent: true, messageId: emailResult?.messageId || null, is_test: emailResult.isTest, test_url: emailResult.testUrl } });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    if (account_type === "partner") {
        const { boutique_name, owner_name, email, phone, city, area, district, password, tags } = req.body;
        if (!boutique_name || !owner_name || !email || !phone || !password) return res.status(400).json({ message: "All partner fields required" });
        if (!req.file) return res.status(400).json({ message: "Showcase image required" });

        try {
            const normalizedEmail = String(email).trim().toLowerCase();
            const passwordHash = await bcrypt.hash(password, 10);
            const verificationToken = uuidv4();
            const loc = normalizeLocationFields({ area, district, city });

            const basePayload = {
                boutique_name: String(boutique_name).trim(),
                owner_name: String(owner_name).trim(),
                email: normalizedEmail,
                phone: String(phone).trim(),
                city: loc.city || String(city).trim(),
                plan: "early",
                is_verified: false,
                verification_token: verificationToken
            };

            const { data: existingBoutique } = await supabase.from("boutiques").select("id, is_verified").eq("email", normalizedEmail).maybeSingle();

            if (existingBoutique) {
                if (isVerifiedTrue(existingBoutique.is_verified)) return res.status(409).json({ message: "Boutique already exists" });

                await supabase.from("boutiques").update({ ...basePayload, password_hash: passwordHash }).eq("id", existingBoutique.id);

                if (req.file) {
                    const { publicUrl } = await uploadBufferToStorage({ folder: `boutiques/showcase/${existingBoutique.id}`, file: req.file });
                    await supabase.from("boutique_showcase").upsert([{ boutique_id: existingBoutique.id, area: loc.area, district: loc.district, tags: tags || null, image_url: publicUrl }], { onConflict: "boutique_id" });
                }

                const emailResult = await sendVerificationEmail(normalizedEmail, owner_name, verificationToken, "partner");
                const verificationUrl = `${FRONTEND_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(String(verificationToken))}&type=partner`;
                if (!emailResult?.success) {
                    console.error("[Auth] Verification email failed (partner resend):", normalizedEmail, emailResult?.error || emailResult);
                    return res.json({ success: true, message: "Account updated but verification email failed.", email_failed: true, email_error: emailResult?.error, verification_url: verificationUrl });
                }
                return res.json({ success: true, message: "Verification email resent.", email: { sent: true, messageId: emailResult?.messageId || null } });
            }

            const { data: inserted, error } = await supabase.from("boutiques").insert([{ ...basePayload, password_hash: passwordHash }]).select("id").maybeSingle();
            if (error) return res.status(500).json({ message: error.message });

            if (inserted?.id && req.file) {
                const { publicUrl } = await uploadBufferToStorage({ folder: `boutiques/showcase/${inserted.id}`, file: req.file });
                await supabase.from("boutique_showcase").upsert([{ boutique_id: inserted.id, area: loc.area, district: loc.district, tags: tags || null, image_url: publicUrl }], { onConflict: "boutique_id" });
            }

            const emailResult = await sendVerificationEmail(normalizedEmail, owner_name, verificationToken, "partner");

            const verificationUrl = `${FRONTEND_BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(String(verificationToken))}&type=partner`;
            if (!emailResult?.success) {
                console.error("[Auth] Verification email failed (partner signup):", normalizedEmail, emailResult?.error || emailResult);
                return res.status(201).json({ success: true, boutiqueId: inserted?.id, message: "Account created but verification email failed.", email_failed: true, email_error: emailResult?.error, verification_url: verificationUrl });
            }
            return res.status(201).json({ success: true, boutiqueId: inserted?.id, message: "Boutique account created.", email: { sent: true, messageId: emailResult?.messageId || null, is_test: emailResult.isTest, test_url: emailResult.testUrl } });
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

        const match = await bcrypt.compare(password, boutique.password_hash);
        if (!match && boutique.password) match = String(password) === String(boutique.password); // Fallback for old passwords

        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        return res.json({
            success: true,
            boutiqueId: boutique.id,
            boutiqueName: boutique.boutique_name,
            ownerName: boutique.owner_name,
            plan: boutique.plan || "early"
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
            email: user.email
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

/* ================= EMAIL STATUS (DEBUG) ================= */
exports.emailStatus = async (req, res) => {
    try {
        const status = typeof getEmailServiceStatus === "function" ? getEmailServiceStatus() : { configured: false };
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
            tags: showcase?.tags || "",
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

        await supabase.from("boutique_showcase").upsert([{
            boutique_id: Number(boutiqueId),
            district,
            area,
            tags
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
        return res.json(showcase || { boutique_id: Number(boutiqueId), district: "", area: "", tags: "", image_url: "" });
    } catch (err) {
        console.error("[getShowcase] Error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateShowcase = async (req, res) => {
    const { boutiqueId } = req.params;
    const { district, area, tags } = req.body;
    try {
        const { error } = await supabase.from("boutique_showcase").upsert([{
            boutique_id: Number(boutiqueId),
            district: district || null,
            area: area || null,
            tags: tags || null
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
            plan: boutique.plan || "early"
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
