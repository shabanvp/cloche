require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const query = `
    ALTER TABLE boutiques 
    ADD COLUMN IF NOT EXISTS category VARCHAR(255),
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS state VARCHAR(255),
    ADD COLUMN IF NOT EXISTS pincode VARCHAR(50),
    ADD COLUMN IF NOT EXISTS website VARCHAR(255),
    ADD COLUMN IF NOT EXISTS instagram VARCHAR(255),
    ADD COLUMN IF NOT EXISTS facebook VARCHAR(255),
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS logo_url VARCHAR(1000),
    ADD COLUMN IF NOT EXISTS cover_url VARCHAR(1000),
    ADD COLUMN IF NOT EXISTS gst_number VARCHAR(100);
  `;
  
  // Actually we need to execute this as raw SQL. supabase-js doesn't support raw SQL from client directly unless via rpc.
  // We can just use pg module.
}
run();
