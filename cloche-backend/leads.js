const express = require("express");
const router = express.Router();
const db = require("./db");

/* ================= GET LEADS ================= */
router.get("/list/:boutiqueId", (req, res) => {
  const { boutiqueId } = req.params;
  console.log(`[Leads] List request for boutiqueId: ${boutiqueId}`);

  const query = `
    SELECT * 
    FROM leads 
    WHERE boutique_id = ? 
    ORDER BY created_at DESC
  `;

  db.query(query, [boutiqueId], (err, rows) => {
    if (err) {
      console.error("[Leads] Database error:", err);
      // Wait, let's also check if 'leads' table exists or if 'created_at' column exists
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    console.log(`[Leads] Found ${rows.length} leads`);
    res.json(rows);
  });
});

module.exports = router;
