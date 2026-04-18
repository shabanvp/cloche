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
                if (existingUser.is_verified) return res.status(409).json({ message: "User already exists" });
                await supabase.from("users").update({ name, password_hash: passwordHash, verification_token: verificationToken }).eq("id", existingUser.id);
                const emailResult = await sendVerificationEmail(email, name, verificationToken, "user");
                if (!emailResult?.success) {
                    console.error("[Auth] Verification email failed (user resend):", email, emailResult?.error || emailResult);
                    return res.status(503).json({ message: emailResult?.error || "Failed to send verification email. Please try again." });
                }
                return res.json({ success: true, message: "Verification email resent.", email: { sent: true, messageId: emailResult?.messageId || null } });
            }

            const { error } = await supabase.from("users").insert([{ name, email, password_hash: passwordHash, is_verified: false, verification_token: verificationToken }]);
            if (error) return res.status(500).json({ message: error.message });

            const emailResult = await sendVerificationEmail(email, name, verificationToken, "user");
            if (!emailResult?.success) {
                console.error("[Auth] Verification email failed (user signup):", email, emailResult?.error || emailResult);
                return res.status(503).json({ message: emailResult?.error || "Failed to send verification email. Please try again." });
            }
            return res.status(201).json({ success: true, message: "User account created. Check your email.", email: { sent: true, messageId: emailResult?.messageId || null } });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    if (account_type === "partner") {
        const { boutique_name, owner_name, email, phone, city, area, district, password } = req.body;
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
                if (existingBoutique.is_verified) return res.status(409).json({ message: "Boutique already exists" });
                
                await supabase.from("boutiques").update({ ...basePayload, password_hash: passwordHash }).eq("id", existingBoutique.id);
                
                if (req.file) {
                    const { publicUrl } = await uploadBufferToStorage({ folder: `boutiques/showcase/${existingBoutique.id}`, file: req.file });
                    await supabase.from("boutique_showcase").upsert([{ boutique_id: existingBoutique.id, area: loc.area, district: loc.district, image_url: publicUrl }], { onConflict: "boutique_id" });
                }

                const emailResult = await sendVerificationEmail(normalizedEmail, owner_name, verificationToken, "partner");
                if (!emailResult?.success) {
                    console.error("[Auth] Verification email failed (partner resend):", normalizedEmail, emailResult?.error || emailResult);
                    return res.status(503).json({ message: emailResult?.error || "Failed to send verification email. Please try again." });
                }
                return res.json({ success: true, message: "Verification email resent.", email: { sent: true, messageId: emailResult?.messageId || null } });
            }

            const { data: inserted, error } = await supabase.from("boutiques").insert([{ ...basePayload, password_hash: passwordHash }]).select("id").maybeSingle();
            if (error) return res.status(500).json({ message: error.message });

            if (inserted?.id && req.file) {
                const { publicUrl } = await uploadBufferToStorage({ folder: `boutiques/showcase/${inserted.id}`, file: req.file });
                await supabase.from("boutique_showcase").upsert([{ boutique_id: inserted.id, area: loc.area, district: loc.district, image_url: publicUrl }], { onConflict: "boutique_id" });
            }

            const emailResult = await sendVerificationEmail(normalizedEmail, owner_name, verificationToken, "partner");
            if (!emailResult?.success) {
                console.error("[Auth] Verification email failed (partner signup):", normalizedEmail, emailResult?.error || emailResult);
                return res.status(503).json({ message: emailResult?.error || "Failed to send verification email. Please try again." });
            }
            return res.status(201).json({ success: true, boutiqueId: inserted?.id, message: "Boutique account created.", email: { sent: true, messageId: emailResult?.messageId || null } });
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
        if (!boutique.is_verified) return res.status(403).json({ message: "Please verify email first." });

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
        if (!user.is_verified) return res.status(403).json({ message: "Please verify email first." });

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
        const [{ data: boutique }, { data: showcase }] = await Promise.all([
            supabase.from("boutiques").select("*").eq("id", boutiqueId).maybeSingle(),
            supabase.from("boutique_showcase").select("district, area, image_url").eq("boutique_id", boutiqueId).maybeSingle()
        ]);

        if (!boutique) return res.status(404).json({ message: "Not found" });
        
        return res.json({
            ...boutique,
            district: showcase?.district || "",
            area: showcase?.area || "",
            showcase_image: normalizeImageUrl(showcase?.image_url)
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    const { boutiqueId } = req.params;
    const { boutique_name, owner_name, email, phone, city, district, area } = req.body;
    
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
            area
        }], { onConflict: "boutique_id" });

        return res.json({ success: true, message: "Profile updated" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};

/* ================= DASHBOARD ================= */
exports.getDashboard = async (req, res) => {
    const { boutiqueId } = req.params;
    try {
        const { data: boutique, error } = await supabase.from("boutiques").select("*").eq("id", boutiqueId).maybeSingle();
        if (error || !boutique) return res.status(404).json({ message: "Boutique not found" });

        const [leads, products] = await Promise.all([
            supabase.from("leads").select("*", { count: "exact", head: true }).eq("boutique_id", boutiqueId),
            supabase.from("products").select("*", { count: "exact", head: true }).eq("boutique_id", boutiqueId)
        ]);

        return res.json({
            boutiqueName: boutique.boutique_name,
            ownerName: boutique.owner_name,
            totalLeads: leads.count || 0,
            leadsUsed: boutique.leads_used || 0,
            productsUsed: boutique.product_count || products.count || 0,
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
