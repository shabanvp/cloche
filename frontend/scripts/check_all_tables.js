const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://cloche_admin:NTjHL0csUdFfp8jZ11HAJaax5dfgFspZ@dpg-d9qu2u49v7es73flis00-a.singapore-postgres.render.com/cloche_db";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function check() {
  console.log("Checking all table counts in PostgreSQL...");
  const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';");
  for (const row of res.rows) {
    try {
      const countRes = await pool.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
      const count = countRes.rows[0].count;
      if (Number(count) > 0) {
        console.log(`Table: ${row.table_name} — Rows: ${count}`);
      }
    } catch (e) {
      console.log(`Table: ${row.table_name} — Error: ${e.message}`);
    }
  }
  await pool.end();
}

check();
