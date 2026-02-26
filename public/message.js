const countMessagesQuery = `
  SELECT COUNT(*) AS total
  FROM messages
  WHERE boutique_id = ?
`;

db.query(countMessagesQuery, [boutiqueId], (err, result) => {
  if (err) return res.status(500).json({ message: "DB error" });

  const totalMessages = result[0].total;

  if (plan === "Basic" && totalMessages >= 5) {
    return res.status(403).json({
      message: "Basic plan allows only 5 messages. Upgrade to continue."
    });
  }

  // ✅ Allow sending message
});
