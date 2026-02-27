const express = require("express");
const router = express.Router();
const supabase = require("./supabase");

/* ================= GET LEADS ================= */
router.get("/list/:boutiqueId", async (req, res) => {
  const { boutiqueId } = req.params;
  console.log(`[Leads] List request for boutiqueId: ${boutiqueId}`);

  try {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("boutique_id", boutiqueId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Leads] Supabase error:", error);
      return res.status(500).json({ message: "Database error", error: error.message });
    }

    const rows = Array.isArray(data) ? data : [];
    console.log(`[Leads] Found ${rows.length} leads`);
    return res.json(rows);
  } catch (err) {
    console.error("[Leads] Unexpected error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
