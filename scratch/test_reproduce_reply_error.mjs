import crypto from "crypto";

const BASE_URL = "http://localhost:3099";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before running this script.");
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_AUTH_SECRET || "cloche_master_jwt_secret_key_2026_super_secure_key_84920";

function signJwtToken(payload, expiresInDays = 30) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInDays * 24 * 60 * 60;
  const fullPayload = { ...payload, iat, exp };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signatureInput = `${header}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest("base64url");
  return `${signatureInput}.${signature}`;
}

async function run() {
  console.log("=== REPRODUCING PHOTOGRAPHER REPLY ISSUE ===");
  const amrasVendorId = "dee739bc-7b2f-488e-bf14-96d1fc9e8112";
  const amrasUserId = "0ff5befd-1ad9-42fe-921e-01d65b263e41";

  // Simulate how photographer logs in and gets cookies
  const amrasToken = signJwtToken({
    userId: amrasUserId,
    email: "lala@gmail.com",
    role: "vendor",
    fullName: "Amras Ameen",
  });
  const amrasCookies = `cloche_auth_token=${amrasToken}; auth_token=${amrasToken}; user_role=vendor; user_data=${encodeURIComponent(
    JSON.stringify({ userId: amrasUserId, email: "lala@gmail.com", role: "vendor", vendorId: amrasVendorId })
  )}`;

  // 1. Photographer fetches their conversations
  console.log("\n1. Photographer fetches conversations:");
  const convRes = await fetch(`${BASE_URL}/api/v1/messages?vendorId=${encodeURIComponent(amrasVendorId)}`, {
    headers: { Cookie: amrasCookies },
  });
  const convJson = await convRes.json();
  console.log("Status:", convRes.status);
  const convs = convJson.data?.conversations || [];
  console.log(`Found ${convs.length} conversations:`, convs.map(c => ({ id: c.id, leadId: c.leadId, customer: c.customerName })));

  if (convs.length === 0) {
    console.log("No conversations found to reply to.");
    return;
  }

  // 2. Test reply with various payloads
  for (const c of convs) {
    console.log(`\nTesting reply to conversation for customer: ${c.customerName}`);
    
    // Payload A: Exactly what PhotographerMessagesSection currently sends
    console.log("--- Test A: PhotographerMessagesSection payload ---");
    const payloadA = {
      sender: "vendor",
      leadId: c.leadId,
      conversationId: c.id,
      text: "Test reply from PhotographerMessagesSection",
    };
    const resA = await fetch(`${BASE_URL}/api/v1/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: amrasCookies },
      body: JSON.stringify(payloadA),
    });
    const jsonA = await resA.json();
    console.log("Result A:", resA.status, jsonA);

    // Payload B: If caller sends only conversationId (no leadId)
    console.log("--- Test B: Caller sends only conversationId ---");
    const payloadB = {
      sender: "vendor",
      conversationId: c.id,
      text: "Test reply with only conversationId",
    };
    const resB = await fetch(`${BASE_URL}/api/v1/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: amrasCookies },
      body: JSON.stringify(payloadB),
    });
    const jsonB = await resB.json();
    console.log("Result B:", resB.status, jsonB);

    // Payload C: If caller passes leadId containing conversation prefix (conv-vendor-lead-...)
    console.log("--- Test C: Caller passes leadId as conv-vendor-lead-... ---");
    const payloadC = {
      sender: "vendor",
      leadId: c.id,
      conversationId: c.id,
      text: "Test reply with prefixed leadId",
    };
    const resC = await fetch(`${BASE_URL}/api/v1/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: amrasCookies },
      body: JSON.stringify(payloadC),
    });
    const jsonC = await resC.json();
    console.log("Result C:", resC.status, jsonC);

    // Payload D: What if customer sent conversationId "conv-vendor-<vendorId>" and photographer replies using that
    console.log("--- Test D: Caller passes conversationId 'conv-vendor-<vendorId>' ---");
    const payloadD = {
      sender: "vendor",
      conversationId: `conv-vendor-${amrasVendorId}`,
      customerId: c.customerId,
      customerEmail: c.customerEmail,
      text: "Test reply with conv-vendor-<vendorId>",
    };
    const resD = await fetch(`${BASE_URL}/api/v1/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: amrasCookies },
      body: JSON.stringify(payloadD),
    });
    const jsonD = await resD.json();
    console.log("Result D:", resD.status, jsonD);
  }
}

run().catch(console.error);

