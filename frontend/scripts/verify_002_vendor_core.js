require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function verify() {
  const tablesQ = await pool.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public'
       AND table_name IN ('vendor_categories','vendors','vendor_profiles','users','roles','user_roles','sessions')
     ORDER BY table_name`
  );
  console.log('\n=== Tables in cloche_db ===');
  tablesQ.rows.forEach(r => console.log(' ', r.table_name));

  const idxQ = await pool.query(
    `SELECT indexname, tablename FROM pg_indexes
     WHERE schemaname = 'public'
       AND tablename IN ('vendor_categories','vendors','vendor_profiles')
     ORDER BY tablename, indexname`
  );
  console.log('\n=== Indexes on vendor tables ===');
  idxQ.rows.forEach(r => console.log(`  ${r.tablename}: ${r.indexname}`));

  const catQ = await pool.query(`SELECT name, slug FROM vendor_categories ORDER BY name`);
  console.log(`\n=== vendor_categories rows (${catQ.rowCount}) ===`);
  catQ.rows.forEach(r => console.log(`  ${r.name} (${r.slug})`));

  const colQ = await pool.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema='public' AND table_name='users' AND column_name IN ('reset_token','reset_token_expires_at')
     ORDER BY column_name`
  );
  console.log('\n=== users columns added this migration ===');
  colQ.rows.forEach(r => console.log(' ', r.column_name));

  await pool.end();
}

verify().catch(e => { console.error(e.message); process.exit(1); });
