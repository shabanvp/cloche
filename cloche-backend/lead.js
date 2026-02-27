// Count leads
const countLeadsQuery = `
  SELECT COUNT(*) AS total
  FROM leads
  WHERE boutique_id = ?
`;

db.query(countLeadsQuery, [boutiqueId], (err, result) => {
  if (err) return res.status(500).json({ message: "DB error" });

  const totalLeads = result[0].total;

  if (plan === "Basic" && totalLeads >= 5) {
    return res.status(403).json({
      message: "Basic plan allows only 5 leads. Upgrade to receive more."
    });
  }

  // ✅ Allow lead insert
});
