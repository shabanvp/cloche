const baseUrl = "https://cloche-six.vercel.app";

const CATEGORY_MAP = {
  decorator: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  decorators: { slug: "decor-planning", name: "Decor & Event Planners", url: "/decor-planning" },
  photographer: { slug: "photographers", name: "Photographers", url: "/photographers" },
  photographers: { slug: "photographers", name: "Photographers", url: "/photographers" }
};

const CITY_LIST = ["thrissur", "mumbai", "kochi", "calicut"];

function extractCategoryAndCity(query) {
  const lower = query.toLowerCase();
  let matchedCategory;
  let matchedCity;

  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    const regex = new RegExp("\\b" + key + "\\b", "i");
    if (regex.test(lower)) {
      matchedCategory = cat;
      break;
    }
  }

  for (const c of CITY_LIST) {
    const regex = new RegExp("\\b" + c + "\\b", "i");
    if (regex.test(lower)) {
      matchedCity = c.charAt(0).toUpperCase() + c.slice(1);
      break;
    }
  }

  return { category: matchedCategory, city: matchedCity };
}

async function testAuraQuery(query) {
  console.log("\n=======================================================");
  console.log("USER:", query);
  const lower = query.toLowerCase();

  // 1. Guardrail: Action requests
  const actionKeywords = ["book", "booking", "quote", "quotation", "hire", "edit my", "update my", "create lead"];
  const isActionRequest = actionKeywords.some((w) => lower.includes(w));

  if (isActionRequest) {
    console.log("\nAURA (Verbatim Response):");
    console.log("I am currently in guest discovery mode, so I cannot directly book services, generate custom quotation documents, or modify vendor accounts. You can connect directly with vendors via phone or WhatsApp on their profile pages, or sign up for a Cloche account to manage inquiries.");
    console.log("\nAction Redirect Options: [Sign Up Free (/signup), Log In (/login)]");
    return;
  }

  // 2. Discovery
  const { category, city } = extractCategoryAndCity(query);
  const params = new URLSearchParams();
  if (category) params.set("category", category.slug);
  if (city) params.set("city", city);
  params.set("limit", "12");

  const fullUrl = `${baseUrl}/api/v1/public/vendors?${params.toString()}`;
  console.log("LIVE PRODUCTION API CALL:", fullUrl);

  const res = await fetch(fullUrl);
  const json = await res.json();
  const rawItems = Array.isArray(json.data) ? json.data : [];

  if (rawItems.length > 0) {
    console.log("\nAURA (Verbatim Response):");
    console.log(`Here are ${rawItems.length} verified ${category?.name || "vendors"} in ${city} registered on Cloche:`);
    console.log("\nGROUNDED VENDOR CARDS RETURNED FROM LIVE API:");
    rawItems.forEach((v, idx) => {
      console.log(`  [Card ${idx + 1}]`);
      console.log(`    Name: ${v.name}`);
      console.log(`    Category: ${v.category}`);
      console.log(`    Location: ${v.city}, ${v.state}`);
      console.log(`    Rating: ${v.rating > 0 ? v.rating.toFixed(1) : "New"}`);
      console.log(`    Starting Price: ${v.startingPrice || "Contact for pricing"}`);
      console.log(`    Verified: ${v.isVerified}`);
      console.log(`    Profile URL: /boutiques/${v.slug || v.vendorCode || v.id}`);
    });
  } else {
    console.log("\nAURA (Verbatim Response):");
    console.log(`I searched our live vendor database for ${category?.name || "vendors"} in ${city}, but there are currently no registered vendors matching those exact criteria. You can browse all available ${category?.name || "vendors"} across Kerala or explore our directory.`);
    console.log("Category Explore Link:", category?.url || "/vendors");
  }
}

async function run() {
  await testAuraQuery("find me a decorator in Thrissur");
  await testAuraQuery("find me a photographer in Mumbai");
  await testAuraQuery("book shaban for my wedding");
  await testAuraQuery("send me a quote from adidas");
}

run();
