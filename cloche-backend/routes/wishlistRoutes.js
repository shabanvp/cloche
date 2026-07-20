const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
const { requireAuth } = require("../middleware/authMiddleware");

// Middleware to ensure user exists
router.use(requireAuth);

/**
 * GET /api/wishlist
 * Fetches all items in the user's wishlist
 */
router.get("/", async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch wishlist items along with product details
        const { data, error } = await supabase
            .from("wishlists")
            .select(`
                id,
                created_at,
                product_id,
                products (
                    id,
                    product_name,
                    price,
                    image_url,
                    boutique_id,
                    boutiques (
                        boutique_name
                    )
                )
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            // If relation "wishlists" does not exist (user hasn't created the table yet)
            if (error.message.includes("relation") && error.message.includes("does not exist")) {
                return res.json([]);
            }
            throw error;
        }

        // Format response safely
        const formattedData = data.reduce((acc, item) => {
            const productData = Array.isArray(item.products) ? item.products[0] : item.products;
            
            if (productData) {
                const boutiqueData = Array.isArray(productData.boutiques) ? productData.boutiques[0] : productData.boutiques;
                
                acc.push({
                    id: item.id,
                    product_id: item.product_id,
                    product: {
                        id: productData.id,
                        name: productData.product_name,
                        price: productData.price,
                        image: productData.image_url,
                        boutique_name: boutiqueData?.boutique_name || "Unknown Boutique"
                    },
                    created_at: item.created_at
                });
            }
            return acc;
        }, []);

        res.json({ success: true, data: formattedData });
    } catch (err) {
        console.error("[Wishlist GET] Error:", err.message);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

/**
 * POST /api/wishlist
 * Adds an item to the wishlist
 */
router.post("/", async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;

        if (!product_id) {
            return res.status(400).json({ success: false, message: "product_id is required" });
        }

        const { data, error } = await supabase
            .from("wishlists")
            .insert([{ user_id: userId, product_id }])
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(409).json({ success: false, message: "Product already in wishlist" });
            }
            throw error;
        }

        res.status(201).json({ success: true, message: "Added to wishlist", data });
    } catch (err) {
        console.error("[Wishlist POST] Error:", err.message);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

/**
 * DELETE /api/wishlist/:id
 * Removes an item from the wishlist
 */
router.delete("/:id", async (req, res) => {
    try {
        const userId = req.user.id;
        const wishlistId = req.params.id;

        const { error } = await supabase
            .from("wishlists")
            .delete()
            .eq("id", wishlistId)
            .eq("user_id", userId);

        if (error) throw error;

        res.json({ success: true, message: "Removed from wishlist" });
    } catch (err) {
        console.error("[Wishlist DELETE] Error:", err.message);
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
});

module.exports = router;
