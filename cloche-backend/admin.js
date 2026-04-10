const express = require("express");
const router = express.Router();
const supabase = require("./supabase");

// Admin credentials - Hardcoded for internal use as agreed
const ADMIN_USER = process.env.ADMIN_EMAIL || "admin@cloche.com";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";

/**
 * @route   POST /api/admin/login
 * @desc    Admin login
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({
      success: true,
      message: "Admin login successful",
      token: "admin-session-secure-token" // In a real app, use JWT
    });
  }

  return res.status(401).json({ success: false, message: "Invalid admin credentials" });
});

/**
 * @route   GET /api/admin/analytics
 * @desc    Get platform metrics and recent registrations
 */
router.get("/analytics", async (req, res) => {
  try {
    // 1. Fetch counts
    const { count: userCount, error: userErr } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: boutiqueCount, error: boutiqueErr } = await supabase
      .from("boutiques")
      .select("*", { count: "exact", head: true });

    const { count: productCount, error: productErr } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (userErr || boutiqueErr || productErr) {
      throw new Error("Error fetching counts");
    }

    // 2. Fetch recent users
    const { data: recentUsers, error: recUserErr } = await supabase
      .from("users")
      .select("id, name, email, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    // 3. Fetch recent boutiques
    const { data: recentBoutiques, error: recBoutErr } = await supabase
      .from("boutiques")
      .select("id, boutique_name, owner_name, email, phone, city, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    res.json({
      success: true,
      metrics: {
        totalUsers: userCount || 0,
        totalBoutiques: boutiqueCount || 0,
        totalProducts: productCount || 0
      },
      recentUsers: recentUsers || [],
      recentBoutiques: recentBoutiques || []
    });
  } catch (err) {
    console.error("Admin Analytics Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
