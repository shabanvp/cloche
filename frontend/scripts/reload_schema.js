const { Pool } = require("pg");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://cloche_admin:NTjHL0csUdFfp8jZ11HAJaax5dfgFspZ@dpg-d9qu2u49v7es73flis00-a.singapore-postgres.render.com/cloche_db";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function reload() {
  console.log("Reloading PostgREST schema cache in PostgreSQL...");
  try {
    await pool.query("NOTIFY pgrst, 'reload schema';");
    console.log("✓ Successfully sent 'NOTIFY pgrst, reload schema'!");
  } catch (err) {
    console.error("Error reloading schema:", err.message);
  } finally {
    await pool.end();
  }
}

reload();
