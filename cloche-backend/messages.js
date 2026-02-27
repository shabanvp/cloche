const express = require("express");
const db = require("./db");
const router = express.Router();

const messageLimitByPlan = {
  basic: 5,
  professional: Infinity,
  premium: Infinity
};

const ensureMessageTables = (cb) => {
  const createConversations = `
    CREATE TABLE IF NOT EXISTS conversations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      boutique_id INT NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255),
      customer_phone VARCHAR(20),
      product_name VARCHAR(255),
      status ENUM('active', 'archived', 'closed') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (boutique_id) REFERENCES boutiques(id) ON DELETE CASCADE
    )
  `;

  const createMessages = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      conversation_id INT NOT NULL,
      sender_type ENUM('customer', 'boutique') NOT NULL,
      message_text LONGTEXT NOT NULL,
      is_read BOOLEAN DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
      INDEX idx_conversation (conversation_id),
      INDEX idx_created (created_at)
    )
  `;

  db.query(createConversations, (err) => {
    if (err) return cb(err);
    db.query(createMessages, cb);
  });
};

// Create or get customer conversation with a boutique
router.post("/customer/conversation", (req, res) => {
  const { boutiqueId, customer_name, customer_email, customer_phone, product_name } = req.body;

  const safeBoutiqueId = Number(boutiqueId);
  const safeName = String(customer_name || "").trim();
  const safeEmail = String(customer_email || "").trim().toLowerCase();
  const safePhone = String(customer_phone || "").trim();
  const safeProduct = String(product_name || "").trim();

  if (!safeBoutiqueId || !safeName || !safeEmail) {
    return res.status(400).json({ message: "boutiqueId, customer_name and customer_email are required" });
  }

  ensureMessageTables((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare message tables", error: tableErr.message });
    }

    const findQuery = `
      SELECT id, boutique_id, customer_name, customer_email, customer_phone, product_name, status
      FROM conversations
      WHERE boutique_id = ? AND customer_email = ? AND COALESCE(product_name, '') = ?
      ORDER BY id DESC
      LIMIT 1
    `;

    db.query(findQuery, [safeBoutiqueId, safeEmail, safeProduct], (findErr, rows) => {
      if (findErr) {
        return res.status(500).json({ message: "Error finding conversation", error: findErr.message });
      }

      if (rows.length) {
        return res.json({ success: true, conversationId: rows[0].id, conversation: rows[0] });
      }

      const insertQuery = `
        INSERT INTO conversations (boutique_id, customer_name, customer_email, customer_phone, product_name, status)
        VALUES (?, ?, ?, ?, ?, 'active')
      `;

      db.query(insertQuery, [safeBoutiqueId, safeName, safeEmail, safePhone || null, safeProduct || null], (insertErr, result) => {
        if (insertErr) {
          return res.status(500).json({ message: "Error creating conversation", error: insertErr.message });
        }

        return res.status(201).json({
          success: true,
          conversationId: result.insertId,
          conversation: {
            id: result.insertId,
            boutique_id: safeBoutiqueId,
            customer_name: safeName,
            customer_email: safeEmail,
            customer_phone: safePhone || null,
            product_name: safeProduct || null,
            status: "active"
          }
        });
      });
    });
  });
});

// Get all conversations for a customer (user side inbox)
router.get("/customer/conversations", (req, res) => {
  const customerEmail = String(req.query.email || "").trim().toLowerCase();
  if (!customerEmail) {
    return res.status(400).json({ message: "email query param is required" });
  }

  ensureMessageTables((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare message tables", error: tableErr.message });
    }

    const query = `
      SELECT DISTINCT
        c.id,
        c.boutique_id,
        b.boutique_name,
        c.customer_name,
        c.customer_email,
        c.customer_phone,
        c.product_name,
        c.status,
        MAX(m.created_at) as last_message_time,
        (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        COUNT(CASE WHEN m.is_read = 0 AND m.sender_type = 'boutique' THEN 1 END) as unread_count
      FROM conversations c
      LEFT JOIN messages m ON c.id = m.conversation_id
      LEFT JOIN boutiques b ON b.id = c.boutique_id
      WHERE c.customer_email = ?
      GROUP BY c.id
      ORDER BY COALESCE(last_message_time, c.created_at) DESC
    `;

    db.query(query, [customerEmail], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching customer conversations", error: err.message });
      }
      return res.json(rows);
    });
  });
});

// Get messages for customer side and mark boutique messages as read
router.get("/customer/conversation/:conversationId", (req, res) => {
  const { conversationId } = req.params;

  ensureMessageTables((tableErr) => {
    if (tableErr) {
      return res.status(500).json({ message: "Failed to prepare message tables", error: tableErr.message });
    }

    const query = `
      SELECT id, conversation_id, sender_type, message_text, is_read, created_at
      FROM messages
      WHERE conversation_id = ?
      ORDER BY created_at ASC
    `;

    db.query(query, [conversationId], (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching messages", error: err.message });
      }

      const markReadQuery = `
        UPDATE messages
        SET is_read = 1
        WHERE conversation_id = ? AND sender_type = 'boutique'
      `;

      db.query(markReadQuery, [conversationId], () => {
        return res.json(rows);
      });
    });
  });
});

// GET all conversations for a boutique
router.get("/conversations/:boutiqueId", (req, res) => {
  const { boutiqueId } = req.params;

  const query = `
    SELECT DISTINCT
      c.id,
      c.customer_name,
      c.customer_email,
      c.customer_phone,
      c.product_name,
      c.status,
      MAX(m.created_at) as last_message_time,
      (SELECT message_text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
      COUNT(CASE WHEN m.is_read = 0 AND m.sender_type = 'customer' THEN 1 END) as unread_count
    FROM conversations c
    LEFT JOIN messages m ON c.id = m.conversation_id
    WHERE c.boutique_id = ?
    GROUP BY c.id
    ORDER BY last_message_time DESC
  `;

  db.query(query, [boutiqueId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching conversations:", err);
      return res.status(500).json({ message: "Error fetching conversations", error: err.message });
    }
    res.json(results);
  });
});

// GET messages for a specific conversation
router.get("/conversation/:conversationId", (req, res) => {
  const { conversationId } = req.params;

  const query = `
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `;

  db.query(query, [conversationId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching messages:", err);
      return res.status(500).json({ message: "Error fetching messages", error: err.message });
    }

    // Mark messages as read
    const updateQuery = `
      UPDATE messages SET is_read = 1
      WHERE conversation_id = ? AND sender_type = 'customer'
    `;
    db.query(updateQuery, [conversationId], (err) => {
      if (err) console.error("Error marking messages as read:", err);
    });

    res.json(results);
  });
});

// POST a new message
router.post("/send", (req, res) => {
  const { conversationId, message_text, senderType } = req.body;
  const normalizedSenderType = senderType || "boutique";

  if (!conversationId || !message_text) {
    return res.status(400).json({ message: "Missing conversationId or message_text" });
  }

  const insertMessage = () => {
    const query = `
      INSERT INTO messages (conversation_id, sender_type, message_text, created_at, is_read)
      VALUES (?, ?, ?, NOW(), 0)
    `;

    db.query(query, [conversationId, normalizedSenderType, message_text], (err) => {
      if (err) {
        console.error("❌ Error sending message:", err);
        return res.status(500).json({ message: "Error sending message", error: err.message });
      }

      const updateConvQuery = `UPDATE conversations SET status = 'active' WHERE id = ?`;
      db.query(updateConvQuery, [conversationId], (updateErr) => {
        if (updateErr) console.error("Error updating conversation:", updateErr);
      });

      return res.json({ success: true, message: "Message sent successfully" });
    });
  };

  // Enforce plan limits for boutique-sent messages only.
  if (normalizedSenderType !== "boutique") {
    return insertMessage();
  }

  const planQuery = `
    SELECT c.boutique_id, COALESCE(NULLIF(b.plan, ''), 'Basic') AS plan
    FROM conversations c
    INNER JOIN boutiques b ON b.id = c.boutique_id
    WHERE c.id = ?
    LIMIT 1
  `;

  db.query(planQuery, [conversationId], (planErr, planRows) => {
    if (planErr) {
      console.error("❌ Error fetching plan:", planErr);
      return res.status(500).json({ message: "Error validating subscription", error: planErr.message });
    }

    if (!planRows.length) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const planKey = String(planRows[0].plan || "Basic").toLowerCase();
    const maxMessages = messageLimitByPlan[planKey] ?? messageLimitByPlan.basic;
    if (maxMessages === Infinity) {
      return insertMessage();
    }

    const countQuery = `
      SELECT COUNT(*) AS total
      FROM messages m
      INNER JOIN conversations c ON c.id = m.conversation_id
      WHERE c.boutique_id = ? AND m.sender_type = 'boutique'
    `;

    db.query(countQuery, [planRows[0].boutique_id], (countErr, countRows) => {
      if (countErr) {
        console.error("❌ Error counting messages:", countErr);
        return res.status(500).json({ message: "Error validating message limits", error: countErr.message });
      }

      const totalMessages = Number(countRows[0]?.total || 0);
      if (totalMessages >= maxMessages) {
        return res.status(403).json({
          message: `Your ${planRows[0].plan} plan allows only ${maxMessages} sent messages. Upgrade to continue.`
        });
      }

      return insertMessage();
    });
  });
});

// GET conversation details
router.get("/details/:conversationId", (req, res) => {
  const { conversationId } = req.params;

  const query = `SELECT * FROM conversations WHERE id = ?`;

  db.query(query, [conversationId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching conversation details:", err);
      return res.status(500).json({ message: "Error fetching conversation details", error: err.message });
    }
    res.json(results[0] || {});
  });
});

// UPDATE conversation status
router.put("/status/:conversationId", (req, res) => {
  const { conversationId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Missing status" });
  }

  const query = `UPDATE conversations SET status = ? WHERE id = ?`;

  db.query(query, [status, conversationId], (err) => {
    if (err) {
      console.error("❌ Error updating status:", err);
      return res.status(500).json({ message: "Error updating status", error: err.message });
    }
    res.json({ success: true, message: "Status updated successfully" });
  });
});

// Backward compatible status update endpoint used by frontend/messages.html
router.put("/status", (req, res) => {
  const { conversationId, status } = req.body;
  if (!conversationId || !status) {
    return res.status(400).json({ message: "conversationId and status are required" });
  }

  const query = `UPDATE conversations SET status = ? WHERE id = ?`;
  db.query(query, [status, conversationId], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error updating status", error: err.message });
    }
    return res.json({ success: true, message: "Status updated successfully" });
  });
});

module.exports = router;
