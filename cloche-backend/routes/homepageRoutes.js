const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const { requireAdmin } = require("../middleware/adminAuth");
const multer = require("multer");
const { uploadBufferToStorage } = require("../storage");

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * GET /api/admin/homepage
 * Fetch all homepage sections
 * Note: This can be accessed publicly by the frontend to render the homepage,
 * so we don't strictly requireAdmin for GET, but the route is under /api/admin/homepage for now based on instructions.
 * Let's make GET public, and mutations protected.
 */
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("homepage_sections")
            .select("*")
            .order("display_order", { ascending: true });

        if (error) {
            if (error.message.includes("relation") && error.message.includes("does not exist")) {
                return res.json({ success: true, data: [] });
            }
            throw error;
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error("[Homepage GET] Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * POST /api/admin/homepage
 * Create a new section
 */
router.post("/", requireAdmin, upload.single("image"), async (req, res) => {
    try {
        const { section_type, title, subtitle, content, is_active } = req.body;
        
        let imageUrl = null;
        if (req.file) {
            const { publicUrl } = await uploadBufferToStorage({ folder: "homepage", file: req.file });
            imageUrl = publicUrl;
        }

        // Get max order
        const { data: maxOrderData } = await supabase
            .from("homepage_sections")
            .select("display_order")
            .order("display_order", { ascending: false })
            .limit(1)
            .maybeSingle();
        
        const nextOrder = maxOrderData ? (maxOrderData.display_order + 1) : 1;

        const { data, error } = await supabase
            .from("homepage_sections")
            .insert([{ 
                section_type, 
                title, 
                subtitle, 
                content: content ? JSON.parse(content) : null,
                image_url: imageUrl,
                display_order: nextOrder,
                is_active: is_active === 'true' || is_active === true
            }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json({ success: true, data, message: "Section created" });
    } catch (err) {
        console.error("[Homepage POST] Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * PUT /api/admin/homepage/:id
 * Update a section
 */
router.put("/:id", requireAdmin, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { section_type, title, subtitle, content, is_active } = req.body;

        let updateData = { section_type, title, subtitle };
        
        if (content) updateData.content = JSON.parse(content);
        if (is_active !== undefined) updateData.is_active = is_active === 'true' || is_active === true;

        if (req.file) {
            const { publicUrl } = await uploadBufferToStorage({ folder: "homepage", file: req.file });
            updateData.image_url = publicUrl;
        }

        const { data, error } = await supabase
            .from("homepage_sections")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, data, message: "Section updated" });
    } catch (err) {
        console.error("[Homepage PUT] Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * PATCH /api/admin/homepage/reorder
 * Reorder sections
 */
router.patch("/reorder", requireAdmin, async (req, res) => {
    try {
        const { items } = req.body; // [{ id: 1, display_order: 1 }, ...]
        if (!Array.isArray(items)) return res.status(400).json({ success: false, message: "Invalid payload" });

        for (const item of items) {
            await supabase
                .from("homepage_sections")
                .update({ display_order: item.display_order })
                .eq("id", item.id);
        }

        res.json({ success: true, message: "Sections reordered successfully" });
    } catch (err) {
        console.error("[Homepage REORDER] Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * DELETE /api/admin/homepage/:id
 * Delete a section
 */
router.delete("/:id", requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("homepage_sections").delete().eq("id", id);
        if (error) throw error;
        res.json({ success: true, message: "Section deleted" });
    } catch (err) {
        console.error("[Homepage DELETE] Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
