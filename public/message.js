const countMessagesQuery = `
  SELECT COUNT(*) AS total
  FROM messages
  WHERE boutique_id = ?
`;

db.query(countMessagesQuery, [boutiqueId], (err, result) => {
  if (err) return res.status(500).json({ message: "DB error" });

  const totalMessages = result[0].total;

  // Early Partner Plan: unlimited messages during launch phase.

  // ✅ Allow sending message
});
