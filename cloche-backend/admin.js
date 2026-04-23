const express = require("express");
const router = express.Router();
const supabase = require("./supabase");
const { deleteStorageObjectByUrl } = require("./storage");

// Admin credentials - Hardcoded for internal use as agreed
const ADMIN_USER = process.env.ADMIN_EMAIL || "admin@cloche.com";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "admin-session-secure-token";

const getBearerToken = (req) => {
  const raw = String(req.headers.authorization || "").trim();
  if (!raw) return "";
  const match = raw.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
};

const requireAdmin = (req, res, next) => {
  const token = getBearerToken(req) || String(req.headers["x-admin-token"] || "").trim();
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

const isMissingTableError = (error) => {
  const msg = String(error?.message || "");
  return /relation .* does not exist/i.test(msg) || /table .* does not exist/i.test(msg);
};

const addSixMonthsUtc = (value) => {
  if (!value) return null;
  const start = new Date(value);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 6);
  return end;
};

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
      token: ADMIN_TOKEN // In a real app, use JWT
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
      .select("id, boutique_name, owner_name, email, phone, city, created_at, plan, start_date")
      .order("created_at", { ascending: false })
      .limit(10);

    const nowTs = Date.now();
    const hydratedBoutiques = (recentBoutiques || []).map((b) => {
      const subscriptionStartDate = b.start_date || b.created_at || null;
      const introEnd = addSixMonthsUtc(subscriptionStartDate);
      const introUnlimited = Boolean(introEnd && nowTs < introEnd.getTime());
      return {
        ...b,
        subscriptionStartDate,
        introUnlimited,
        introEndsAt: introEnd ? introEnd.toISOString() : null
      };
    });

    res.json({
      success: true,
      metrics: {
        totalUsers: userCount || 0,
        totalBoutiques: boutiqueCount || 0,
        totalProducts: productCount || 0
      },
      recentUsers: recentUsers || [],
      recentBoutiques: hydratedBoutiques
    });
  } catch (err) {
    console.error("Admin Analytics Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @route   DELETE /api/admin/boutiques/:boutiqueId
 * @desc    Permanently remove a boutique and its related data
 */
router.delete("/boutiques/:boutiqueId", requireAdmin, async (req, res) => {
  const boutiqueId = Number(req.params.boutiqueId);
  if (!Number.isFinite(boutiqueId) || boutiqueId <= 0) {
    return res.status(400).json({ success: false, message: "Invalid boutique id" });
  }

  try {
    const { data: boutique, error: boutiqueErr } = await supabase
      .from("boutiques")
      .select("id, boutique_name, email")
      .eq("id", boutiqueId)
      .maybeSingle();

    if (boutiqueErr) throw boutiqueErr;
    if (!boutique) {
      return res.status(404).json({ success: false, message: "Boutique not found" });
    }

    const { data: showcase } = await supabase
      .from("boutique_showcase")
      .select("image_url")
      .eq("boutique_id", boutiqueId)
      .maybeSingle();

    const { data: products } = await supabase
      .from("products")
      .select("id, image_url")
      .eq("boutique_id", boutiqueId);

    const productIds = Array.isArray(products) ? products.map((p) => p?.id).filter(Boolean) : [];

    let galleryImages = [];
    if (productIds.length) {
      const { data: gallery, error: galleryErr } = await supabase
        .from("product_images")
        .select("image_url")
        .in("product_id", productIds);

      if (galleryErr && !isMissingTableError(galleryErr)) throw galleryErr;
      galleryImages = Array.isArray(gallery) ? gallery.map((g) => g?.image_url).filter(Boolean) : [];
    }

    let conversationIds = [];
    const { data: conversations, error: convErr } = await supabase
      .from("conversations")
      .select("id")
      .eq("boutique_id", boutiqueId);
    if (convErr && !isMissingTableError(convErr)) throw convErr;
    conversationIds = Array.isArray(conversations) ? conversations.map((c) => c?.id).filter(Boolean) : [];

    const assetUrls = [
      showcase?.image_url,
      ...(Array.isArray(products) ? products.map((p) => p?.image_url) : []),
      ...galleryImages
    ].filter(Boolean);

    // Best-effort asset deletion (won't block DB cleanup)
    const uniqueUrls = [...new Set(assetUrls.map((u) => String(u).trim()).filter(Boolean))];
    await Promise.allSettled(uniqueUrls.map((url) => deleteStorageObjectByUrl(url)));

    // Delete dependent rows first (best-effort when tables might not exist)
    if (conversationIds.length) {
      const { error: msgDelErr } = await supabase.from("messages").delete().in("conversation_id", conversationIds);
      if (msgDelErr && !isMissingTableError(msgDelErr)) throw msgDelErr;
    }

    {
      const { error: convDelErr } = await supabase.from("conversations").delete().eq("boutique_id", boutiqueId);
      if (convDelErr && !isMissingTableError(convDelErr)) throw convDelErr;
    }

    if (productIds.length) {
      const { error: galleryDelErr } = await supabase.from("product_images").delete().in("product_id", productIds);
      if (galleryDelErr && !isMissingTableError(galleryDelErr)) throw galleryDelErr;
    }

    {
      const { error: prodDelErr } = await supabase.from("products").delete().eq("boutique_id", boutiqueId);
      if (prodDelErr && !isMissingTableError(prodDelErr)) throw prodDelErr;
    }

    {
      const { error: leadsDelErr } = await supabase.from("leads").delete().eq("boutique_id", boutiqueId);
      if (leadsDelErr && !isMissingTableError(leadsDelErr)) throw leadsDelErr;
    }

    {
      const { error: showDelErr } = await supabase.from("boutique_showcase").delete().eq("boutique_id", boutiqueId);
      if (showDelErr && !isMissingTableError(showDelErr)) throw showDelErr;
    }

    {
      const { error: boutiqueDelErr } = await supabase.from("boutiques").delete().eq("id", boutiqueId);
      if (boutiqueDelErr) throw boutiqueDelErr;
    }

    return res.json({
      success: true,
      message: "Boutique removed",
      removed: { id: boutique.id, boutique_name: boutique.boutique_name, email: boutique.email }
    });
  } catch (err) {
    console.error("Admin Delete Boutique Error:", err);
    return res.status(500).json({ success: false, message: err?.message || "Failed to delete boutique" });
  }
});

module.exports = router;
