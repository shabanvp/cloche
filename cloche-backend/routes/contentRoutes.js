const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const { requireAdmin } = require("../middleware/adminAuth");
const multer = require("multer");
const { uploadBufferToStorage } = require("../storage");

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* =======================================
   ARTICLES (BLOGS, GUIDES, ETC.)
======================================= */

router.get("/articles", async (req, res) => {
    try {
        const { is_published } = req.query;
        let query = supabase.from("articles").select("*").order("created_at", { ascending: false });
        if (is_published === 'true') query = query.eq("is_published", true);

        const { data, error } = await query;
        if (error) {
            if (error.message.includes("relation") && error.message.includes("does not exist")) return res.json({ success: true, data: [] });
            throw error;
        }
        res.json({ success: true, data });
    } catch (err) {
        console.error("[Content GET] Articles Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/articles/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, message: "Article not found" });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[Content GET] Article Slug Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/articles", requireAdmin, upload.single("cover_image"), async (req, res) => {
    try {
        const { slug, title, excerpt, content, category, author, is_published, seo_metadata } = req.body;
        let imageUrl = null;
        if (req.file) {
            const { publicUrl } = await uploadBufferToStorage({ folder: "articles", file: req.file });
            imageUrl = publicUrl;
        }

        const { data, error } = await supabase.from("articles").insert([{
            slug, title, excerpt, content, category, author,
            cover_image: imageUrl,
            is_published: is_published === 'true' || is_published === true,
            seo_metadata: seo_metadata ? JSON.parse(seo_metadata) : null
        }]).select().single();

        if (error) throw error;
        res.status(201).json({ success: true, data, message: "Article created" });
    } catch (err) {
        console.error("[Content POST] Articles Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.put("/articles/:id", requireAdmin, upload.single("cover_image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { slug, title, excerpt, content, category, author, is_published, seo_metadata } = req.body;
        
        let updateData = { slug, title, excerpt, content, category, author };
        if (is_published !== undefined) updateData.is_published = is_published === 'true' || is_published === true;
        if (seo_metadata) updateData.seo_metadata = JSON.parse(seo_metadata);

        if (req.file) {
            const { publicUrl } = await uploadBufferToStorage({ folder: "articles", file: req.file });
            updateData.cover_image = publicUrl;
        }

        const { data, error } = await supabase.from("articles").update(updateData).eq("id", id).select().single();
        if (error) throw error;
        res.json({ success: true, data, message: "Article updated" });
    } catch (err) {
        console.error("[Content PUT] Articles Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.delete("/articles/:id", requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("articles").delete().eq("id", id);
        if (error) throw error;
        res.json({ success: true, message: "Article deleted" });
    } catch (err) {
        console.error("[Content DELETE] Articles Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/* =======================================
   REAL WEDDINGS
======================================= */

router.get("/weddings", async (req, res) => {
    try {
        const { is_published } = req.query;
        let query = supabase.from("real_weddings").select("*").order("wedding_date", { ascending: false });
        if (is_published === 'true') query = query.eq("is_published", true);

        const { data, error } = await query;
        if (error) {
            if (error.message.includes("relation") && error.message.includes("does not exist")) return res.json({ success: true, data: [] });
            throw error;
        }
        res.json({ success: true, data });
    } catch (err) {
        console.error("[Content GET] Weddings Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/weddings/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase.from("real_weddings").select("*").eq("slug", slug).maybeSingle();
        if (error) throw error;
        if (!data) return res.status(404).json({ success: false, message: "Wedding not found" });
        res.json({ success: true, data });
    } catch (err) {
        console.error("[Content GET] Wedding Slug Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/weddings", requireAdmin, upload.single("cover_image"), async (req, res) => {
    try {
        const { slug, couple_name, venue, wedding_date, budget, story, gallery, vendors, is_published } = req.body;
        let imageUrl = null;
        if (req.file) {
            const { publicUrl } = await uploadBufferToStorage({ folder: "weddings", file: req.file });
            imageUrl = publicUrl;
        }

        const { data, error } = await supabase.from("real_weddings").insert([{
            slug, couple_name, venue, wedding_date, budget, story,
            cover_image: imageUrl,
            gallery: gallery ? JSON.parse(gallery) : [],
            vendors: vendors ? JSON.parse(vendors) : [],
            is_published: is_published === 'true' || is_published === true
        }]).select().single();

        if (error) throw error;
        res.status(201).json({ success: true, data, message: "Wedding created" });
    } catch (err) {
        console.error("[Content POST] Weddings Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.put("/weddings/:id", requireAdmin, upload.single("cover_image"), async (req, res) => {
    try {
        const { id } = req.params;
        const { slug, couple_name, venue, wedding_date, budget, story, gallery, vendors, is_published } = req.body;
        
        let updateData = { slug, couple_name, venue, wedding_date, budget, story };
        if (is_published !== undefined) updateData.is_published = is_published === 'true' || is_published === true;
        if (gallery) updateData.gallery = JSON.parse(gallery);
        if (vendors) updateData.vendors = JSON.parse(vendors);

        if (req.file) {
            const { publicUrl } = await uploadBufferToStorage({ folder: "weddings", file: req.file });
            updateData.cover_image = publicUrl;
        }

        const { data, error } = await supabase.from("real_weddings").update(updateData).eq("id", id).select().single();
        if (error) throw error;
        res.json({ success: true, data, message: "Wedding updated" });
    } catch (err) {
        console.error("[Content PUT] Weddings Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.delete("/weddings/:id", requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase.from("real_weddings").delete().eq("id", id);
        if (error) throw error;
        res.json({ success: true, message: "Wedding deleted" });
    } catch (err) {
        console.error("[Content DELETE] Weddings Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/* =======================================
   NEWSLETTER
======================================= */

router.post("/newsletter", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ success: false, message: "Valid email is required" });
        }

        // Upsert or insert
        const { error } = await supabase
            .from("newsletter_subscribers")
            .upsert({ email, is_subscribed: true }, { onConflict: "email" });
            
        if (error) throw error;
        res.json({ success: true, message: "Successfully subscribed to the newsletter!" });
    } catch (err) {
        console.error("[Content POST] Newsletter Error:", err.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
