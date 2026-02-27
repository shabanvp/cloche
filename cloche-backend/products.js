const express = require("express");
const router = express.Router();
const db = require("./db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 🖼️ MULTER CONFIGURATION
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for HD
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: High quality Images Only! (jpeg, jpg, png, webp)");
    }
  },
});


/* ================= GET PRODUCT DETAILS ================= */
router.get("/:productId", (req, res) => {
  const { productId } = req.params;

  const query = `
    SELECT 
      p.*,
      b.boutique_name,
      b.city AS boutique_city,
      s.area,
      s.district,
      s.rating AS raw_showcase_rating,
      COALESCE(s.rating, 5.0) AS showcase_rating,
      s.tags AS showcase_tags,
      s.image_url AS showcase_image
    FROM products p
    JOIN boutiques b ON b.id = p.boutique_id
    LEFT JOIN boutique_showcase s ON s.boutique_id = b.id
    WHERE p.id = ?
  `;

  db.query(query, [productId], (err, rows) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (!rows.length) return res.status(404).json({ message: "Product not found" });

    const product = rows[0];

    db.query(
      `SELECT image_url FROM product_images WHERE product_id = ?`,
      [productId],
      (gErr, images) => {
        product.gallery = images.map(i => i.image_url);

        const productLocation = String(product.location || "").trim();
        const showcaseLocation = [product.area, product.district].filter(Boolean).join(", ");
        product.store_location = productLocation || showcaseLocation || product.boutique_city || "";

        // 🔥 reviews come from showcase only
        product.review_count = product.raw_showcase_rating ? 1 : 0;
        delete product.raw_showcase_rating;

        res.json(product);
      }
    );
  });
});


/* ================= ADD PRODUCT ================= */
router.post("/add", upload.array("images", 10), (req, res) => {
  console.log("[Products] Add request received:", req.body);
  const { name, price, stock, boutiqueId, category, description, location } = req.body;
  const files = req.files || [];
  console.log(`[Products] Files received: ${files.length}`);
  const primaryImageUrl = files.length > 0 ? `/uploads/${files[0].filename}` : null;

  if (!name || !price || !boutiqueId) {
    return res.status(400).json({ message: "Missing required fields (name, price, or boutiqueId)" });
  }

  // 1️⃣ Check for duplicate product for this boutique
  const dupQuery = `SELECT id FROM products WHERE product_name = ? AND boutique_id = ?`;
  db.query(dupQuery, [name, boutiqueId], (err, dupRows) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (dupRows.length > 0) {
      return res.status(409).json({ message: "This product is already registered in your boutique." });
    }

    // 2️⃣ Get boutique plan
    const planQuery = `SELECT plan FROM boutiques WHERE id = ?`;

    db.query(planQuery, [boutiqueId], (err, planRows) => {
      if (err) return res.status(500).json({ message: "DB error" });

      const normalizedPlan = String(planRows[0]?.plan || "Basic").toLowerCase();
      const productLimitByPlan = {
        basic: 3,
        professional: 20,
        premium: Infinity
      };

      // 3️⃣ Count existing products
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM products
        WHERE boutique_id = ?
      `;

      db.query(countQuery, [boutiqueId], (err, result) => {
        if (err) return res.status(500).json({ message: "DB error" });

        const totalProducts = result[0].total;

        const maxProducts = productLimitByPlan[normalizedPlan] ?? productLimitByPlan.basic;
        if (maxProducts !== Infinity && totalProducts >= maxProducts) {
          return res.status(403).json({
            message: `Your ${normalizedPlan} plan allows only ${maxProducts} products. Upgrade to add more.`
          });
        }

        // 4️⃣ Insert product
        const insertQuery = `
          INSERT INTO products (product_name, price, stock, boutique_id, category, description, location, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [name, price, stock || 0, boutiqueId, category || "Uncategorized", description || "", location || "", primaryImageUrl],
          (err, productResult) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "Insert failed" });
            }

            const productId = productResult.insertId;

            // 5️⃣ Insert all images into gallery (if any)
            if (files.length > 0) {
              const galleryValues = files.map(file => [productId, `/uploads/${file.filename}`]);
              const galleryQuery = `INSERT INTO product_images (product_id, image_url) VALUES ?`;

              db.query(galleryQuery, [galleryValues], (gErr) => {
                if (gErr) {
                  console.error("[Products] Gallery insert error:", gErr);
                  // Return success of product but mention gallery issue in logs
                }
                console.log(`[Products] Success: Added product ${productId} with ${files.length} images`);
                return res.json({ success: true, message: `Luxury Product added with ${files.length} images!` });
              });
            } else {
              console.log(`[Products] Success: Added product ${productId} (no images)`);
              return res.json({ success: true, message: "Product added successfully!" });
            }
          }
        );
      });
    });
  });
});

/* ================= GET BOUTIQUE PRODUCTS WITH GALLERY ================= */
router.get("/boutique/:boutiqueId", (req, res) => {
  const { boutiqueId } = req.params;
  console.log(`[Products] Fetching products for boutiqueId: ${boutiqueId}`);

  const query = `SELECT * FROM products WHERE boutique_id = ? ORDER BY created_at DESC`;
  db.query(query, [boutiqueId], (err, products) => {
    if (err) {
      console.error("[Products] Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    console.log(`[Products] Found ${products.length} products for boutiqueId: ${boutiqueId}`);

    // Fetch gallery images for each product
    let productsWithImages = products;
    let processed = 0;

    if (products.length === 0) {
      return res.json([]);
    }

    products.forEach((product, index) => {
      const galleryQuery = `SELECT image_url FROM product_images WHERE product_id = ? ORDER BY id ASC`;
      db.query(galleryQuery, [product.id], (gErr, galleryRows) => {
        if (!gErr && galleryRows.length > 0) {
          productsWithImages[index].gallery = galleryRows.map(g => g.image_url);
        } else {
          productsWithImages[index].gallery = [];
        }

        processed++;
        if (processed === products.length) {
          res.json(productsWithImages);
        }
      });
    });
  });
});

/* ================= DELETE PRODUCT ================= */
router.delete("/:productId", (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  // Delete product images from gallery first
  const deleteImagesQuery = `DELETE FROM product_images WHERE product_id = ?`;
  db.query(deleteImagesQuery, [productId], (err) => {
    if (err) {
      console.error("Error deleting product images:", err);
      return res.status(500).json({ message: "Error deleting product images" });
    }

    // Delete the product itself
    const deleteProductQuery = `DELETE FROM products WHERE id = ?`;
    db.query(deleteProductQuery, [productId], (err, result) => {
      if (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ message: "Error deleting product" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.json({ success: true, message: "Product deleted successfully!" });
    });
  });
});

/* ================= UPDATE PRODUCT ================= */
router.put("/:productId", upload.array("images", 10), (req, res) => {
  const { productId } = req.params;
  const { name, price, stock, category, description, location } = req.body;
  const files = req.files || [];

  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  const updateQuery = `
    UPDATE products 
    SET product_name = ?, price = ?, stock = ?, category = ?, description = ?, location = ?
    WHERE id = ?
  `;

  db.query(
    updateQuery,
    [name, price, stock || 0, category || "Uncategorized", description || "", location || "", productId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Update failed" });
      }

      // If new images were uploaded, add them to the gallery
      if (files.length > 0) {
        const galleryValues = files.map(file => [productId, `/uploads/${file.filename}`]);
        const galleryQuery = `INSERT INTO product_images (product_id, image_url) VALUES ?`;

        db.query(galleryQuery, [galleryValues], (gErr) => {
          if (gErr) {
            console.error("[Products] Gallery append error:", gErr);
          }

          // Also check if product has a primary image, if not, set the first new one as primary
          db.query("SELECT image_url FROM products WHERE id = ?", [productId], (pErr, pRows) => {
            if (!pErr && (!pRows[0] || !pRows[0].image_url)) {
              const firstNewImg = `/uploads/${files[0].filename}`;
              db.query("UPDATE products SET image_url = ? WHERE id = ?", [firstNewImg, productId]);
            }
          });

          return res.json({ success: true, message: "Product updated and new images added!" });
        });
      } else {
        return res.json({ success: true, message: "Product details updated!" });
      }
    }
  );
});


/* ================= DELETE SPECIFIC IMAGE ================= */
router.post("/delete-image", (req, res) => {
  const { productId, imageUrl } = req.body;

  if (!productId || !imageUrl) {
    return res.status(400).json({ message: "Missing productId or imageUrl" });
  }

  // 1. Delete from product_images table
  const deleteGalleryQuery = `DELETE FROM product_images WHERE product_id = ? AND image_url = ?`;
  db.query(deleteGalleryQuery, [productId, imageUrl], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error during image deletion" });
    }

    // 2. Delete the physical file
    const cleanUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
    const filePath = path.join(process.cwd(), cleanUrl);
    fs.unlink(filePath, (fsErr) => {
      if (fsErr) {
        console.error("Failed to delete file:", filePath, fsErr.message);
        // We continue even if file deletion fails (maybe it was already gone)
      }

      // 3. If this was the primary image in the 'products' table, update it
      db.query("SELECT image_url FROM products WHERE id = ?", [productId], (pErr, pRows) => {
        if (!pErr && pRows.length > 0 && pRows[0].image_url === imageUrl) {
          // Find another image from the gallery to be the new primary
          db.query("SELECT image_url FROM product_images WHERE product_id = ? LIMIT 1", [productId], (gErr, gRows) => {
            const nextImg = (gRows && gRows.length > 0) ? gRows[0].image_url : null;
            db.query("UPDATE products SET image_url = ? WHERE id = ?", [nextImg, productId], () => {
              res.json({ success: true, message: "Image removed and primary updated", nextPrimary: nextImg });
            });
          });
        } else {
          res.json({ success: true, message: "Gallery image removed" });
        }
      });
    });
  });
});

module.exports = router;




