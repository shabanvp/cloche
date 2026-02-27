const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const db = require("./db");
const supabase = require("./supabase");

const ensureUploadsDir = () => {
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  return uploadDir;
};

const showcaseStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, ensureUploadsDir()),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `showcase-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const showcaseUpload = multer({
  storage: showcaseStorage,
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

      const { error } = await supabase
        .from("users")
        .insert([{ name, email, password_hash: passwordHash }]);

      if (error) {
        if (error.code === "23505") {
          return res.status(409).json({ message: "User already exists" });
        }
        return res.status(500).json({ message: error.message });
      }

      return res.status(201).json({
        success: true,
        role: "user",
        message: "User account created successfully"
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
      const passwordHash = await bcrypt.hash(password, 10);

      const basePayload = {
        boutique_name: String(boutique_name).trim(),
        owner_name: String(owner_name).trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        city: String(city).trim(),
        plan: "Basic"
      };

      // Support both schema variants during migration:
      // newer tables may use password_hash, older ones may still have password.
      const payloadCandidates = [
        { ...basePayload, password_hash: passwordHash },
        { ...basePayload, password: password }
      ];

      let insertedBoutique = null;
      let insertError = null;

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

      return res.status(201).json({
        success: true,
        role: "partner",
        boutiqueId: insertedBoutique?.id || null,
        message: "Boutique account created successfully"
      });
    } catch (err) {
      return res.status(500).json({ message: err.message || "Server error" });
    }
  }

  return res.status(400).json({ message: "Invalid account type" });
});


/* ================= LOGIN ================= */
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
      .select("id, name, email, password_hash, created_at")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error) {
      console.error("[USER LOGIN] Supabase error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
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
    const { data: boutique, error } = await supabase
      .from("boutiques")
      .select("id, boutique_name, owner_name, email, phone, city, plan")
      .eq("id", boutiqueId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ message: "Database error", error: error.message });
    }
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }
    return res.json({
      ...boutique,
      plan: boutique.plan || "Basic"
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/profile/:boutiqueId", async (req, res) => {
  const { boutiqueId } = req.params;
  const { boutique_name, owner_name, email, phone, city } = req.body;

  if (!boutique_name || !owner_name || !email || !phone || !city) {
    return res.status(400).json({ message: "All profile fields are required" });
  }

  if (!email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Only Gmail addresses are allowed" });
  }

  if (!/^\d{10}$/.test(String(phone))) {
    return res.status(400).json({ message: "Phone number must be exactly 10 digits" });
  }

  try {
    const { data, error } = await supabase
      .from("boutiques")
      .update({
        boutique_name,
        owner_name,
        email: String(email).trim().toLowerCase(),
        phone: String(phone).trim(),
        city
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

  try {
    const { data: boutique, error: getErr } = await supabase
      .from("boutiques")
      .select("id, password_hash, password")
      .eq("id", boutiqueId)
      .maybeSingle();

    if (getErr) {
      return res.status(500).json({ message: "Database error", error: getErr.message });
    }
    if (!boutique) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    let matches = false;
    if (boutique.password_hash) {
      matches = await bcrypt.compare(currentPassword, boutique.password_hash);
    } else if (boutique.password) {
      matches = String(currentPassword) === String(boutique.password);
    }
    if (!matches) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const { error: updateErr } = await supabase
      .from("boutiques")
      .update({ password_hash: newHash })
      .eq("id", boutiqueId);

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
  if (!req.file) return res.status(400).json({ message: "Image file is required" });
  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    const { data: existing, error: eErr } = await supabase
      .from("boutique_showcase")
      .select("boutique_id")
      .eq("boutique_id", boutiqueId)
      .maybeSingle();
    if (eErr && eErr.code !== "PGRST116") {
      return res.status(500).json({ message: "Failed to save image", error: eErr.message });
    }

    let saveErr = null;
    if (existing) {
      const { error } = await supabase
        .from("boutique_showcase")
        .update({ image_url: imageUrl })
        .eq("boutique_id", boutiqueId);
      saveErr = error;
    } else {
      const { error } = await supabase
        .from("boutique_showcase")
        .insert([{ boutique_id: Number(boutiqueId), image_url: imageUrl }]);
      saveErr = error;
    }
    if (saveErr) {
      return res.status(500).json({ message: "Failed to save image", error: saveErr.message });
    }
    return res.json({ success: true, image_url: imageUrl, message: "Showcase image uploaded" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= BOUTIQUES LIST ================= */
router.get("/boutiques", async (req, res) => {
  const city = String(req.query.city || "").trim().toLowerCase();

  try {
    const { data: boutiques, error: boutiqueError } = await supabase
      .from("boutiques")
      .select("id, boutique_name, owner_name, email, phone, city, plan")
      .order("boutique_name", { ascending: true });

    if (boutiqueError) {
      return res.status(500).json({ message: "Database error", error: boutiqueError.message });
    }

    let showcaseByBoutiqueId = {};
    const { data: showcases, error: showcaseError } = await supabase
      .from("boutique_showcase")
      .select("boutique_id, district, area, tags, image_url, rating");

    if (!showcaseError && Array.isArray(showcases)) {
      showcaseByBoutiqueId = showcases.reduce((acc, row) => {
        acc[row.boutique_id] = row;
        return acc;
      }, {});
    } else if (showcaseError) {
      console.warn("[BOUTIQUES] showcase read skipped:", showcaseError.message);
    }

    const merged = (boutiques || []).map((b) => {
      const s = showcaseByBoutiqueId[b.id] || {};
      return {
        id: b.id,
        boutique_name: b.boutique_name,
        owner_name: b.owner_name,
        email: b.email,
        phone: b.phone,
        city: b.city,
        plan: b.plan || "Basic",
        district: s.district || null,
        area: s.area || null,
        tags: s.tags || null,
        image_url: s.image_url || null,
        rating: Number(s.rating || 5.0)
      };
    });

    const filtered = city
      ? merged.filter((row) => String(row.district || row.city || "").trim().toLowerCase() === city)
      : merged;

    return res.json(filtered);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
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
module.exports = router;
