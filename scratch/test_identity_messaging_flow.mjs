import crypto from "crypto";

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

const BASE_URL = "http://localhost:3099";
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) throw new Error("Set SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY before running this script.");

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

async function runTest() {
  console.log("=== STARTING CLOCHE MESSAGING & ACTUAL USER IDENTITY TEST ===");

  // 1. Verify Photographer Account B: Amras Ameen Photography
  console.log("\n--- STEP 1: Verifying Photographer Account B (Amras Ameen) ---");
  const vendorRes = await fetchWithRetry(
    `${SUPABASE_URL}/rest/v1/vendors?id=eq.dee739bc-7b2f-488e-bf14-96d1fc9e8112&select=id,user_id,vendor_profiles(id,business_name,slug,city,state,logo_media:media!logo_media_id(cdn_url,file_path))&limit=1`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const vendorRows = await vendorRes.json();
  const amrasVendor = vendorRows[0];
  if (!amrasVendor) throw new Error("Amras Ameen vendor record not found in Supabase.");
  const amrasProfile = amrasVendor.vendor_profiles?.[0] || amrasVendor.vendor_profiles;
  console.log("Photographer found:", {
    vendorId: amrasVendor.id,
    businessName: amrasProfile?.business_name,
    userId: amrasVendor.user_id,
  });

  const amrasAuthToken = signJwtToken({
    userId: amrasVendor.user_id,
    email: "lala@gmail.com",
    role: "vendor",
    fullName: "Amras Ameen",
  });

  // 2. Ensure Customer Account A: Aisha
  console.log("\n--- STEP 2: Setting up Customer Account A (Aisha) ---");
  const aishaEmail = "aisha.wedding@cloche.luxury";
  const aishaAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
  let aishaUserId = "";

  const checkAisha = await fetchWithRetry(
    `${SUPABASE_URL}/rest/v1/users?email=eq.${encodeURIComponent(aishaEmail)}&select=id,email,full_name,name,avatar_url&limit=1`,
    { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } }
  );
  const aishaRows = await checkAisha.json();
  if (Array.isArray(aishaRows) && aishaRows.length > 0) {
    aishaUserId = aishaRows[0].id;
    // Ensure actual profile name and avatar are up to date
    await fetchWithRetry(
      `${SUPABASE_URL}/rest/v1/users?id=eq.${encodeURIComponent(aishaUserId)}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({
          full_name: "Aisha",
          name: "Aisha",
          avatar_url: aishaAvatar,
        }),
      }
    );
    console.log("Existing Aisha user updated:", { id: aishaUserId, name: "Aisha", avatar: aishaAvatar });
  } else {
    // Create Supabase Auth user & public.users record for Aisha
    const createAuth = await fetchWithRetry(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        email: aishaEmail,
        password: "PasswordAisha123!",
        email_confirm: true,
        user_metadata: { full_name: "Aisha", role: "customer" },
      }),
    });
    const authData = await createAuth.json();
    aishaUserId = authData.id;

    await fetchWithRetry(`${SUPABASE_URL}/rest/v1/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        id: aishaUserId,
        email: aishaEmail,
        full_name: "Aisha",
        name: "Aisha",
        avatar_url: aishaAvatar,
        phone: "9876543211",
        is_active: true,
        is_verified: true,
      }),
    });
    console.log("New Aisha customer created:", { id: aishaUserId, name: "Aisha", avatar: aishaAvatar });
  }

  const aishaAuthToken = signJwtToken({
    userId: aishaUserId,
    email: aishaEmail,
    role: "customer",
    fullName: "Aisha",
  });

  const aishaCookies = `cloche_auth_token=${aishaAuthToken}; user_role=customer; user_data=${encodeURIComponent(
    JSON.stringify({ id: aishaUserId, email: aishaEmail, full_name: "Aisha", role: "customer" })
  )}`;

  const amrasCookies = `cloche_auth_token=${amrasAuthToken}; user_role=vendor; user_data=${encodeURIComponent(
    JSON.stringify({ id: amrasVendor.user_id, email: "lala@gmail.com", full_name: "Amras Ameen", role: "vendor" })
  )}`;

  // 3. Step 3: Aisha sends message to Amras Ameen Photography
  console.log("\n--- STEP 3: Aisha sends first message to Amras Ameen Photography ---");
  const sendRes1 = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: aishaCookies,
    },
    body: JSON.stringify({
      vendorId: amrasVendor.id,
      text: "Are you available on December 20 for our wedding photography?",
      eventType: "Wedding",
      sender: "customer",
    }),
  });
  const send1Json = await sendRes1.json();
  console.log("Aisha message sent response:", sendRes1.status, send1Json);
  if (!send1Json.success) throw new Error("Aisha failed to send message: " + JSON.stringify(send1Json));
  const activeLeadId = send1Json.data.leadId;

  // 4. Step 4: Aisha views her Message Center
  console.log("\n--- STEP 4: Verifying Aisha's Message Center (/messages) ---");
  const aishaInboxRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    headers: { Cookie: aishaCookies },
  });
  const aishaInbox = await aishaInboxRes.json();
  console.log("Aisha inbox conversations count:", aishaInbox.data?.conversations?.length);
  const amrasThreadForAisha = aishaInbox.data?.conversations?.find(
    (c) => String(c.vendorId) === String(amrasVendor.id)
  );
  if (!amrasThreadForAisha) {
    throw new Error("Conversation with Amras Ameen Photography not found in Aisha's Message Center!");
  }
  console.log("Aisha sees conversation:", {
    vendorName: amrasThreadForAisha.vendorName,
    vendorAvatar: amrasThreadForAisha.vendorAvatar ? "Present" : "Fallback",
    latestMessageSnippet: amrasThreadForAisha.lastMessageSnippet,
    messageCount: amrasThreadForAisha.messages?.length,
  });
  if (!amrasThreadForAisha.vendorName.includes("Amras Ameen")) {
    throw new Error(`Expected Amras Ameen Photography, got: ${amrasThreadForAisha.vendorName}`);
  }

  // 5. Step 5: Amras opens Photographer Dashboard Messages
  console.log("\n--- STEP 5: Verifying Amras's Dashboard Messages (Photographer View) ---");
  const amrasInboxRes = await fetchWithRetry(
    `${BASE_URL}/api/v1/messages?vendorId=${encodeURIComponent(amrasVendor.id)}`,
    { headers: { Cookie: amrasCookies } }
  );
  const amrasInbox = await amrasInboxRes.json();
  console.log("Amras inbox conversations count:", amrasInbox.data?.conversations?.length);
  const aishaThreadForAmras = amrasInbox.data?.conversations?.find(
    (c) => c.leadId === activeLeadId || c.leadIds?.includes(activeLeadId)
  );
  if (!aishaThreadForAmras) {
    throw new Error("Aisha's inquiry conversation not found in Amras's Messages!");
  }
  console.log("Amras sees Aisha's conversation:", {
    customerName: aishaThreadForAmras.customerName,
    customerAvatar: aishaThreadForAmras.customerAvatar,
    unreadCount: aishaThreadForAmras.unreadCount,
    lastMessageSnippet: aishaThreadForAmras.lastMessageSnippet,
    messages: aishaThreadForAmras.messages?.map((m) => ({
      sender: m.sender,
      senderName: m.senderName,
      text: m.text,
    })),
  });

  // STRICT REQUIREMENT CHECK: Customer Name must be Aisha (NOT generic "Customer" / "Anonymous")
  if (aishaThreadForAmras.customerName !== "Aisha") {
    throw new Error(`CRITICAL: Expected customerName to be "Aisha", got: "${aishaThreadForAmras.customerName}"`);
  }
  if (!aishaThreadForAmras.customerAvatar || !aishaThreadForAmras.customerAvatar.includes("unsplash.com")) {
    throw new Error(`CRITICAL: Expected customerAvatar to be Aisha's uploaded profile picture, got: "${aishaThreadForAmras.customerAvatar}"`);
  }
  if (aishaThreadForAmras.unreadCount < 1) {
    throw new Error(`CRITICAL: Expected unreadCount to be >= 1 for incoming message, got: ${aishaThreadForAmras.unreadCount}`);
  }
  console.log(">>> CHECK PASSED: Amras sees Aisha's actual registered name and profile picture with unread indicator!");

  // 6. Step 6: Amras marks conversation as read
  console.log("\n--- STEP 6: Amras marks Aisha's conversation as read ---");
  const readRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: amrasCookies },
    body: JSON.stringify({ action: "mark_read", leadId: activeLeadId }),
  });
  console.log("Mark as read response status:", readRes.status);

  // Check that unread count is now 0 for Amras
  const amrasAfterReadRes = await fetchWithRetry(
    `${BASE_URL}/api/v1/messages?vendorId=${encodeURIComponent(amrasVendor.id)}`,
    { headers: { Cookie: amrasCookies } }
  );
  const amrasAfterRead = await amrasAfterReadRes.json();
  const aishaThreadAfterRead = amrasAfterRead.data?.conversations?.find(
    (c) => c.leadId === activeLeadId || c.leadIds?.includes(activeLeadId)
  );
  console.log("Amras unread count after opening conversation:", aishaThreadAfterRead?.unreadCount);
  if (aishaThreadAfterRead?.unreadCount !== 0) {
    throw new Error(`Expected unreadCount to be 0 after reading, got: ${aishaThreadAfterRead?.unreadCount}`);
  }

  // 7. Step 7: Amras replies to Aisha
  console.log("\n--- STEP 7: Amras replies to Aisha's message ---");
  const replyText = "Hello Aisha! Yes, December 20 is available. I'd love to capture your wedding.";
  const replyRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: amrasCookies },
    body: JSON.stringify({
      sender: "vendor",
      leadId: activeLeadId,
      conversationId: aishaThreadForAmras.id,
      text: replyText,
    }),
  });
  const replyJson = await replyRes.json();
  console.log("Amras reply response:", replyRes.status, replyJson);
  if (!replyJson.success) throw new Error("Amras reply failed: " + JSON.stringify(replyJson));

  // 8. Step 8: Return to Aisha (Customer) -> Verify reply appears in Aisha's existing conversation
  console.log("\n--- STEP 8: Returning to Account A (Aisha) -> Verifying Amras's reply ---");
  const aishaAfterReplyRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    headers: { Cookie: aishaCookies },
  });
  const aishaAfterReply = await aishaAfterReplyRes.json();
  const amrasThreadAfterReply = aishaAfterReply.data?.conversations?.find(
    (c) => String(c.vendorId) === String(amrasVendor.id)
  );
  console.log("Aisha sees updated conversation:", {
    vendorName: amrasThreadAfterReply?.vendorName,
    unreadCount: amrasThreadAfterReply?.unreadCount,
    lastMessageSnippet: amrasThreadAfterReply?.lastMessageSnippet,
    totalMessages: amrasThreadAfterReply?.messages?.length,
  });

  if (amrasThreadAfterReply?.unreadCount < 1) {
    throw new Error(`Expected Aisha unreadCount to be >= 1 for Amras's new reply, got: ${amrasThreadAfterReply?.unreadCount}`);
  }
  if (!amrasThreadAfterReply?.lastMessageSnippet.includes("December 20 is available")) {
    throw new Error(`Expected latest message snippet to show Amras's reply, got: "${amrasThreadAfterReply?.lastMessageSnippet}"`);
  }
  console.log(">>> CHECK PASSED: Amras's reply appears in Aisha's existing conversation with unread badge!");

  // 9. Step 9: Aisha marks as read and sends follow-up message
  console.log("\n--- STEP 9: Aisha marks as read and sends second message ---");
  await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Cookie: aishaCookies },
    body: JSON.stringify({ action: "mark_read", leadId: activeLeadId }),
  });

  const followUpText = "Thank you Amras! Can you share your wedding photography packages?";
  const followUpRes = await fetchWithRetry(`${BASE_URL}/api/v1/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: aishaCookies },
    body: JSON.stringify({
      vendorId: amrasVendor.id,
      leadId: activeLeadId,
      text: followUpText,
      sender: "customer",
    }),
  });
  const followUpJson = await followUpRes.json();
  console.log("Aisha follow-up response:", followUpRes.status, followUpJson);

  // 10. Step 10: Verify Amras receives follow-up immediately in the same conversation
  console.log("\n--- STEP 10: Verifying Amras receives follow-up in the same conversation thread ---");
  const amrasFinalRes = await fetchWithRetry(
    `${BASE_URL}/api/v1/messages?vendorId=${encodeURIComponent(amrasVendor.id)}`,
    { headers: { Cookie: amrasCookies } }
  );
  const amrasFinal = await amrasFinalRes.json();
  const amrasConversations = amrasFinal.data?.conversations || [];
  // Ensure NO duplicate conversations between Aisha and Amras
  const aishaConversationsForAmras = amrasConversations.filter(
    (c) => c.customerName === "Aisha"
  );
  console.log("Total conversation threads for Aisha in Amras's inbox:", aishaConversationsForAmras.length);
  if (aishaConversationsForAmras.length !== 1) {
    throw new Error(`CRITICAL: Expected exactly 1 conversation thread for Aisha, but found ${aishaConversationsForAmras.length} (duplicate conversations detected)!`);
  }

  const finalThread = aishaConversationsForAmras[0];
  console.log("Final unified thread details:", {
    id: finalThread.id,
    customerName: finalThread.customerName,
    customerAvatar: finalThread.customerAvatar,
    unreadCount: finalThread.unreadCount,
    lastMessageSnippet: finalThread.lastMessageSnippet,
    messageCount: finalThread.messages?.length,
  });

  if (finalThread.unreadCount < 1) {
    throw new Error(`Expected Amras unreadCount to be >= 1 for Aisha's follow-up message, got: ${finalThread.unreadCount}`);
  }
  if (!finalThread.lastMessageSnippet.includes("wedding photography packages")) {
    throw new Error(`Expected latest snippet to show follow-up message, got: "${finalThread.lastMessageSnippet}"`);
  }

  console.log("\n=======================================================");
  console.log(">>> ALL 10 MANDATORY MESSAGING REQUIREMENTS PASSED 100%! <<<");
  console.log("=======================================================\n");
}

runTest().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
