const express = require("express");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const db = require("./db");

const showcaseStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
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
    return res.status(400).json({
      message: "Name, email and password are required"
    });
  }

  if (!email.toLowerCase().endsWith("@gmail.com")) {
    return res.status(400).json({
      message: "Only Gmail addresses are allowed"
    });
  }

  ensureUsersTable(async (tableErr) => {
    if (tableErr) {
      console.error("USERS TABLE ERROR:", tableErr);
      return res.status(500).json({ message: "Database setup error" });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `;

      db.query(query, [name, email, passwordHash], (err, result) => {
        if (err) {
          console.error("USER SIGNUP ERROR:", err); // 🔥 IMPORTANT
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              message: "User already exists"
            });
          }
          return res.status(500).json({
            message: "Database error"
          });
        }

        return res.status(201).json({
          success: true,
          role: "user",
          userId: result.insertId,
          name,
          email,
          message: "User account created successfully"
        });
      });
    } catch (err) {
      console.error("BCRYPT ERROR:", err);
      return res.status(500).json({ message: "Server error" });
    }
  });

  return; // ⛔ VERY IMPORTANT
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

    const query = `
      INSERT INTO boutiques
      (boutique_name, owner_name, email, phone, city, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
      query,
      [boutique_name, owner_name, email, phone, city, password],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Boutique already exists" });
          }
          console.error(err);
          return res.status(500).json({ message: "Database error" });
        }

        return res.json({
          success: true,
          role: "partner",
          message: "Boutique account created successfully"
        });
      }
    );
  }

  return res.status(400).json({ message: "Invalid account type" });
});


/* ================= LOGIN ================= */
router.post("/login", (req, res) => {
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

  const isEmail = lookupValue.includes("@");
  const query = isEmail
    ? "SELECT * FROM boutiques WHERE email = ? LIMIT 1"
    : "SELECT * FROM boutiques WHERE phone = ? LIMIT 1";

  db.query(query, [lookupValue], async (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const boutique = rows[0];

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

    res.json({
      success: true,
      boutiqueId: boutique.id,
      boutiqueName: boutique.boutique_name,
      ownerName: boutique.owner_name,
      plan: boutique.plan || "Basic"
    });
  });
});

router.post("/login-user", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  ensureUsersTable((tableErr) => {
    if (tableErr) {
      console.error("USERS TABLE ERROR:", tableErr);
      return res.status(500).json({ message: "Database setup error" });
    }

    const query = "SELECT id, name, email, password_hash, created_at FROM users WHERE email = ? LIMIT 1";

    db.query(query, [email.trim()], async (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      if (!rows.length) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = rows[0];
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
    });
  });
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
router.get("/profile/:boutiqueId", (req, res) => {
  const { boutiqueId } = req.params;

  const query = `
    SELECT
      id,
      boutique_name,
      owner_name,
      email,
      phone,
      city,
      COALESCE(NULLIF(plan, ''), 'Basic') AS plan
    FROM boutiques
    WHERE id = ?
    LIMIT 1
  `;

  db.query(query, [boutiqueId], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    if (!rows.length) {
      return res.status(404).json({ message: "Boutique not found" });
    }
    return res.json(rows[0]);
  });
});

router.put("/profile/:boutiqueId", (req, res) => {
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

  const query = `
    UPDATE boutiques
    SET boutique_name = ?, owner_name = ?, email = ?, phone = ?, city = ?
    WHERE id = ?
  `;

  db.query(query, [boutique_name, owner_name, email, phone, city, boutiqueId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
    if (!result.affectedRows) {
      return res.status(404).json({ message: "Boutique not found" });
    }
    return res.json({ success: true, message: "Profile updated successfully" });
  });
});

router.put("/profile/:boutiqueId/password", (req, res) => {
  const { boutiqueId } = req.params;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  if (String(newPassword).length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters" });
  }

  const getQuery = `SELECT password_hash FROM boutiques WHERE id = ? LIMIT 1`;
  db.query(getQuery, [boutiqueId], async (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    if (!rows.length) {
      return res.status(404).json({ message: "Boutique not found" });
    }

    const matches = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!matches) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const updateQuery = `UPDATE boutiques SET password_hash = ? WHERE id = ?`;
    db.query(updateQuery, [newHash, boutiqueId], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ message: "Failed to update password", error: updateErr.message });
      }
      return res.json({ success: true, message: "Password updated successfully" });
    });
  });
});

router.get("/profile/:boutiqueId/showcase", (req, res) => {
  const { boutiqueId } = req.params;
  ensureShowcaseTable((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare showcase table", error: tableErr.message });
    }

    const query = `
      SELECT
        s.boutique_id,
        s.district,
        s.area,
        s.tags,
        s.image_url,
        s.rating,
        b.boutique_name
      FROM boutiques b
      LEFT JOIN boutique_showcase s ON s.boutique_id = b.id
      WHERE b.id = ?
      LIMIT 1
    `;

    db.query(query, [boutiqueId], (err, rows) => {
      if (err) return res.status(500).json({ message: "Database error", error: err.message });
      if (!rows.length) return res.status(404).json({ message: "Boutique not found" });

      const row = rows[0];
      return res.json({
        boutique_id: Number(boutiqueId),
        district: row.district || "",
        area: row.area || "",
        tags: row.tags || "",
        image_url: row.image_url || "",
        rating: Number(row.rating || 5.0),
        boutique_name: row.boutique_name || ""
      });
    });
  });
});

router.put("/profile/:boutiqueId/showcase", (req, res) => {
  const { boutiqueId } = req.params;
  const { district, area, tags, rating } = req.body;

  ensureShowcaseTable((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare showcase table", error: tableErr.message });
    }

    const upsert = `
      INSERT INTO boutique_showcase (boutique_id, district, area, tags, rating)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        district = VALUES(district),
        area = VALUES(area),
        tags = VALUES(tags),
        rating = VALUES(rating)
    `;

    const safeRating = Number(rating) > 0 ? Number(rating) : 5.0;
    db.query(upsert, [boutiqueId, district || null, area || null, tags || null, safeRating], (err) => {
      if (err) return res.status(500).json({ message: "Failed to save showcase", error: err.message });
      return res.json({ success: true, message: "Showcase updated successfully" });
    });
  });
});

router.post("/profile/:boutiqueId/showcase", (req, res) => {
  const { boutiqueId } = req.params;
  const { district, area, tags, rating } = req.body;

  ensureShowcaseTable((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare showcase table", error: tableErr.message });
    }

    const upsert = `
      INSERT INTO boutique_showcase (boutique_id, district, area, tags, rating)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        district = VALUES(district),
        area = VALUES(area),
        tags = VALUES(tags),
        rating = VALUES(rating)
    `;

    const safeRating = Number(rating) > 0 ? Number(rating) : 5.0;
    db.query(upsert, [boutiqueId, district || null, area || null, tags || null, safeRating], (err) => {
      if (err) return res.status(500).json({ message: "Failed to save showcase", error: err.message });
      return res.json({ success: true, message: "Showcase updated successfully" });
    });
  });
});

router.post("/profile/:boutiqueId/showcase-image", showcaseUpload.single("image"), (req, res) => {
  const { boutiqueId } = req.params;
  if (!req.file) return res.status(400).json({ message: "Image file is required" });

  ensureShowcaseTable((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare showcase table", error: tableErr.message });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const query = `
      INSERT INTO boutique_showcase (boutique_id, image_url)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE image_url = VALUES(image_url)
    `;

    db.query(query, [boutiqueId, imageUrl], (err) => {
      if (err) return res.status(500).json({ message: "Failed to save image", error: err.message });
      return res.json({ success: true, image_url: imageUrl, message: "Showcase image uploaded" });
    });
  });
});

/* ================= BOUTIQUES LIST ================= */
router.get("/boutiques", (req, res) => {
  const city = (req.query.city || "").toString().trim();

  ensureShowcaseTable((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare showcase table", error: tableErr.message });
    }

    const baseQuery = `
      SELECT
        b.id,
        b.boutique_name,
        b.owner_name,
        b.email,
        b.phone,
        b.city,
        COALESCE(NULLIF(b.plan, ''), 'Basic') AS plan,
        s.district,
        s.area,
        s.tags,
        s.image_url,
        COALESCE(s.rating, 5.0) AS rating
      FROM boutiques b
      LEFT JOIN boutique_showcase s ON s.boutique_id = b.id
    `;

    const query = city
      ? `${baseQuery} WHERE LOWER(COALESCE(s.district, b.city)) = LOWER(?) ORDER BY b.boutique_name ASC`
      : `${baseQuery} ORDER BY b.boutique_name ASC`;

    const params = city ? [city] : [];
    db.query(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      return res.json(rows);
    });
  });
});


/* ================= DASHBOARD ================= */
router.get("/dashboard/:boutiqueId", (req, res) => {
  const { boutiqueId } = req.params;
  console.log(`[Dashboard] Request received for boutiqueId: ${boutiqueId}`);

  const query = `
    SELECT
      b.boutique_name,
      b.owner_name,
      COALESCE(NULLIF(b.plan, ''), 'Basic') AS plan,
      (SELECT COUNT(*) FROM leads l WHERE l.boutique_id = b.id) AS totalLeads,
      (
        SELECT COUNT(*)
        FROM messages m
        INNER JOIN conversations c ON c.id = m.conversation_id
        WHERE c.boutique_id = b.id AND m.sender_type = 'boutique'
      ) AS totalMessages,
      (SELECT COUNT(*) FROM products p WHERE p.boutique_id = b.id) AS totalProducts
    FROM boutiques b
    WHERE b.id = ?
    LIMIT 1
  `;

  db.query(query, [boutiqueId], (err, rows) => {
    if (err) {
      console.error("[Dashboard] Database error:", err);
      return res.status(500).json({ message: "DB error", error: err.message });
    }

    if (!rows.length) {
      console.warn(`[Dashboard] Boutique NOT found for ID: ${boutiqueId}`);
      return res.status(404).json({ message: "Boutique not found" });
    }

    console.log("[Dashboard] Data found:", rows[0]);
    res.json({
      boutiqueName: rows[0].boutique_name,
      ownerName: rows[0].owner_name,
      totalLeads: rows[0].totalLeads,
      leadsUsed: rows[0].totalLeads,
      messagesUsed: rows[0].totalMessages,
      productsUsed: rows[0].totalProducts,
      plan: rows[0].plan
    });
  });
});

router.get("/user/:userId", (req, res) => {
  const { userId } = req.params;

  ensureUsersTable((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare users table", error: tableErr.message });
    }

    const query = `
      SELECT
        id,
        name,
        email,
        created_at
      FROM users
      WHERE id = ?
      LIMIT 1
    `;

    db.query(query, [userId], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err.message });
      }
      if (!rows.length) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(rows[0]);
    });
  });
});

router.put("/user/:userId", (req, res) => {
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

  ensureUsersTable((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare users table", error: tableErr.message });
    }

    const query = `
      UPDATE users
      SET name = ?, email = ?
      WHERE id = ?
    `;

    db.query(query, [safeName, safeEmail, userId], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ message: "Email already in use" });
        }
        return res.status(500).json({ message: "Database error", error: err.message });
      }

      if (!result.affectedRows) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        success: true,
        userId: Number(userId),
        name: safeName,
        email: safeEmail,
        message: "Profile updated successfully"
      });
    });
  });
});
module.exports = router;


