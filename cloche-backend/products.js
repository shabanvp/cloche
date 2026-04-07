const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const supabase = require("./supabase");
const { deleteStorageObjectByUrl, uploadBufferToStorage } = require("./storage");

const CLOUDINARY_CLOUD_NAME = String(process.env.CLOUDINARY_CLOUD_NAME || "").trim();

const normalizeImageUrl = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw) || /^data:image\//i.test(raw)) return raw;
  
  // Determine cloud name - use env var first, fallback to known value
  const cloudName = CLOUDINARY_CLOUD_NAME || 'dycwsnzyd';
  
  // If it looks like a Cloudinary public ID or path, construct full URL
  if (!raw.includes("image/upload")) {
    return `https://res.cloudinary.com/${cloudName}/image/upload/${raw.replace(/^\/+/, "")}`;
  }
  
  return raw; // Already looks like a full URL
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("High quality images only (jpeg, jpg, png, webp)"));
  }
});

const safeUnlink = (imageUrl) => {
  if (!imageUrl) return;
  if (/^https?:\/\//i.test(imageUrl)) return;
  const cleanUrl = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
  const filePath = path.join(process.cwd(), cleanUrl);
  fs.unlink(filePath, () => { });
};

const uploadProductImages = async (boutiqueId, files) => {
  return Promise.all(
    (files || []).map((file) =>
      uploadBufferToStorage({
        folder: `products/${boutiqueId}`,
        file
      }).then(({ publicUrl }) => publicUrl)
    )
  );
};

/* ================= GET PRODUCT DETAILS ================= */
router.get("/:productId", async (req, res, next) => {
  const { productId } = req.params;
  if (productId === "boutique") return next();

  try {
    const { data: product, error: productErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .maybeSingle();

    if (productErr) return res.status(500).json({ message: "DB error", error: productErr.message });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const [{ data: boutique }, { data: showcase }, { data: images }] = await Promise.all([
      supabase.from("boutiques").select("boutique_name, city").eq("id", product.boutique_id).maybeSingle(),
      supabase
        .from("boutique_showcase")
        .select("area, district, rating, tags, image_url")
        .eq("boutique_id", product.boutique_id)
        .maybeSingle(),
      supabase.from("product_images").select("image_url").eq("product_id", productId).order("id", { ascending: true })
    ]);

    const gallery = Array.isArray(images) ? images.map((i) => i.image_url) : [];
    const productLocation = String(product.location || "").trim();
    const showcaseLocation = [showcase?.area, showcase?.district].filter(Boolean).join(", ");

    return res.json({
      ...product,
      boutique_name: boutique?.boutique_name || null,
      boutique_city: boutique?.city || null,
      area: showcase?.area || null,
      district: showcase?.district || null,
      showcase_rating: showcase?.rating || 5.0,
      showcase_tags: showcase?.tags || null,
      showcase_image: showcase?.image_url || null,
      review_count: showcase?.rating ? 1 : 0,
      store_location: productLocation || showcaseLocation || boutique?.city || "",
      gallery
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= ADD PRODUCT ================= */
router.post("/add", upload.array("images", 10), async (req, res) => {
  const { name, price, stock, boutiqueId, category, description, location } = req.body;
  const files = req.files || [];

  if (!name || !price || !boutiqueId) {
    return res.status(400).json({ message: "Missing required fields (name, price, or boutiqueId)" });
  }

  try {
    const { data: dupRows, error: dupErr } = await supabase
      .from("products")
      .select("id")
      .eq("product_name", name)
      .eq("boutique_id", boutiqueId)
      .limit(1);

    if (dupErr) return res.status(500).json({ message: "Database error", error: dupErr.message });
    if (Array.isArray(dupRows) && dupRows.length > 0) {
      return res.status(409).json({ message: "This product is already registered in your boutique." });
    }

    const { data: planRow, error: planErr } = await supabase
      .from("boutiques")
      .select("plan")
      .eq("id", boutiqueId)
      .maybeSingle();

    if (planErr) return res.status(500).json({ message: "DB error", error: planErr.message });

    const normalizedPlan = String(planRow?.plan || "Basic").toLowerCase();
    const productLimitByPlan = { basic: 20, professional: 20, premium: Infinity };
    const maxProducts = productLimitByPlan[normalizedPlan] ?? productLimitByPlan.basic;

    const { count, error: countErr } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("boutique_id", boutiqueId);

    if (countErr) return res.status(500).json({ message: "DB error", error: countErr.message });

    const totalProducts = Number(count || 0);
    if (maxProducts !== Infinity && totalProducts >= maxProducts) {
      return res.status(403).json({
        message: `Your ${normalizedPlan} plan allows only ${maxProducts} products. Upgrade to add more.`
      });
    }

    let uploadedImageUrls = await uploadProductImages(boutiqueId, files);
    if (req.body.imageUrls) {
      try {
        const parsedBodyUrls = JSON.parse(req.body.imageUrls);
        if (Array.isArray(parsedBodyUrls)) {
          uploadedImageUrls = [...uploadedImageUrls, ...parsedBodyUrls];
        }
      } catch (parseErr) {
        console.error("Failed to parse imageUrls:", parseErr);
      }
    }

    const primaryImageUrl = uploadedImageUrls[0] || null;

    const { data: inserted, error: insertErr } = await supabase
      .from("products")
      .insert([
        {
          product_name: name,
          price,
          stock: stock || 0,
          boutique_id: boutiqueId,
          category: category || "Uncategorized",
          description: description || "",
          location: location || "",
          image_url: primaryImageUrl
        }
      ])
      .select("id")
      .maybeSingle();

    if (insertErr) {
      await Promise.all(uploadedImageUrls.map((imageUrl) => deleteStorageObjectByUrl(imageUrl)));
      return res.status(500).json({ message: "Insert failed", error: insertErr.message });
    }

    const productId = inserted?.id;
    if (productId && uploadedImageUrls.length > 0) {
      const galleryRows = uploadedImageUrls.map((imageUrl) => ({ product_id: productId, image_url: imageUrl }));
      const { error: galleryErr } = await supabase.from("product_images").insert(galleryRows);
      if (galleryErr) console.error("[Products] Gallery insert error:", galleryErr.message);
    }

    return res.json({ success: true, message: `Luxury product added with ${files.length} images!` });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= GET BOUTIQUE PRODUCTS WITH GALLERY ================= */
router.get("/boutique/:boutiqueId", async (req, res) => {
  const { boutiqueId } = req.params;

  try {
    let { data: products, error: productErr } = await supabase
      .from("products")
      .select("*")
      .eq("boutique_id", boutiqueId)
      .order("created_at", { ascending: false });

    if (productErr && String(productErr.message || "").toLowerCase().includes("created_at")) {
      const fallback = await supabase
        .from("products")
        .select("*")
        .eq("boutique_id", boutiqueId)
        .order("id", { ascending: false });
      products = fallback.data;
      productErr = fallback.error;
    }

    if (productErr) return res.status(500).json({ message: "Database error", error: productErr.message });
    if (!Array.isArray(products) || !products.length) return res.json([]);

    const ids = products.map((p) => p.id);
    const { data: galleryRows, error: galleryErr } = await supabase
      .from("product_images")
      .select("product_id, image_url, id")
      .in("product_id", ids)
      .order("id", { ascending: true });

    if (galleryErr) {
      return res.json(products.map((p) => ({ ...p, gallery: [] })));
    }

    const galleryMap = {};
    for (const row of galleryRows || []) {
      if (!galleryMap[row.product_id]) galleryMap[row.product_id] = [];
      galleryMap[row.product_id].push(normalizeImageUrl(row.image_url));
    }

    return res.json(products.map((p) => ({ 
      ...p, 
      image_url: normalizeImageUrl(p.image_url),
      gallery: galleryMap[p.id] || [] 
    })));
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= DELETE PRODUCT ================= */
router.delete("/:productId", async (req, res) => {
  const { productId } = req.params;
  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  try {
    const { data: existingProduct } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", productId)
      .maybeSingle();

    const { data: images } = await supabase
      .from("product_images")
      .select("image_url")
      .eq("product_id", productId);

    const { error: delImgErr } = await supabase.from("product_images").delete().eq("product_id", productId);
    if (delImgErr) return res.status(500).json({ message: "Error deleting product images", error: delImgErr.message });

    const { error: delProdErr } = await supabase.from("products").delete().eq("id", productId);
    if (delProdErr) return res.status(500).json({ message: "Error deleting product", error: delProdErr.message });

    for (const row of images || []) {
      await deleteStorageObjectByUrl(row.image_url);
      safeUnlink(row.image_url);
    }
    await deleteStorageObjectByUrl(existingProduct?.image_url);
    safeUnlink(existingProduct?.image_url);

    return res.json({ success: true, message: "Product deleted successfully!" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= UPDATE PRODUCT ================= */
router.put("/:productId", upload.array("images", 10), async (req, res) => {
  const { productId } = req.params;
  const { name, price, stock, category, description, location } = req.body;
  const files = req.files || [];

  if (!productId) return res.status(400).json({ message: "Product ID is required" });

  try {
    const { error: updateErr } = await supabase
      .from("products")
      .update({
        product_name: name,
        price,
        stock: stock || 0,
        category: category || "Uncategorized",
        description: description || "",
        location: location || ""
      })
      .eq("id", productId);

    if (updateErr) return res.status(500).json({ message: "Update failed", error: updateErr.message });

    let uploadedImageUrls = [];
    if (files.length > 0) {
      uploadedImageUrls = await uploadProductImages(productId, files);
    }
    if (req.body.imageUrls) {
      try {
        const parsedBodyUrls = JSON.parse(req.body.imageUrls);
        if (Array.isArray(parsedBodyUrls)) {
          uploadedImageUrls = [...uploadedImageUrls, ...parsedBodyUrls];
        }
      } catch (parseErr) {
        console.error("Failed to parse imageUrls:", parseErr);
      }
    }

    if (uploadedImageUrls.length > 0) {
      const galleryRows = uploadedImageUrls.map((imageUrl) => ({ product_id: productId, image_url: imageUrl }));
      const { error: galleryErr } = await supabase.from("product_images").insert(galleryRows);
      if (galleryErr) console.error("[Products] Gallery append error:", galleryErr.message);

      const { data: current } = await supabase.from("products").select("image_url").eq("id", productId).maybeSingle();
      if (!current?.image_url) {
        await supabase.from("products").update({ image_url: uploadedImageUrls[0] || null }).eq("id", productId);
      }
      return res.json({ success: true, message: "Product updated and new images added!" });
    }

    return res.json({ success: true, message: "Product details updated!" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= DELETE SPECIFIC IMAGE ================= */
router.post("/delete-image", async (req, res) => {
  const { productId, imageUrl } = req.body;
  if (!productId || !imageUrl) return res.status(400).json({ message: "Missing productId or imageUrl" });

  try {
    const { error: delGalleryErr } = await supabase
      .from("product_images")
      .delete()
      .eq("product_id", productId)
      .eq("image_url", imageUrl);

    if (delGalleryErr) {
      return res.status(500).json({ message: "Database error during image deletion", error: delGalleryErr.message });
    }

    await deleteStorageObjectByUrl(imageUrl);
    safeUnlink(imageUrl);

    const { data: currentProduct } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", productId)
      .maybeSingle();

    if (currentProduct?.image_url === imageUrl) {
      const { data: nextImages } = await supabase
        .from("product_images")
        .select("image_url, id")
        .eq("product_id", productId)
        .order("id", { ascending: true })
        .limit(1);
      const nextPrimary = nextImages?.[0]?.image_url || null;
      await supabase.from("products").update({ image_url: nextPrimary }).eq("id", productId);
      return res.json({ success: true, message: "Image removed and primary updated", nextPrimary });
    }

    return res.json({ success: true, message: "Gallery image removed" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
