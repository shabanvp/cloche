// Count leads
const countLeadsQuery = `
  SELECT COUNT(*) AS total
  FROM leads
  WHERE boutique_id = ?
`;

db.query(countLeadsQuery, [boutiqueId], (err, result) => {
  if (err) return res.status(500).json({ message: "DB error" });

  const totalLeads = result[0].total;

  // Early Partner Phase: no hard lead cut for basic plan.
  // Soft limits are handled operationally, not by API rejection.

  // ✅ Allow lead insert
});
