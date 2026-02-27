const db = require('./db');

const productId = 1; // Change this to the product ID you want to delete

console.log(`Deleting product ID: ${productId}...\n`);

// First, delete images from product_images table
db.query('DELETE FROM product_images WHERE product_id = ?', [productId], (err) => {
    if (err) {
        console.error('Error deleting product images:', err.message);
        process.exit(1);
    }

    console.log('✓ Deleted product images from gallery');

    // Then delete the product itself
    db.query('DELETE FROM products WHERE id = ?', [productId], (err, result) => {
        if (err) {
            console.error('Error deleting product:', err.message);
            process.exit(1);
        }

        if (result.affectedRows === 0) {
            console.log('⚠️ No product found with that ID');
        } else {
            console.log(`✅ Successfully deleted product ID ${productId}`);
        }

        // Show remaining products
        db.query('SELECT id, product_name FROM products', (err, rows) => {
            if (!err) {
                console.log(`\nRemaining products: ${rows.length}`);
                rows.forEach(p => {
                    console.log(`  - ID ${p.id}: ${p.product_name}`);
                });
            }
            process.exit(0);
        });
    });
});
