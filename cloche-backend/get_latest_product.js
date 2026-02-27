const db = require("./db");

async function getLatestProduct() {
    try {
        const [rows] = await db.promise().query("SELECT id FROM products ORDER BY id DESC LIMIT 1");
        if (rows.length > 0) {
            const productId = rows[0].id;
            console.log(`LATEST_PRODUCT_ID:${productId}`);
            console.log(`VERIFICATION_URL:http://localhost:5001/viewproducts.html?productId=${productId}`);

            // Also check gallery
            const [gallery] = await db.promise().query("SELECT image_url FROM product_images WHERE product_id = ?", [productId]);
            console.log(`GALLERY_COUNT:${gallery.length}`);
            console.log("GALLERY_IMAGES:", gallery.map(g => g.image_url));
        } else {
            console.log("No products found.");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

getLatestProduct();
