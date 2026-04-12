const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("./db");
const supabase = require("./supabase");
const { sendVerificationEmail } = require("./emailService");
const { deleteStorageObjectByUrl, uploadBufferToStorage } = require("./storage");
const CLOUDINARY_CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const FRONTEND_BASE_URL = String(process.env.FRONTEND_BASE_URL || "https://cloche-backend.onrender.com").trim().replace(/\/+$/, "");

const normalizeImageUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || /^data:image\//i.test(raw)) return raw;

  // Determine cloud name - use env var first, fallback to known value
  const cloudName = CLOUDINARY_CLOUD_NAME || 'dycwsnzyd';

  // If it looks like a Cloudinary public ID or path, construct full URL
  if (!raw.includes("image/upload")) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${raw.replace(/^\/+/, "")}`;
  }

  return raw; // Already looks like a full URL
};

const cleanText = (value) => String(value || "").trim().replace(/\s+/g, " ");

const sameText = (a, b) => cleanText(a).toLowerCase() === cleanText(b).toLowerCase();

const splitCityParts = (cityValue) => {
  const city = cleanText(cityValue);
  if (!city.includes(",")) return [];
  return city.split(",").map((part) => cleanText(part)).filter(Boolean);
};

const normalizeLocationFields = ({ area, district, city }) => {
  const safeCity = cleanText(city);
  const cityParts = splitCityParts(safeCity);
  const cityArea = cityParts[0] || "";
  const cityDistrict = cityParts.slice(1).join(", ");

  let safeArea = cleanText(area);
  let safeDistrict = cleanText(district);

  if (!safeArea && cityParts.length > 1) safeArea = cityArea;
  if (!safeDistrict && cityDistrict) safeDistrict = cityDistrict;
  if (!safeDistrict && safeCity) safeDistrict = safeCity;

  if (safeArea && safeDistrict && sameText(safeArea, safeDistrict)) {
    safeArea = "";
  }

  return {
    area: safeArea || null,
    district: safeDistrict || null,
    city: safeCity || null
  };
};

const showcaseUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|webp/.test(path.extname(file.originalname).toLowerCase()) &&
      /image\/(jpeg|jpg|png|webp)/.test(file.mimetype);
    if (!ok) return cb(new Error("Only jpeg/jpg/png/webp images are allowed"));
    cb(null, true);
  }
});

const ensureShowcaseTable = (cb) => {
  const query = `
    CREATE TABLE IF NOT EXISTS boutique_showcase (
      id INT AUTO_INCREMENT PRIMARY KEY,
      boutique_id INT NOT NULL UNIQUE,
      district VARCHAR(100) DEFAULT NULL,
      area VARCHAR(255) DEFAULT NULL,
      tags VARCHAR(255) DEFAULT NULL,
      image_url VARCHAR(500) DEFAULT NULL,
      rating DECIMAL(2,1) DEFAULT 5.0,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  db.query(query, cb);
};

const ensureUsersTable = (cb) => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  db.query(query, cb);
};

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  const { account_type } = req.body;

  if (!account_type) {
    return res.status(400).json({ message: "Account type required" });
  }

  /* ================= USER SIGNUP ================= */
  if (account_type === "user") {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const verificationToken = uuidv4();

      // Check if user already exists
      const { data: existingUser, error: findError } = await supabase
        .from("users")
        .select("id, is_verified")
        .eq("email", email)
        .maybeSingle();

      if (existingUser) {
        if (existingUser.is_verified) {
          return res.status(409).json({ message: "User already exists" });
        } else {
          // Update unverified user and resend email
          const { error: updateError } = await supabase
            .from("users")
            .update({
              name,
              password_hash: passwordHash,
              verification_token: verificationToken,
              created_at: new Date().toISOString()
            })
            .eq("id", existingUser.id);

          if (updateError) {
            return res.status(500).json({ message: updateError.message });
          }

          sendVerificationEmail(email, name, verificationToken, "user"); // Removed 'await' to speed up response
          return res.status(200).json({
            success: true,
            message: "Verification email resent. Please check your inbox."
          });
        }
      }

      const { error } = await supabase
        .from("users")
        .insert([{ 
          name, 
          email, 
          password_hash: passwordHash,
          is_verified: false,
          verification_token: verificationToken
        }]);

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      // Send verification email asynchronously
      sendVerificationEmail(email, name, verificationToken, "user");

      return res.status(201).json({
        success: true,
        role: "user",
        message: "User account created. Please check your email for verification."
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }


  /* ================= PARTNER SIGNUP ================= */
  if (account_type === "partner") {
    const {
      boutique_name,
      owner_name,
      email,
      phone,
      city,
      password
    } = req.body;

    if (
      !boutique_name ||
      !owner_name ||
      !email ||
      !phone ||
      !city ||
      !password
    ) {
      return res
        .status(400)
        .json({ message: "All partner fields are required" });
    }
    try {
      const normalizedEmail = String(email).trim().toLowerCase();
      const normalizedPhone = String(phone).trim();

      // Check if mobile number exists
      const { data: existingPhone } = await supabase
        .from("boutiques")
        .select("id")
        .eq("phone", normalizedPhone)
        .maybeSingle();

      if (existingPhone) {
        return res.status(409).json({ message: "mobile number exists" });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const verificationToken = uuidv4();

      const normalizedLocation = normalizeLocationFields({ city });
      const basePayload = {
        boutique_name: String(boutique_name).trim(),
        owner_name: String(owner_name).trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        city: normalizedLocation.city || String(city).trim(),
        plan: "Basic",
        is_verified: false,
        verification_token: verificationToken
      };

      // Support both schema variants during migration:
      // newer tables may use password_hash, older ones may still have password.
      const payloadCandidates = [
        { ...basePayload, password_hash: passwordHash },
        { ...basePayload, password: password }
      ];

      let insertedBoutique = null;
      let insertError = null;

      // Check if boutique already exists by email
      const { data: existingBoutique, error: findError } = await supabase
        .from("boutiques")
        .select("id, is_verified")
        .eq("email", normalizedEmail)
        .maybeSingle();

      if (existingBoutique) {
        if (existingBoutique.is_verified) {
          return res.status(409).json({ message: "Boutique already exists" });
        } else {
          // Update unverified boutique and resend email
          const { error: updateError } = await supabase
            .from("boutiques")
            .update({
              ...basePayload,
              password_hash: passwordHash,
              verification_token: verificationToken
            })
            .eq("id", existingBoutique.id);

          if (updateError) {
            return res.status(500).json({ message: updateError.message });
          }

          if (normalizedLocation.area || normalizedLocation.district) {
            const { error: showcaseUpsertError } = await supabase
              .from("boutique_showcase")
              .upsert([{
                boutique_id: existingBoutique.id,
                area: normalizedLocation.area,
                district: normalizedLocation.district
              }], { onConflict: "boutique_id" });

            if (showcaseUpsertError) {
              console.warn("[SIGNUP] Failed to normalize showcase location (existing boutique):", showcaseUpsertError.message);
            }
          }

          sendVerificationEmail(normalizedEmail, owner_name, verificationToken, "partner"); // Non-blocking
          return res.status(200).json({
            success: true,
            message: "Verification email resent. Please check your inbox."
          });
        }
      }

      for (const payload of payloadCandidates) {
        const { data, error } = await supabase
          .from("boutiques")
          .insert([payload])
          .select("id")
          .maybeSingle();

        if (!error) {
          insertedBoutique = data;
          insertError = null;
          break;
        }

        insertError = error;
        if (error.code === "23505") {
          return res.status(409).json({ message: "Boutique already exists" });
        }
      }

      if (insertError) {
        return res.status(500).json({ message: insertError.message || "Database error" });
      }

      if (insertedBoutique?.id && (normalizedLocation.area || normalizedLocation.district)) {
        const { error: showcaseUpsertError } = await supabase
          .from("boutique_showcase")
          .upsert([{
            boutique_id: insertedBoutique.id,
            area: normalizedLocation.area,
            district: normalizedLocation.district
          }], { onConflict: "boutique_id" });

        if (showcaseUpsertError) {
          console.warn("[SIGNUP] Failed to normalize showcase location (new boutique):", showcaseUpsertError.message);
        }
      }

      // Send verification email asynchronously
      sendVerificationEmail(normalizedEmail, owner_name, verificationToken, "partner");

      return res.status(201).json({
        success: true,
        role: "partner",
        boutiqueId: insertedBoutique?.id || null,
        message: "Boutique account created. Please check your email for verification."
      });
    } catch (err) {
      return res.status(500).json({ message: err.message || "Server error" });
    }
  }

  return res.status(400).json({ message: "Invalid account type" });
});


/* ================= EMAIL VERIFICATION ================= */
router.get("/verify-email", async (req, res) => {
  const { token, type } = req.query;

  if (!token || !type) {
    return res.status(400).send("Verification details missing");
  }

  const table = type === "partner" ? "boutiques" : "users";

  try {
    const { data: record, error: findError } = await supabase
      .from(table)
      .select("id")
      .eq("verification_token", token)
      .maybeSingle();

    if (findError || !record) {
      return res.status(400).send("Invalid or expired verification link");
    }

    // Activate account
    const { error: updateError } = await supabase
      .from(table)
      .update({ is_verified: true, verification_token: null })
      .eq("id", record.id);

    if (updateError) {
      return res.status(500).send("Activation failed: " + updateError.message);
    }

    // Redirect to login page with success status (same page for both user and partner)
    const redirectUrl = `${FRONTEND_BASE_URL}/boutiquelogin.html?status=verified&verified=true&type=${encodeURIComponent(type)}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    return res.status(500).send("Server error during verification");
  }
});

/* ================= DEBUG EMAIL ENDPOINT ================= */
router.get("/debug-email", async (req, res) => {
  const testEmail = req.query.email || "shabanvp@gmail.com";
  console.log(`[Debug] Testing email to: ${testEmail}`);
  
  const results = {
    env_user: process.env.GMAIL_USER || "cloche.luxury@gmail.com (default)",
    env_password_exists: !!process.env.GMAIL_APP_PASSWORD,
    target_email: testEmail,
    timestamp: new Date().toISOString(),
  };

  try {
    const emailResult = await sendVerificationEmail(testEmail, "Debug User", "test-token", "debug");
    results.success = emailResult.success;
    results.error = emailResult.error || null;
    results.raw_error = emailResult.raw || null;
    
    if (emailResult.success) {
      return res.json({
        message: "SMTP connection successful! Email should be arriving.",
        details: results
      });
    } else {
      return res.status(500).json({
        message: "SMTP connection failed. See details.",
        details: results
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Crash during debug",
      error: err.message,
      details: results
    });
  }
});

router.post("/login", async (req, res) => {
  const { account_type, identifier, email, password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Email/phone and password required" });
  }

  if (account_type && account_type !== "partner") {
    return res.status(400).json({ message: "Invalid account type for this route" });
  }

  const lookupValue = String(email || identifier || "").trim();
  if (!lookupValue) {
    return res.status(400).json({ message: "Email/phone and password required" });
  }

  try {
    const isEmail = lookupValue.includes("@");
    const { data: boutique, error } = await supabase
      .from("boutiques")
      .select("*")
      .eq(isEmail ? "email" : "phone", isEmail ? lookupValue.toLowerCase() : lookupValue)
      .maybeSingle();

    if (error) {
      console.error("[PARTNER LOGIN] Supabase error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (!boutique) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (boutique.is_verified === false) {
      return res.status(403).json({ message: "📧 Please verify your email address first. Check your inbox for the verification link." });
    }

    let match = false;

    if (boutique.password_hash) {
      try {
        match = await bcrypt.compare(password, boutique.password_hash);
      } catch (compareErr) {
        console.warn("Partner password_hash compare failed:", compareErr.message);
      }
    }

    if (!match && boutique.password) {
      match = String(password) === String(boutique.password);
    }

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      success: true,
      boutiqueId: boutique.id,
      boutiqueName: boutique.boutique_name,
      ownerName: boutique.owner_name,
      plan: boutique.plan || "Basic"
    });
  } catch (err) {
    console.error("[PARTNER LOGIN] Unexpected error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const normalizedEmail = String(email).trim().toLowerCase();
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, password_hash, is_verified, created_at")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error("[USER LOGIN] Supabase error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.is_verified === false) {
      return res.status(403).json({ message: "📧 Please verify your email address first. Check your inbox for the verification link." });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({
      success: true,
      userId: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at
    });
  } catch (err) {
    console.error("[USER LOGIN] Unexpected error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});
/* ================= UPGRADE PLAN (POST PAYMENT) ================= */
router.post("/upgrade-plan", (req, res) => {
  const { boutiqueId, plan, billingCycle, paymentId } = req.body;

  if (!boutiqueId || !plan) {
    return res.status(400).json({ message: "boutiqueId and plan are required" });
  }

  const normalizedPlan = String(plan).trim().toLowerCase();
  const planMap = {
    basic: "Basic",
    professional: "Professional",
    premium: "Premium"
  };

  if (!planMap[normalizedPlan]) {
    return res.status(400).json({ message: "Invalid plan" });
  }

  const finalPlan = planMap[normalizedPlan];
  const updateQuery = `UPDATE boutiques SET plan = ? WHERE id = ?`;

  db.query(updateQuery, [finalPlan, boutiqueId], (err, result) => {
    if (err) {
      console.error("[Upgrade Plan] Database error:", err);
      return res.status(500).json({ message: "Failed to update subscription" });
    }

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    return res.json({
      success: true,
      message: "Subscription activated successfully",
      plan: finalPlan,
      billingCycle: billingCycle || "monthly",
      paymentId: paymentId || null
    });
  });
});

router.post("/update-plan", (req, res) => {
  const { boutiqueId, plan } = req.body;

  const query = `
    UPDATE boutiques
    SET plan = ?
    WHERE id = ?
  `;

  db.query(query, [plan, boutiqueId], (err) => {
    if (err) return res.status(500).json({ message: "DB error" });

    res.json({ success: true });
  });
});

/* ================= PROFILE ================= */
router.get("/profile/:boutiqueId", async (req, res) => {
  const { boutiqueId } = req.params;

  try {
    const [{ data: boutique, error }, { data: showcase, error: showcaseError }] = await Promise.all([
      supabase
      .from("boutiques")
      .select("id, boutique_name, owner_name, email, phone, city, plan, created_at")
      .eq("id", boutiqueId)
      .maybeSingle(),
      supabase
        .from("boutique_showcase")
        .select("district")
        .eq("boutique_id", boutiqueId)
        .maybeSingle()
    ]);

    if (error) {
      return res.status(500).json({ message: "Database error", error: error.message });
    }
    if (showcaseError && showcaseError.code !== "PGRST116") {
      return res.status(500).json({ message: "Database error", error: showcaseError.message });
    }
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    const safeCityRaw = cleanText(boutique.city);
    const cityParts = splitCityParts(safeCityRaw);
    const safeCity = cityParts.length ? cityParts[0] : safeCityRaw;
    const safeDistrict = cleanText(showcase?.district) || (cityParts.length > 1 ? cityParts.slice(1).join(", ") : "");

    return res.json({
      ...boutique,
      city: safeCity,
      district: safeDistrict,
      plan: boutique.plan || "Basic"
    });
  } catch (err) {
    console.error("[Dashboard] Unexpected error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, name, email, created_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: "Database error", error: error.message });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { name, email } = req.body;

  const safeName = String(name || "").trim();
  const safeEmail = String(email || "").trim().toLowerCase();

  if (!safeName || !safeEmail) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  if (!safeEmail.endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Only Gmail addresses are allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ name: safeName, email: safeEmail })
      .eq("id", userId)
      .select("id, name, email")
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ message: "Email already in use" });
      }
      return res.status(500).json({ message: "Database error", error: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      userId: data.id,
      name: data.name,
      email: data.email,
      message: "Profile updated successfully"
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/profile/:boutiqueId", async (req, res) => {
  const { boutiqueId } = req.params;
  const { boutique_name, owner_name, email, phone, city, district } = req.body;

  if (!boutique_name || !owner_name || !email || !phone || !city) {
    return res.status(400).json({ message: "All profile fields are required" });
  }

  if (!email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Only Gmail addresses are allowed" });
  }

  if (!/^\d{10}$/.test(String(phone))) {
    return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
  }

  const safeCity = cleanText(city);
  const safeDistrict = cleanText(district);
  const composedCity = safeDistrict ? `${safeCity}, ${safeDistrict}` : safeCity;

  try {
    const { data, error } = await supabase
      .from("boutiques")
      .update({
        boutique_name,
        owner_name,
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        city: composedCity
      })
      .eq("id", boutiqueId)
      .select("id")
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ message: "Email or phone already in use" });
      }
      return res.status(500).json({ message: "Failed to update profile", error: error.message });
    }
    if (!data) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    const { error: showcaseUpsertError } = await supabase
      .from("boutique_showcase")
      .upsert([{
        boutique_id: Number(boutiqueId),
        district: safeDistrict || null
      }], { onConflict: "boutique_id" });

    if (showcaseUpsertError) {
      console.warn("[PROFILE] Failed to sync district to showcase:", showcaseUpsertError.message);
    }

    return res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/profile/:boutiqueId/password", async (req, res) => {
  const { boutiqueId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  if (String(currentPassword) === String(newPassword)) {
    return res.status(400).json({ message: "New password must be different from current password" });
  }

  try {
    let hasLegacyPasswordColumn = true;
    let { data: boutique, error: getErr } = await supabase
      .from("boutiques")
      .select("id, password_hash, password")
      .eq("id", boutiqueId)
      .maybeSingle();

    if (getErr && /column .*password.* does not exist/i.test(String(getErr.message || ""))) {
      hasLegacyPasswordColumn = false;
      const fallback = await supabase
        .from("boutiques")
        .select("id, password_hash")
        .eq("id", boutiqueId)
        .maybeSingle();
      boutique = fallback.data;
      getErr = fallback.error;
    }

    if (getErr) {
      return res.status(500).json({ message: "Database error", error: getErr.message });
    }
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    let matches = false;
    if (boutique.password_hash) {
      try {
        matches = await bcrypt.compare(currentPassword, boutique.password_hash);
      } catch (compareErr) {
        console.warn("[PROFILE PASSWORD] bcrypt compare failed:", compareErr.message);
      }
    } else if (boutique.password) {
      matches = String(currentPassword) === String(boutique.password);
    }

    if (!matches && hasLegacyPasswordColumn && boutique.password) {
      matches = String(currentPassword) === String(boutique.password);
    }

    if (!matches) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    let { error: updateErr } = await supabase
      .from("boutiques")
      .update({ password_hash: newHash })
      .eq("id", boutiqueId);

    if (updateErr && /column .*password_hash.* does not exist/i.test(String(updateErr.message || ""))) {
      const legacy = await supabase
        .from("boutiques")
        .update({ password: String(newPassword) })
        .eq("id", boutiqueId);
      updateErr = legacy.error;
    }

    if (updateErr) {
      return res.status(500).json({ message: "Failed to update password", error: updateErr.message });
    }

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/profile/:boutiqueId/showcase", async (req, res) => {
  const { boutiqueId } = req.params;
  try {
    const [{ data: boutique, error: bErr }, { data: showcase, error: sErr }] = await Promise.all([
      supabase.from("boutiques").select("id, boutique_name").eq("id", boutiqueId).maybeSingle(),
      supabase
        .from("boutique_showcase")
        .select("boutique_id, district, area, tags, image_url, rating")
        .eq("boutique_id", boutiqueId)
        .maybeSingle()
    ]);

    if (bErr) return res.status(500).json({ message: "Database error", error: bErr.message });
    if (sErr && sErr.code !== "PGRST116") {
      return res.status(500).json({ message: "Database error", error: sErr.message });
    }
    if (!boutique) return res.status(404).json({ message: "Boutique not found" });

    return res.json({
      boutique_id: Number(boutiqueId),
      district: showcase?.district || "",
      area: showcase?.area || "",
      tags: showcase?.tags || "",
      image_url: showcase?.image_url || "",
      rating: Number(showcase?.rating || 5.0),
      boutique_name: boutique.boutique_name || ""
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/profile/:boutiqueId/showcase", async (req, res) => {
  const { boutiqueId } = req.params;
  const { district, area, tags, rating } = req.body;
  try {
    const safeRating = Number(rating) > 0 ? Number(rating) : 5.0;
    const { data: existing, error: eErr } = await supabase
      .from("boutique_showcase")
      .select("boutique_id")
      .eq("boutique_id", boutiqueId)
      .maybeSingle();
    if (eErr && eErr.code !== "PGRST116") {
      return res.status(500).json({ message: "Failed to save showcase", error: eErr.message });
    }

    let saveErr = null;
    if (existing) {
      const { error } = await supabase
        .from("boutique_showcase")
        .update({
          district: district || null,
          area: area || null,
          tags: tags || null,
          rating: safeRating
        })
        .eq("boutique_id", boutiqueId);
      saveErr = error;
    } else {
      const { error } = await supabase.from("boutique_showcase").insert([
        {
          boutique_id: Number(boutiqueId),
          district: district || null,
          area: area || null,
          tags: tags || null,
          rating: safeRating
        }
      ]);
      saveErr = error;
    }

    if (saveErr) {
      return res.status(500).json({ message: "Failed to save showcase", error: saveErr.message });
    }
    return res.json({ success: true, message: "Showcase updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/profile/:boutiqueId/showcase", async (req, res) => {
  const { boutiqueId } = req.params;
  const { district, area, tags, rating } = req.body;
  try {
    const safeRating = Number(rating) > 0 ? Number(rating) : 5.0;
    const { data: existing, error: eErr } = await supabase
      .from("boutique_showcase")
      .select("boutique_id")
      .eq("boutique_id", boutiqueId)
      .maybeSingle();
    if (eErr && eErr.code !== "PGRST116") {
      return res.status(500).json({ message: "Failed to save showcase", error: eErr.message });
    }

    let saveErr = null;
    if (existing) {
      const { error } = await supabase
        .from("boutique_showcase")
        .update({
          district: district || null,
          area: area || null,
          tags: tags || null,
          rating: safeRating
        })
        .eq("boutique_id", boutiqueId);
      saveErr = error;
    } else {
      const { error } = await supabase.from("boutique_showcase").insert([
        {
          boutique_id: Number(boutiqueId),
          district: district || null,
          area: area || null,
          tags: tags || null,
          rating: safeRating
        }
      ]);
      saveErr = error;
    }

    if (saveErr) {
      return res.status(500).json({ message: "Failed to save showcase", error: saveErr.message });
    }
    return res.json({ success: true, message: "Showcase updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/profile/:boutiqueId/showcase-image", showcaseUpload.single("image"), async (req, res) => {
  const { boutiqueId } = req.params;
  let imageUrl = req.body.imageUrl || "";

  console.log("\n[SHOWCASE-IMAGE POST] Request received");
  console.log("[SHOWCASE-IMAGE POST] boutiqueId:", boutiqueId);
  console.log("[SHOWCASE-IMAGE POST] File present:", !!req.file);
  if (req.file) console.log("[SHOWCASE-IMAGE POST] File info:", { name: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype });

  if (!req.file && !imageUrl) return res.status(400).json({ message: "Image file or imageUrl is required" });

  try {
    if (req.file) {
      console.log("[SHOWCASE-IMAGE POST] Uploading file to storage...");
      const uploaded = await uploadBufferToStorage({
        folder: `showcase/${boutiqueId}`,
        file: req.file
      });
      imageUrl = uploaded.publicUrl || uploaded.objectPath || uploaded.publicId || "";
      console.log("[SHOWCASE-IMAGE POST] Upload successful. imageUrl:", imageUrl);
    }

    imageUrl = normalizeImageUrl(imageUrl);
    if (!imageUrl) {
      console.log("[SHOWCASE-IMAGE POST] Image URL normalization failed.");
      return res.status(500).json({ message: "Failed to resolve image URL" });
    }

    console.log("[SHOWCASE-IMAGE POST] Checking for existing showcase record...");
    const { data: existing, error: eErr } = await supabase
      .from("boutique_showcase")
      .select("boutique_id, image_url")
      .eq("boutique_id", boutiqueId)
      .maybeSingle();

    if (eErr && eErr.code !== "PGRST116") {
      console.log("[SHOWCASE-IMAGE POST] Query error:", eErr);
      return res.status(500).json({ message: "Failed to save image", error: eErr.message });
    }

    console.log("[SHOWCASE-IMAGE POST] Existing record found:", !!existing);
    if (existing) console.log("[SHOWCASE-IMAGE POST] Existing image_url:", existing.image_url);

    let saveErr = null;
    if (existing) {
      console.log("[SHOWCASE-IMAGE POST] Updating existing record...");
      const { error } = await supabase
        .from("boutique_showcase")
        .update({ image_url: imageUrl })
        .eq("boutique_id", boutiqueId);
      saveErr = error;
    } else {
      console.log("[SHOWCASE-IMAGE POST] Inserting new record. boutique_id:", Number(boutiqueId), "image_url:", imageUrl);
      const { error } = await supabase
        .from("boutique_showcase")
        .insert([{ boutique_id: Number(boutiqueId), image_url: imageUrl }]);
      saveErr = error;
    }

    if (saveErr) {
      console.log("[SHOWCASE-IMAGE POST] Save error:", saveErr);
      return res.status(500).json({ message: "Failed to save image", error: saveErr.message });
    }

    console.log("[SHOWCASE-IMAGE POST] Database save successful!");

    if (existing?.image_url && existing.image_url !== imageUrl) {
      await deleteStorageObjectByUrl(existing.image_url);
    }
    console.log("[SHOWCASE-IMAGE POST] Returning response. image_url:", imageUrl);
    return res.json({ success: true, image_url: imageUrl, message: "Showcase image uploaded" });
  } catch (err) {
    console.log("[SHOWCASE-IMAGE POST] Catch error:", err.message);
    if (imageUrl) {
      await deleteStorageObjectByUrl(imageUrl);
    }
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= BOUTIQUES LIST ================= */
router.get("/boutiques", async (req, res) => {
  const city = String(req.query.city || "").trim().toLowerCase();
  const requestedLimit = Number.parseInt(String(req.query.limit || ""), 10);
  const limit = Number.isFinite(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 100)
    : null;

  try {
    let boutiqueQuery = supabase
      .from("boutiques")
      .select("id, boutique_name, owner_name, email, phone, city, plan")
      .order("boutique_name", { ascending: true });

    if (!city && limit) {
      boutiqueQuery = boutiqueQuery.limit(limit);
    }

    const { data: boutiques, error: boutiqueError } = await boutiqueQuery;

    if (boutiqueError) {
      console.error("[BOUTIQUES] Error fetching boutiques:", boutiqueError.message);
      return res.status(500).json({ message: "Database error", error: boutiqueError.message });
    }

    const boutiqueList = Array.isArray(boutiques) ? boutiques : [];
    console.log(`[BOUTIQUES] Found ${boutiqueList.length} boutiques`);

    const boutiqueIds = boutiqueList.map((b) => b.id).filter(Boolean);
    let showcaseByBoutiqueId = new Map();
    if (boutiqueIds.length) {
      const { data: showcaseRows, error: showcaseError } = await supabase
        .from("boutique_showcase")
        .select("id, boutique_id, district, area, tags, image_url, rating")
        .in("boutique_id", boutiqueIds)
        .order("id", { ascending: false });

      if (showcaseError) {
        console.warn("[BOUTIQUES] Showcase batch query error:", showcaseError.message);
      } else if (Array.isArray(showcaseRows)) {
        showcaseByBoutiqueId = showcaseRows.reduce((acc, row) => {
          if (!row || !row.boutique_id) return acc;
          const key = row.boutique_id;
          const existing = acc.get(key);
          if (!existing) {
            acc.set(key, row);
            return acc;
          }
          if (!existing.image_url && row.image_url) {
            acc.set(key, row);
          }
          return acc;
        }, new Map());
      }
    }

    const merged = boutiqueList.map((b) => {
      const showcase = showcaseByBoutiqueId.get(b.id) || {};
      const normalizedLocation = normalizeLocationFields({
        city: b.city,
        district: showcase.district,
        area: showcase.area
      });

      const rawImageUrl = showcase.image_url || null;
      const normalizedImageUrl = normalizeImageUrl(rawImageUrl);

      return {
        id: b.id,
        boutique_name: b.boutique_name,
        owner_name: b.owner_name,
        email: b.email,
        phone: b.phone,
        city: normalizedLocation.city,
        plan: b.plan || "Basic",
        district: normalizedLocation.district,
        area: normalizedLocation.area,
        tags: showcase.tags || null,
        image_url: normalizedImageUrl,
        rating: Number(showcase.rating || 5.0)
      };
    });

    let filtered = city
      ? merged.filter((row) => String(row.district || row.city || "").trim().toLowerCase() === city)
      : merged;

    if (city && limit) {
      filtered = filtered.slice(0, limit);
    }

    return res.json(filtered);
  } catch (err) {
    console.error("[BOUTIQUES] Unexpected error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});



router.get("/cloudinary-config", (req, res) => {
  return res.json({ cloudName: CLOUDINARY_CLOUD_NAME || "" });
});


/* ================= DASHBOARD ================= */
router.get("/dashboard/:boutiqueId", async (req, res) => {
  const { boutiqueId } = req.params;
  console.log(`[Dashboard] Request received for boutiqueId: ${boutiqueId}`);

  try {
    const { data: boutique, error: boutiqueError } = await supabase
      .from("boutiques")
      .select("id, boutique_name, owner_name, plan")
      .eq("id", boutiqueId)
      .maybeSingle();

    if (boutiqueError) {
      console.error("[Dashboard] Boutique query error:", boutiqueError);
      return res.status(500).json({ message: "DB error", error: boutiqueError.message });
    }

    if (!boutique) {
      console.warn(`[Dashboard] Boutique NOT found for ID: ${boutiqueId}`);
      return res.status(404).json({ message: "Boutique not found" });
    }

    let totalLeads = 0;
    let totalMessages = 0;
    let totalProducts = 0;

    const { count: leadsCount, error: leadsError } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("boutique_id", boutiqueId);
    if (!leadsError) totalLeads = Number(leadsCount || 0);

    const { count: productsCount, error: productsError } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("boutique_id", boutiqueId);
    if (!productsError) totalProducts = Number(productsCount || 0);

    const { data: conversations, error: convError } = await supabase
      .from("conversations")
      .select("id")
      .eq("boutique_id", boutiqueId);
    if (!convError && Array.isArray(conversations) && conversations.length) {
      const ids = conversations.map((c) => c.id);
      const { count: msgCount, error: msgError } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .in("conversation_id", ids)
        .eq("sender_type", "boutique");
      if (!msgError) totalMessages = Number(msgCount || 0);
    }

    return res.json({
      boutiqueName: boutique.boutique_name,
      ownerName: boutique.owner_name,
      totalLeads,
      leadsUsed: totalLeads,
      messagesUsed: totalMessages,
      productsUsed: totalProducts,
      plan: boutique.plan || "Basic"
  const safeEmail = String(email || "").trim().toLowerCase();

  if (!safeName || !safeEmail) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  if (!safeEmail.endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Only Gmail addresses are allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ name: safeName, email: safeEmail })
      .eq("id", userId)
      .select("id, name, email")
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        return res.status(409).json({ message: "Email already in use" });
      }
      return res.status(500).json({ message: "Database error", error: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      success: true,
      userId: data.id,
      name: data.name,
      email: data.email,
      message: "Profile updated successfully"
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});
module.exports = router;
