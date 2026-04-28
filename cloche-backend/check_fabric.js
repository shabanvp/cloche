const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const supabase = require("./supabase");

async function checkFabric() {
  console.log("Checking products table for fabric data...");
  const { data, error } = await supabase
    .from("products")
    .select("product_name, fabric")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching products:", error.message);
    return;
  }

  console.table(data);
}

checkFabric();
