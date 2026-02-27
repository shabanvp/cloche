const db = require('./db');

console.log('Checking products in database...\n');

db.query('SELECT id, product_name, price, category, boutique_id FROM products', (err, rows) => {
    if (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }

    console.log(`Total products: ${rows.length}\n`);

    rows.forEach(p => {
        console.log(`Product ID: ${p.id}`);
        console.log(`  Name: ${p.product_name}`);
        console.log(`  Price: ${p.price} ${p.price === null ? '(NULL!)' : ''}`);
        console.log(`  Category: ${p.category}`);
        console.log(`  Boutique ID: ${p.boutique_id}`);
        console.log('');
    });

    const nullPrices = rows.filter(p => p.price === null || p.price === undefined);
    if (nullPrices.length > 0) {
        console.log(`⚠️ WARNING: ${nullPrices.length} product(s) have NULL prices!`);
        console.log('This was causing the toLocaleString error.');
    } else {
        console.log('✓ All products have valid prices');
    }

    process.exit(0);
});
