import crypto from "crypto";

const BASE_URL = "http://localhost:3099";
const SUPABASE_URL = "https://fumfjbcixcudjrnezfjl.supabase.co";
const SERVICE_KEY = "sb_secret_UrI6GZ8y25k5U8HheVLKnQ_LRbo08ox";
const JWT_SECRET = process.env.JWT_SECRET || process.env.NEXT_AUTH_SECRET || "cloche_master_jwt_secret_key_2026_super_secure_key_84920";

function signJwt(payload, expiresInDays = 30) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + expiresInDays * 24 * 60 * 60;
  const fullPayload = { ...payload, iat, exp };
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signatureInput = `${header}.${encodedPayload}`;
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(signatureInput).digest("base64url");
  return `${signatureInput}.${signature}`;
}

async function fetchWithRetry(url, opts, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, opts);
      return res;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise((r) => setTimeout(r, 600));
    }
  }
}

async function main() {
  console.log("=================================================================");
  console.log("=== RUNNING MANDATORY TEST: PHOTOGRAPHER REPLY & DUAL INBOXES ===");
  console.log("=================================================================");

  const amrasVendorId = "dee739bc-7b2f-488e-bf14-96d1fc9e8112";
  const amrasUserId = "0ff5befd-1ad9-42fe-921e-01d65b263e41";
  const aishaUserId = "a3ba05ee-81b9-4f50-94e5-cf9ece34de7d";

  const aishaToken = signJwt({
    userId: aishaUserId,
    email: "aisha.wedding@cloche.luxury",
    fullName: "Aisha",
    role: "customer",
  });
  const aishaCookies = `cloche_auth_token=${aishaToken}; auth_token=${aishaToken}; user_role=customer; user_data=${encodeURIComponent(
    JSON.stringify({ userId: aishaUserId, email: "aisha.wedding@cloche.luxury", name: "Aisha", fullName: "Aisha", role: "customer" })
  )}`;

  const amrasToken = signJwt({
    userId: amrasUserId,
    email: "lala@gmail.com",
    role: "vendor",
    fullName: "Amras Ameen",
  });
  const amrasCookies = `cloche_auth_token=${amrasToken}; auth_token=${amrasToken}; user_role=vendor; user_data=${encodeURIComponent(
    JSON.stringify({ userId: amrasUserId, email: "lala@gmail.com", name: "Amras Ameen", fullName: "Amras Ameen", role: "vendor", vendorId: amrasVendorId })
  )}`;

  // 1. Customer: Aisha sends a message to Amras Ameen Photography
  console.log("\n--- STEP 1: Customer (Aisha) sends message to Amras Ameen Photography ---");
  const aishaMsgText = "Hello Amras! I loved your portfolio. Are you free for our December wedding?";
  const sendRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: aishaCookies },
    body: JSON.stringify({
      sender: "customer",
      vendorId: amrasVendorId,
      conversationId: `conv-vendor-${amrasVendorId}`,
      text: aishaMsgText,
    }),
  });
  const sendJson = await sendRes.json();
  console.log("Aisha send status:", sendRes.status, "data:", sendJson.data);
  if (!sendJson.success) throw new Error("Aisha could not send message: " + JSON.stringify(sendJson));

  const activeLeadId = sendJson.data?.leadId;
  console.log("Active Lead ID:", activeLeadId);

  // 2. Customer: Aisha verifies message in /messages
  console.log("\n--- STEP 2: Customer (Aisha) checks /messages ---");
  const aishaInboxRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    headers: { Cookie: aishaCookies },
  });
  const aishaInbox = await aishaInboxRes.json();
  const aishaConv = aishaInbox.data?.conversations?.find((c) => String(c.vendorId) === amrasVendorId);
  console.log("Aisha sees conversation:", {
    id: aishaConv?.id,
    vendorName: aishaConv?.vendorName,
    lastSnippet: aishaConv?.lastMessageSnippet,
    totalMessages: aishaConv?.messages?.length,
  });
  if (!aishaConv) throw new Error("Conversation missing from Aisha's inbox!");

  // 3. Photographer: Amras logs in and opens Dashboard -> Messages
  console.log("\n--- STEP 3: Photographer (Amras) logs in and checks Dashboard -> Messages ---");
  const amrasInboxRes = await fetchWithRetry(
    `${BASE_URL}/api/v1/messages?vendorId=${encodeURIComponent(amrasVendorId)}`,
    { headers: { Cookie: amrasCookies } }
  );
  const amrasInbox = await amrasInboxRes.json();
  const amrasConv = amrasInbox.data?.conversations?.find((c) => c.customerName === "Aisha");
  console.log("Amras sees Aisha's conversation:", {
    id: amrasConv?.id,
    leadId: amrasConv?.leadId,
    customerName: amrasConv?.customerName,
    customerAvatar: amrasConv?.customerAvatar,
    unreadCount: amrasConv?.unreadCount,
    lastSnippet: amrasConv?.lastMessageSnippet,
  });
  if (!amrasConv) throw new Error("Aisha's conversation missing from Amras's inbox!");
  if (amrasConv.customerName !== "Aisha") throw new Error(`Expected Aisha, got ${amrasConv.customerName}`);

  // 4. Photographer: Amras types a reply and clicks Send
  console.log("\n--- STEP 4: Photographer (Amras) replies to Aisha ---");
  const amrasReplyText = "Hi Aisha! Yes, December is currently open for booking. I would be thrilled to document your wedding day!";
  const replyRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: amrasCookies },
    body: JSON.stringify({
      sender: "vendor",
      leadId: amrasConv.leadId,
      conversationId: amrasConv.id,
      customerId: amrasConv.customerId,
      customerEmail: amrasConv.customerEmail,
      customerName: amrasConv.customerName,
      vendorId: amrasVendorId,
      text: amrasReplyText,
    }),
  });
  const replyJson = await replyRes.json();
  console.log("Amras reply status:", replyRes.status, "data:", replyJson);

  // CRITICAL CHECK: Verify reply succeeded without displaying "Conversation lead not found."
  if (replyRes.status !== 201 || !replyJson.success) {
    throw new Error(`CRITICAL BUG DETECTED: Amras reply failed with status ${replyRes.status}: ${JSON.stringify(replyJson)}`);
  }
  console.log(">>> CHECK PASSED: Amras reply saved successfully in Supabase without 'Conversation lead not found'!");

  // 5. Customer: Aisha opens Message Center and confirms Amras's reply appears
  console.log("\n--- STEP 5: Returning to Customer (Aisha) -> Verifying Amras's reply ---");
  const aishaUpdatedRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    headers: { Cookie: aishaCookies },
  });
  const aishaUpdated = await aishaUpdatedRes.json();
  const aishaConvUpdated = aishaUpdated.data?.conversations?.find((c) => String(c.vendorId) === amrasVendorId);
  console.log("Aisha updated conversation:", {
    vendorName: aishaConvUpdated?.vendorName,
    unreadCount: aishaConvUpdated?.unreadCount,
    lastSnippet: aishaConvUpdated?.lastMessageSnippet,
    totalMessages: aishaConvUpdated?.messages?.length,
  });

  if (!aishaConvUpdated?.lastMessageSnippet.includes("December is currently open")) {
    throw new Error(`Expected snippet to show Amras's reply, got: "${aishaConvUpdated?.lastMessageSnippet}"`);
  }
  if (aishaConvUpdated.unreadCount < 1) {
    throw new Error(`Expected unreadCount >= 1 for new vendor reply, got: ${aishaConvUpdated.unreadCount}`);
  }
  console.log(">>> CHECK PASSED: Amras's reply appears in Aisha's Message Center with unread indicator!");

  // 6. Customer: Aisha replies again
  console.log("\n--- STEP 6: Customer (Aisha) replies again ---");
  const aishaSecondReply = "Wonderful! Please send me the link to your pricing packages.";
  const aishaSecondRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: aishaCookies },
    body: JSON.stringify({
      sender: "customer",
      leadId: aishaConvUpdated.leadId,
      vendorId: amrasVendorId,
      text: aishaSecondReply,
    }),
  });
  const aishaSecondJson = await aishaSecondRes.json();
  console.log("Aisha second reply status:", aishaSecondRes.status, aishaSecondJson);
  if (!aishaSecondJson.success) throw new Error("Aisha second reply failed: " + JSON.stringify(aishaSecondJson));

  // 7. Photographer: Amras receives Aisha's second reply in the same thread
  console.log("\n--- STEP 7: Verifying Amras receives Aisha's second reply in SAME thread ---");
  const amrasFinalRes = await fetchWithRetry(
    `${BASE_URL}/api/v1/messages?vendorId=${encodeURIComponent(amrasVendorId)}`,
    { headers: { Cookie: amrasCookies } }
  );
  const amrasFinal = await amrasFinalRes.json();
  const amrasAishaThreads = (amrasFinal.data?.conversations || []).filter((c) => c.customerName === "Aisha");
  console.log(`Total threads for Aisha in Amras inbox: ${amrasAishaThreads.length}`);
  if (amrasAishaThreads.length !== 1) {
    throw new Error(`CRITICAL: Expected exactly 1 unified thread for Aisha, found ${amrasAishaThreads.length}`);
  }
  const finalThread = amrasAishaThreads[0];
  console.log("Final conversation summary:", {
    id: finalThread.id,
    customerName: finalThread.customerName,
    unreadCount: finalThread.unreadCount,
    lastSnippet: finalThread.lastMessageSnippet,
    messageCount: finalThread.messages?.length,
  });
  if (!finalThread.lastMessageSnippet.includes("pricing packages")) {
    throw new Error(`Expected snippet to show Aisha's second message, got: "${finalThread.lastMessageSnippet}"`);
  }
  console.log(">>> CHECK PASSED: Two-way communication verified with unified thread & zero duplicates!");

  // 8. Session Persistence / Refresh Test
  console.log("\n--- STEP 8: Testing new session logout & login persistence ---");
  const freshAmrasToken = signJwt({
    userId: amrasUserId,
    email: "lala@gmail.com",
    role: "vendor",
    fullName: "Amras Ameen",
  });
  const freshAmrasCookies = `cloche_auth_token=${freshAmrasToken}; auth_token=${freshAmrasToken}; user_role=vendor`;
  const refreshRes = await fetchWithRetry(
    `${BASE_URL}/api/v1/messages?vendorId=${encodeURIComponent(amrasVendorId)}`,
    { headers: { Cookie: freshAmrasCookies } }
  );
  const refreshJson = await refreshRes.json();
  const refreshedThread = refreshJson.data?.conversations?.find((c) => c.customerName === "Aisha");
  console.log("After fresh login, conversation intact with messages count:", refreshedThread?.messages?.length);
  if (!refreshedThread || (refreshedThread.messages?.length || 0) < 3) {
    throw new Error("Conversation history lost after session refresh!");
  }
  console.log(">>> CHECK PASSED: Full conversation history persists across sessions!");

  console.log("\n=================================================================");
  console.log(">>> ALL MANDATORY TEST STEPS COMPLETED & VERIFIED 100% SUCCESS! <<<");
  console.log("=================================================================\n");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});

