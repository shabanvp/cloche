const express = require("express");
const router = express.Router();
const supabase = require("./supabase");

const messageLimitByPlan = {
  basic: 5,
  professional: Infinity,
  premium: Infinity
};

// Create or get customer conversation with a boutique
router.post("/customer/conversation", async (req, res) => {
  const { boutiqueId, customer_name, customer_email, customer_phone, product_name } = req.body;
  const safeBoutiqueId = Number(boutiqueId);
  const safeName = String(customer_name || "").trim();
  const safeEmail = String(customer_email || "").trim().toLowerCase();
  const safePhone = String(customer_phone || "").trim();
  const safeProduct = String(product_name || "").trim();

  if (!safeBoutiqueId || !safeName || !safeEmail) {
    return res.status(400).json({ message: "boutiqueId, customer_name and customer_email are required" });
  }

  try {
    const { data: existing, error: findErr } = await supabase
      .from("conversations")
      .select("id, boutique_id, customer_name, customer_email, customer_phone, product_name, status")
      .eq("boutique_id", safeBoutiqueId)
      .eq("customer_email", safeEmail)
      .eq("product_name", safeProduct || null)
      .order("id", { ascending: false })
      .limit(1);

    if (findErr) return res.status(500).json({ message: "Error finding conversation", error: findErr.message });
    if (Array.isArray(existing) && existing.length) {
      return res.json({ success: true, conversationId: existing[0].id, conversation: existing[0] });
    }

    const { data: inserted, error: insertErr } = await supabase
      .from("conversations")
      .insert([
        {
          boutique_id: safeBoutiqueId,
          customer_name: safeName,
          customer_email: safeEmail,
          customer_phone: safePhone || null,
          product_name: safeProduct || null,
          status: "active"
        }
      ])
      .select("*")
      .maybeSingle();

    if (insertErr) return res.status(500).json({ message: "Error creating conversation", error: insertErr.message });
    return res.status(201).json({ success: true, conversationId: inserted.id, conversation: inserted });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all conversations for a customer (user side inbox)
router.get("/customer/conversations", async (req, res) => {
  const customerEmail = String(req.query.email || "").trim().toLowerCase();
  if (!customerEmail) return res.status(400).json({ message: "email query param is required" });

  try {
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("customer_email", customerEmail)
      .order("updated_at", { ascending: false });

    if (error) return res.status(500).json({ message: "Error fetching customer conversations", error: error.message });
    if (!Array.isArray(conversations) || !conversations.length) return res.json([]);

    const boutiqueIds = [...new Set(conversations.map((c) => c.boutique_id).filter(Boolean))];
    const convIds = conversations.map((c) => c.id);

    const [{ data: boutiques }, { data: messages }] = await Promise.all([
      boutiqueIds.length
        ? supabase.from("boutiques").select("id, boutique_name").in("id", boutiqueIds)
        : { data: [] },
      convIds.length
        ? supabase
            .from("messages")
            .select("conversation_id, message_text, sender_type, is_read, created_at")
            .in("conversation_id", convIds)
            .order("created_at", { ascending: false })
        : { data: [] }
    ]);

    const boutiqueMap = {};
    for (const b of boutiques || []) boutiqueMap[b.id] = b.boutique_name;

    const messageMap = {};
    for (const m of messages || []) {
      if (!messageMap[m.conversation_id]) messageMap[m.conversation_id] = [];
      messageMap[m.conversation_id].push(m);
    }

    const rows = conversations.map((c) => {
      const list = messageMap[c.id] || [];
      const last = list[0] || null;
      const unread = list.filter((m) => !m.is_read && m.sender_type === "boutique").length;
      return {
        ...c,
        boutique_name: boutiqueMap[c.boutique_id] || null,
        last_message_time: last?.created_at || c.created_at,
        last_message: last?.message_text || null,
        unread_count: unread
      };
    });

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get messages for customer side and mark boutique messages as read
router.get("/customer/conversation/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const { data: rows, error } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_type, message_text, is_read, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ message: "Error fetching messages", error: error.message });

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .eq("sender_type", "boutique");

    return res.json(rows || []);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET all conversations for a boutique
router.get("/conversations/:boutiqueId", async (req, res) => {
  const { boutiqueId } = req.params;
  try {
    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .eq("boutique_id", boutiqueId)
      .order("updated_at", { ascending: false });

    if (error) return res.status(500).json({ message: "Error fetching conversations", error: error.message });
    if (!Array.isArray(conversations) || !conversations.length) return res.json([]);

    const convIds = conversations.map((c) => c.id);
    const { data: messages, error: msgErr } = await supabase
      .from("messages")
      .select("conversation_id, message_text, sender_type, is_read, created_at")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false });

    if (msgErr) return res.status(500).json({ message: "Error fetching conversations", error: msgErr.message });

    const messageMap = {};
    for (const m of messages || []) {
      if (!messageMap[m.conversation_id]) messageMap[m.conversation_id] = [];
      messageMap[m.conversation_id].push(m);
    }

    const rows = conversations.map((c) => {
      const list = messageMap[c.id] || [];
      const last = list[0] || null;
      const unread = list.filter((m) => !m.is_read && m.sender_type === "customer").length;
      return {
        ...c,
        last_message_time: last?.created_at || c.created_at,
        last_message: last?.message_text || null,
        unread_count: unread
      };
    });

    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET messages for a specific conversation
router.get("/conversation/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const { data: results, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) return res.status(500).json({ message: "Error fetching messages", error: error.message });

    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .eq("sender_type", "customer");

    return res.json(results || []);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST a new message
router.post("/send", async (req, res) => {
  const { conversationId, message_text, senderType } = req.body;
  const normalizedSenderType = senderType || "boutique";

  if (!conversationId || !message_text) {
    return res.status(400).json({ message: "Missing conversationId or message_text" });
  }

  const insertMessage = async () => {
    const { error: insertErr } = await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        sender_type: normalizedSenderType,
        message_text,
        is_read: false
      }
    ]);
    if (insertErr) {
      return res.status(500).json({ message: "Error sending message", error: insertErr.message });
    }
    await supabase.from("conversations").update({ status: "active" }).eq("id", conversationId);
    return res.json({ success: true, message: "Message sent successfully" });
  };

  try {
    if (normalizedSenderType !== "boutique") {
      return insertMessage();
    }

    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("boutique_id")
      .eq("id", conversationId)
      .maybeSingle();

    if (convErr) return res.status(500).json({ message: "Error validating subscription", error: convErr.message });
    if (!conv) return res.status(404).json({ message: "Conversation not found" });

    const { data: boutique } = await supabase
      .from("boutiques")
      .select("plan")
      .eq("id", conv.boutique_id)
      .maybeSingle();

    const planLabel = String(boutique?.plan || "Basic");
    const planKey = planLabel.toLowerCase();
    const maxMessages = messageLimitByPlan[planKey] ?? messageLimitByPlan.basic;
    if (maxMessages === Infinity) {
      return insertMessage();
    }

    const { data: convs } = await supabase
      .from("conversations")
      .select("id")
      .eq("boutique_id", conv.boutique_id);

    const convIds = (convs || []).map((c) => c.id);
    if (!convIds.length) return insertMessage();

    const { count, error: countErr } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .in("conversation_id", convIds)
      .eq("sender_type", "boutique");

    if (countErr) {
      return res.status(500).json({ message: "Error validating message limits", error: countErr.message });
    }

    const totalMessages = Number(count || 0);
    if (totalMessages >= maxMessages) {
      return res.status(403).json({
        message: `Your ${planLabel} plan allows only ${maxMessages} sent messages. Upgrade to continue.`
      });
    }

    return insertMessage();
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET conversation details
router.get("/details/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  try {
    const { data, error } = await supabase.from("conversations").select("*").eq("id", conversationId).maybeSingle();
    if (error) return res.status(500).json({ message: "Error fetching conversation details", error: error.message });
    return res.json(data || {});
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE conversation status
router.put("/status/:conversationId", async (req, res) => {
  const { conversationId } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Missing status" });

  try {
    const { error } = await supabase.from("conversations").update({ status }).eq("id", conversationId);
    if (error) return res.status(500).json({ message: "Error updating status", error: error.message });
    return res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Backward compatible status update endpoint used by frontend/messages.html
router.put("/status", async (req, res) => {
  const { conversationId, status } = req.body;
  if (!conversationId || !status) {
    return res.status(400).json({ message: "conversationId and status are required" });
  }
  try {
    const { error } = await supabase.from("conversations").update({ status }).eq("id", conversationId);
    if (error) return res.status(500).json({ message: "Error updating status", error: error.message });
    return res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
