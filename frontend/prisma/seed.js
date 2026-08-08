require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not defined.');
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Seed Data ────────────────────────────────────────────────────────

const ROLES = [
  { name: 'customer',    description: 'Customer role for couples booking vendors' },
  { name: 'vendor',      description: 'Vendor role for wedding businesses and boutique owners' },
  { name: 'admin',       description: 'Administrative role for managing the platform' },
  { name: 'super_admin', description: 'Super administrator role with absolute control' },
];

const VENDOR_CATEGORIES = [
  { name: 'Bridal Boutique',      slug: 'bridal-boutique',      description: 'Bridal wear and trousseau' },
  { name: 'Groom Wear',           slug: 'groom-wear',           description: 'Sherwani and suits for grooms' },
  { name: 'Wedding Venue',        slug: 'wedding-venue',        description: 'Banquet halls and outdoor venues' },
  { name: 'Photographer',         slug: 'photographer',         description: 'Wedding photography and photo albums' },
  { name: 'Videographer',         slug: 'videographer',         description: 'Cinematic wedding films and reels' },
  { name: 'Makeup Artist',        slug: 'makeup-artist',        description: 'Bridal makeup and grooming' },
  { name: 'Mehendi Artist',       slug: 'mehendi-artist',       description: 'Bridal and guest mehendi designs' },
  { name: 'Wedding Planner',      slug: 'wedding-planner',      description: 'Full-service wedding coordination' },
  { name: 'Decorator',            slug: 'decorator',            description: 'Floral and theme-based decor' },
  { name: 'Caterer',              slug: 'caterer',              description: 'Wedding catering and live counters' },
  { name: 'Jewellery Store',      slug: 'jewellery-store',      description: 'Bridal jewellery and accessories' },
  { name: 'Invitation Designer',  slug: 'invitation-designer',  description: 'Custom wedding invitations and stationery' },
  { name: 'Cake Designer',        slug: 'cake-designer',        description: 'Wedding cakes and dessert tables' },
  { name: 'Entertainment',        slug: 'entertainment',        description: 'Dhol, live bands and performers' },
  { name: 'Choreographer',        slug: 'choreographer',        description: 'Sangeet and wedding dance choreography' },
  { name: 'Car Rental',           slug: 'car-rental',           description: 'Bridal cars and luxury fleet' },
  { name: 'Flower Decoration',    slug: 'flower-decoration',    description: 'Floral arrangements and bouquets' },
  { name: 'Rental Services',      slug: 'rental-services',      description: 'Furniture, tent and equipment rental' },
  { name: 'Gift Store',           slug: 'gift-store',           description: 'Wedding favours and return gifts' },
  { name: 'Honeymoon Planner',    slug: 'honeymoon-planner',    description: 'Honeymoon packages and travel' },
  { name: 'Other',                slug: 'other',                description: 'Other wedding services' },
];

// ─── Main ─────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== Seeding Roles ===');
  for (const role of ROLES) {
    const upserted = await prisma.role.upsert({
      where:  { name: role.name },
      update: { description: role.description },
      create: { name: role.name, description: role.description },
    });
    console.log(`  [OK] role: ${upserted.name}`);
  }

  console.log('\n=== Seeding Vendor Categories ===');
  for (const cat of VENDOR_CATEGORIES) {
    const upserted = await prisma.vendorCategory.upsert({
      where:  { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description },
    });
    console.log(`  [OK] vendor_category: ${upserted.name} (${upserted.slug})`);
  }

  console.log('\n=== Seeding completed successfully. ===\n');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
