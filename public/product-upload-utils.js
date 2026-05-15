(function () {
  const CLOUDINARY_CLOUD = "dycwsnzyd";
  const CLOUDINARY_TRANSFORM = "f_auto,q_auto,c_limit,w_1400,h_1800";

  function normalizeGallery(product) {
    const images = [];
    const addImage = (value) => {
      if (Array.isArray(value)) {
        value.forEach(addImage);
        return;
      }
      if (typeof value === "string") {
        const text = value.trim();
        if (!text) return;
        if ((text.startsWith("[") && text.endsWith("]")) || (text.startsWith("{") && text.endsWith("}"))) {
          try {
            addImage(JSON.parse(text));
            return;
          } catch (_) { }
        }
        images.push(text);
        return;
      }
      if (value && typeof value === "object") {
        addImage(value.secure_url || value.image_url || value.url || value.src || value.path);
      }
    };

    addImage(product && product.image_url);
    addImage(product && product.gallery);
    addImage(product && product.imageUrls);
    addImage(product && product.images);
    return Array.from(new Set(images.map((img) => String(img || "").trim()).filter(Boolean)));
  }

  function optimizeImageUrl(url) {
    const raw = String(url || "").trim();
    if (!raw || /^data:image\//i.test(raw)) return raw;
    if (!/res\.cloudinary\.com\/[^/]+\/image\/upload\//i.test(raw)) return raw;
    if (/\/image\/upload\/[^/]*(?:c_limit|c_pad|w_|h_|f_auto|q_auto)/i.test(raw)) return raw;
    return raw.replace("/image/upload/", `/image/upload/${CLOUDINARY_TRANSFORM}/`);
  }

  function resolveAssetUrl(url, apiOrigin) {
    let raw = String(url || "").trim();
    if (!raw) return "";
    if (/^data:image\//i.test(raw)) return raw;

    if (raw.includes("localhost") || raw.includes("127.0.0.1")) {
      try {
        raw = new URL(raw).pathname;
      } catch (_) { }
    }

    if (/^https?:\/\//i.test(raw)) return optimizeImageUrl(raw);

    const normalized = raw.replace(/\\/g, "/");
    if (!normalized.includes("/") && /\.(jpg|jpeg|png|webp|gif)$/i.test(normalized)) {
      return optimizeImageUrl(`https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${normalized}`);
    }

    const origin = String(apiOrigin || window.API_ORIGIN || "").replace(/\/$/, "");
    if (!origin) return normalized;

    const lower = normalized.toLowerCase();
    const uploadsWithSlash = lower.indexOf("/uploads/");
    if (uploadsWithSlash >= 0) return `${origin}${normalized.slice(uploadsWithSlash)}`;
    const uploadsNoSlash = lower.indexOf("uploads/");
    if (uploadsNoSlash >= 0) return `${origin}/${normalized.slice(uploadsNoSlash)}`;

    return `${origin}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
  }

  function getProductImages(product, apiOrigin) {
    return normalizeGallery(product).map((img) => resolveAssetUrl(img, apiOrigin)).filter(Boolean);
  }

  window.CLOCHE_PRODUCTS = {
    normalizeGallery,
    optimizeImageUrl,
    resolveAssetUrl,
    getProductImages
  };
})();
