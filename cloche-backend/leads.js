const express = require("express");
const router = express.Router();
const supabase = require("./supabase");
const { sendEnquiryNotificationEmail } = require("./emailService");

const LEADS_TABLE = "leads";
const ENQUIRIES_TABLE = "enquiries";
const ADMIN_QUEUE_BOUTIQUE_ID = 0;

const clean = (value) => String(value || "").trim();
const cleanLower = (value) => clean(value).toLowerCase();

const isMissingRelation = (error) => /relation .* does not exist/i.test(String(error?.message || ""));
const isMissingColumn = (error) => 
  /column .* does not exist/i.test(String(error?.message || "")) || 
  /column .* in the schema cache/i.test(String(error?.message || "")) ||
  /Could not find the .* column/i.test(String(error?.message || ""));

const isForeignKeyViolation = (error) => /foreign key constraint/i.test(String(error?.message || ""));
const isNotNullViolation = (error) => /null value in column/i.test(String(error?.message || ""));
const isCheckViolation = (error) => /check constraint/i.test(String(error?.message || ""));
const isRetryableInsertError = (error) =>
  isMissingColumn(error) || isForeignKeyViolation(error) || isNotNullViolation(error) || isCheckViolation(error);

const parsePreferredLocation = (value) => {
  const raw = clean(value);
  if (!raw) return { area: "", district: "", raw: "" };
  const parts = raw.split(",").map((part) => clean(part)).filter(Boolean);
  if (parts.length === 0) return { area: "", district: "", raw: raw };
  return {
    area: parts[0] || "",
    district: parts.slice(1).join(", ") || "",
    raw
  };
};

const safeLeadCategory = (requirement) => {
  const text = cleanLower(requirement);
  if (!text) return "Wedding";

  if (text.includes("party") || text.includes("reception") || text.includes("cocktail")) {
    return "Party";
  }
  if (text.includes("casual") || text.includes("daily") || text.includes("simple")) {
    return "Casual";
  }
  if (text.includes("formal") || text.includes("office") || text.includes("event")) {
    return "Formal";
  }

  return "Wedding";
};

async function tryInsertWithFallback(table, payloadCandidates) {
  let lastError = null;
  console.log(`[DB] Attempting insert into ${table} with ${payloadCandidates.length} potential variants`);
  for (let i = 0; i < payloadCandidates.length; i++) {
    const payload = payloadCandidates[i];
    const { data, error } = await supabase.from(table).insert([payload]).select("*").maybeSingle();
    if (!error) return data || payload;
    
    console.warn(`[DB] Variant ${i} failed for ${table}:`, error.message);
    lastError = error;
    if (isRetryableInsertError(error)) {
      console.log(`[DB] Error is retryable, attempting next variant...`);
      continue;
    }
    break;
  }
  throw new Error(lastError?.message || "Insert failed after all attempts");
}

function leadPayloadCandidates({ boutiqueId, enquiry }) {
  const base = {
    boutique_id: Number(boutiqueId),
    name: clean(enquiry.name),
    email: clean(enquiry.email),
    phone: clean(enquiry.phone),
    status: clean(enquiry.status || "NEW"),
    date: clean(enquiry.wedding_date) || null,
    category: safeLeadCategory(enquiry.requirement),
    requirement: clean(enquiry.requirement),
    special_requirement: clean(enquiry.special_requirement),
    preferred_location: clean(enquiry.preferred_location),
    created_at: enquiry.created_at || new Date().toISOString()
  };

  return [
    { ...base },
    {
      boutique_id: base.boutique_id,
      name: base.name,
      email: base.email,
      phone: base.phone,
      status: base.status,
      date: base.date,
      category: base.category,
      created_at: base.created_at
    },
    {
      boutique_id: base.boutique_id,
      name: base.name,
      phone: base.phone,
      status: base.status,
      category: base.category
    },
    {
      boutique_id: base.boutique_id,
      name: base.name,
      phone: base.phone,
      status: base.status
    },
    // ULTIMATE BARE MINIMUM (No status, no category, no location)
    {
      boutique_id: base.boutique_id,
      name: base.name,
      phone: base.phone
    }
  ];
}

function queueLeadPayloadCandidates(enquiry) {
  const base = {
    name: clean(enquiry.name),
    email: clean(enquiry.email),
    phone: clean(enquiry.phone),
    status: clean(enquiry.status || "PENDING"),
    date: clean(enquiry.wedding_date),
    category: safeLeadCategory(enquiry.requirement),
    requirement: clean(enquiry.requirement),
    special_requirement: clean(enquiry.special_requirement),
    preferred_location: clean(enquiry.preferred_location),
    source: "web_enquiry",
    created_at: enquiry.created_at || new Date().toISOString()
  };

  return [
    { ...base },
    {
      name: base.name,
      email: base.email,
      phone: base.phone,
      status: base.status,
      date: base.date,
      category: base.category,
      requirement: base.requirement,
      preferred_location: base.preferred_location,
      source: base.source,
      created_at: base.created_at
    },
    {
      name: base.name,
      email: base.email,
      phone: base.phone,
      status: base.status,
      date: base.date,
      category: base.category,
      created_at: base.created_at
    },
    {
      name: base.name,
      phone: base.phone,
      status: base.status,
      category: base.category
    },
    {
      boutique_id: ADMIN_QUEUE_BOUTIQUE_ID,
      name: base.name,
      email: base.email,
      phone: base.phone,
      status: base.status,
      date: base.date,
      category: base.category,
      created_at: base.created_at
    }
  ];
}

function enquiryPayloadCandidates(enquiry) {
  const base = {
    name: clean(enquiry.name),
    email: clean(enquiry.email),
    phone: clean(enquiry.phone),
    wedding_date: clean(enquiry.wedding_date),
    preferred_location: clean(enquiry.preferred_location),
    requirement: clean(enquiry.requirement),
    special_requirement: clean(enquiry.special_requirement),
    status: clean(enquiry.status || "PENDING"),
    source: "web_enquiry",
    created_at: enquiry.created_at || new Date().toISOString()
  };

  return [
    { ...base },
    {
      name: base.name,
      email: base.email,
      phone: base.phone,
      wedding_date: base.wedding_date,
      preferred_location: base.preferred_location,
      requirement: base.requirement,
      status: base.status
    },
    {
      name: base.name,
      email: base.email,
      phone: base.phone,
      preferred_location: base.preferred_location,
      requirement: base.requirement,
      status: base.status
    }
  ];
}

function normalizeAdminEnquiryRow(row) {
  return {
    id: row.id,
    name: clean(row.name),
    email: clean(row.email),
    phone: clean(row.phone),
    wedding_date: clean(row.wedding_date || row.date),
    preferred_location: clean(row.preferred_location || row.location || ""),
    requirement: clean(row.requirement || row.category),
    special_requirement: clean(row.special_requirement || row.notes),
    status: clean(row.status || "PENDING"),
    created_at: row.created_at || null
  };
}

async function fetchAllBoutiquesWithLocation() {
  const { data: boutiques, error: boutiqueErr } = await supabase
    .from("boutiques")
    .select("id, boutique_name, city, email")
    .order("boutique_name", { ascending: true });

  if (boutiqueErr) {
    throw new Error(boutiqueErr.message || "Failed to load boutiques");
  }

  const ids = (boutiques || []).map((b) => b.id).filter(Boolean);
  let showcaseById = new Map();

  if (ids.length) {
    const { data: showcaseRows, error: showcaseErr } = await supabase
      .from("boutique_showcase")
      .select("boutique_id, area, district")
      .in("boutique_id", ids);

    if (showcaseErr && !isMissingRelation(showcaseErr)) {
      throw new Error(showcaseErr.message || "Failed to load boutique showcase");
    }

    if (Array.isArray(showcaseRows)) {
      showcaseById = showcaseRows.reduce((acc, row) => {
        acc.set(row.boutique_id, row);
        return acc;
      }, new Map());
    }
  }

  return (boutiques || []).map((b) => {
    const s = showcaseById.get(b.id) || {};
    return {
      id: b.id,
      boutique_name: b.boutique_name,
      email: clean(b.email),
      city: clean(b.city),
      area: clean(s.area),
      district: clean(s.district)
    };
  });
}

function matchBoutiquesByLocation(boutiques, preferredLocation) {
  const parsed = parsePreferredLocation(preferredLocation);
  const wantedArea = cleanLower(parsed.area);
  const wantedDistrict = cleanLower(parsed.district);
  const wantedRaw = cleanLower(parsed.raw);

  return boutiques.filter((b) => {
    const area = cleanLower(b.area);
    const district = cleanLower(b.district);
    const city = cleanLower(b.city);
    const joined = `${area} ${district} ${city}`.trim();

    if (wantedArea && wantedDistrict) {
      const districtMatch = district === wantedDistrict || city.includes(wantedDistrict);
      const areaMatch = area === wantedArea || city.includes(wantedArea);
      return districtMatch || areaMatch;
    }

    if (wantedDistrict) {
      return district === wantedDistrict || city.includes(wantedDistrict);
    }

    if (wantedArea) {
      return area === wantedArea || city.includes(wantedArea);
    }

    if (wantedRaw) {
      return joined.includes(wantedRaw);
    }

    return false;
  });
}

async function forwardEnquiryToMatchedBoutiques(enquiry) {
  try {
    const boutiques = await fetchAllBoutiquesWithLocation();
    console.log("[FORWARD] Found", boutiques.length, "boutiques");
    const matchedBoutiques = matchBoutiquesByLocation(boutiques, enquiry.preferred_location);
    console.log("[FORWARD] Matched", matchedBoutiques.length, "boutiques for location:", enquiry.preferred_location);
    
    if (!matchedBoutiques.length) return 0;

    let insertedCount = 0;
    for (const b of matchedBoutiques) {
      await tryInsertWithFallback(LEADS_TABLE, leadPayloadCandidates({
        boutiqueId: b.id,
        enquiry: {
          ...enquiry,
          status: "NEW"
        }
      }));
      insertedCount += 1;
    }
    console.log("[FORWARD] Successfully forwarded to", insertedCount, "boutiques");
    return insertedCount;
  } catch (err) {
    console.error("[FORWARD] Error:", err.message);
    throw err;
  }
}

async function getEnquiryForAdmin(id) {
  const { data: enquiryRow, error: enquiryErr } = await supabase
    .from(ENQUIRIES_TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!enquiryErr && enquiryRow) {
    return { source: ENQUIRIES_TABLE, row: normalizeAdminEnquiryRow(enquiryRow) };
  }

  if (enquiryErr && !isMissingRelation(enquiryErr)) {
    throw new Error(enquiryErr.message || "Failed to fetch enquiry");
  }

  // Fallback queue in leads table
  let { data: leadRow, error: leadErr } = await supabase
    .from(LEADS_TABLE)
    .select("*")
    .eq("id", id)
    .eq("source", "web_enquiry")
    .maybeSingle();

  if (leadErr && isMissingColumn(leadErr)) {
    const legacy = await supabase
      .from(LEADS_TABLE)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    leadRow = legacy.data;
    leadErr = legacy.error;
  }

  if (leadErr) {
    throw new Error(leadErr.message || "Failed to fetch enquiry");
  }
  if (!leadRow) {
    throw new Error("Enquiry not found");
  }

  return { source: LEADS_TABLE, row: normalizeAdminEnquiryRow(leadRow) };
}

async function listFallbackQueueFromLeads() {
  let { data: queueRows, error: queueErr } = await supabase
    .from(LEADS_TABLE)
    .select("*")
    .eq("source", "web_enquiry")
    .order("created_at", { ascending: false })
    .limit(200);

  if (queueErr && isMissingColumn(queueErr)) {
    const legacy = await supabase
      .from(LEADS_TABLE)
      .select("*")
      .or("boutique_id.is.null,boutique_id.eq.0")
      .order("created_at", { ascending: false })
      .limit(200);
    queueRows = legacy.data;
    queueErr = legacy.error;
  }

  if (queueErr) {
    throw new Error(queueErr.message || "Failed to fetch enquiries");
  }

  return (queueRows || []).map(normalizeAdminEnquiryRow);
}

/* ================= SUBMIT ENQUIRY (USER) ================= */
router.post("/enquiry", async (req, res) => {
  const enquiry = {
    name: clean(req.body.fullName || req.body.name),
    email: clean(req.body.email),
    phone: clean(req.body.mobileNumber || req.body.phone),
    wedding_date: clean(req.body.weddingDate || req.body.wedding_date),
    preferred_location: clean(req.body.cityLocation || req.body.preferred_location),
    requirement: clean(req.body.requirement),
    special_requirement: clean(req.body.specialRequirement || req.body.special_requirement),
    status: "PENDING",
    created_at: new Date().toISOString()
  };

  console.log("[ENQUIRY] Received enquiry:", enquiry);

  if (!enquiry.name || !enquiry.phone || !enquiry.wedding_date || !enquiry.preferred_location) {
    const missing = [];
    if (!enquiry.name) missing.push("name");
    if (!enquiry.phone) missing.push("phone");
    if (!enquiry.wedding_date) missing.push("wedding_date");
    if (!enquiry.preferred_location) missing.push("preferred_location");
    return res.status(400).json({ message: `Missing required fields: ${missing.join(", ")}` });
  }

  console.log("[ENQUIRY] POST /enquiry body:", JSON.stringify(req.body, null, 2));

  try {
    const directBoutiqueId = Number(req.body.boutiqueId);
    console.log("[ENQUIRY] Parsed directBoutiqueId:", directBoutiqueId);

    if (directBoutiqueId > 0 && !isNaN(directBoutiqueId)) {
      console.log(`[ENQUIRY] EXECUTING DIRECT ROUTE for boutiqueId: ${directBoutiqueId}`);
      
      // Bypass admin queue and insert straight into leads table for this boutique
      const leadData = await tryInsertWithFallback(LEADS_TABLE, leadPayloadCandidates({
        boutiqueId: directBoutiqueId,
        enquiry: {
          ...enquiry,
          status: "NEW" // Direct leads start as NEW for the boutique
        }
      }));

      // Try to insert into enquiries table as a backup/admin record (non-blocking)
      tryInsertWithFallback(ENQUIRIES_TABLE, enquiryPayloadCandidates({
        ...enquiry,
        status: "DIRECT" // Mark as reached boutique directly
      })).catch(e => console.warn("[ENQUIRY] Failed to save backup enquiry row:", e.message));

      console.log("[ENQUIRY] Direct lead created successfully:", leadData?.id);
      return res.status(201).json({
        success: true,
        enquiryId: leadData?.id || null,
        message: "Your enquiry has been sent directly to the boutique owner."
      });
    }

    let enqueueError = null;
    const enquiryId = await (async () => {
      try {
        const data = await tryInsertWithFallback(ENQUIRIES_TABLE, enquiryPayloadCandidates(enquiry));
        console.log("[ENQUIRY] Successfully inserted into enquiries table:", data?.id);
        return data?.id || null;
      } catch (e) {
        console.log("[ENQUIRY] Enquiries table insert failed:", e.message);
        try {
          // Fallback queue row in leads table for environments without enquiries table
          const data = await tryInsertWithFallback(LEADS_TABLE, queueLeadPayloadCandidates(enquiry));
          console.log("[ENQUIRY] Successfully inserted into leads table:", data?.id);
          return data?.id || null;
        } catch (queueErr) {
          console.error("[ENQUIRY] Leads table insert also failed:", queueErr.message);
          enqueueError = queueErr;
          return null;
        }
      }
    })();

    if (enqueueError) {
      console.log("[ENQUIRY] Attempting to forward to matched boutiques...");
      try {
        const autoSentCount = await forwardEnquiryToMatchedBoutiques(enquiry);
        console.log("[ENQUIRY] Forwarded to", autoSentCount, "boutiques");
        if (autoSentCount > 0) {
          return res.status(201).json({
            success: true,
            enquiryId: null,
            autoForwarded: true,
            sentTo: autoSentCount,
            message: `Enquiry submitted and forwarded to ${autoSentCount} matching boutique(s).`
          });
        }
        // If no boutiques matched but we tried, still return success
        return res.status(201).json({
          success: true,
          enquiryId: null,
          autoForwarded: false,
          sentTo: 0,
          message: "Enquiry submitted. Admin will review and forward to matching boutiques."
        });
      } catch (forwardErr) {
        console.error("[ENQUIRY] Forward to boutiques failed:", forwardErr.message);
        throw new Error(`Database error: ${forwardErr.message}`);
      }
    }

    return res.status(201).json({
      success: true,
      enquiryId,
      message: "Enquiry submitted successfully. Admin will forward it to matching boutiques."
    });
  } catch (err) {
    console.error("[ENQUIRY] Submit error:", err.message);
    return res.status(500).json({ message: "Failed to submit enquiry", error: err.message });
  }
});

/* ================= ADMIN: LIST ENQUIRIES ================= */
router.get("/admin/enquiries", async (_req, res) => {
  try {
    const { data: enquiries, error } = await supabase
      .from(ENQUIRIES_TABLE)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!error) {
      return res.json((enquiries || []).map(normalizeAdminEnquiryRow));
    }

    if (!isMissingRelation(error)) {
      return res.status(500).json({ message: "Failed to fetch enquiries", error: error.message });
    }

    // Fallback queue mode
    const queueRows = await listFallbackQueueFromLeads();
    return res.json(queueRows);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ================= ADMIN: FORWARD ENQUIRY TO MATCHING BOUTIQUES ================= */
router.post("/admin/enquiries/:id/send", async (req, res) => {
  const enquiryId = Number(req.params.id);
  if (!Number.isFinite(enquiryId) || enquiryId <= 0) {
    return res.status(400).json({ message: "Invalid enquiry id" });
  }

  try {
    const enquiryPayload = await getEnquiryForAdmin(enquiryId);
    const enquiry = enquiryPayload.row;

    if (cleanLower(enquiry.status) === "sent") {
      return res.status(409).json({ message: "This enquiry has already been forwarded" });
    }

    if (!enquiry.preferred_location) {
      return res.status(400).json({ message: "Preferred location missing for this enquiry" });
    }

    const boutiques = await fetchAllBoutiquesWithLocation();
    const matchedBoutiques = matchBoutiquesByLocation(boutiques, enquiry.preferred_location);

    if (!matchedBoutiques.length) {
      return res.status(404).json({ message: "No boutiques found for the preferred location" });
    }

    let insertedCount = 0;
    for (const b of matchedBoutiques) {
      await tryInsertWithFallback(LEADS_TABLE, leadPayloadCandidates({
        boutiqueId: b.id,
        enquiry: {
          ...enquiry,
          status: "NEW"
        }
      }));
      insertedCount += 1;

      // Notify boutique via email (Non-blocking)
      if (b.email) {
        sendEnquiryNotificationEmail(b.email, b.boutique_name, enquiry).catch((mailErr) => {
          console.warn(`[FORWARD] Email failed for ${b.email}:`, mailErr.message);
        });
      }
    }

    if (enquiryPayload.source === ENQUIRIES_TABLE) {
      const updatePayload = {
        status: "SENT",
        sent_to_count: insertedCount,
        sent_at: new Date().toISOString()
      };

      const { error: updateErr } = await supabase
        .from(ENQUIRIES_TABLE)
        .update(updatePayload)
        .eq("id", enquiryId);

      if (updateErr && isMissingColumn(updateErr)) {
        console.warn("[FORWARD] enquiries table missing stats columns, falling back to status only");
        await supabase
          .from(ENQUIRIES_TABLE)
          .update({ status: "SENT" })
          .eq("id", enquiryId);
      } else if (updateErr) {
        console.error("[FORWARD] Failed to update enquiry status:", updateErr.message);
      }
    } else {
      const { error: updateBySourceErr } = await supabase
        .from(LEADS_TABLE)
        .update({ status: "SENT" })
        .eq("id", enquiryId)
        .eq("source", "web_enquiry");

      if (updateBySourceErr && isMissingColumn(updateBySourceErr)) {
        await supabase
          .from(LEADS_TABLE)
          .update({ status: "SENT" })
          .eq("id", enquiryId);
      }
    }

    return res.json({
      success: true,
      sentTo: insertedCount,
      message: `Enquiry forwarded to ${insertedCount} boutique(s).`
    });
  } catch (err) {
    console.error("[ENQUIRY] Dispatch error:", err.message);
    return res.status(500).json({ message: "Failed to forward enquiry", error: err.message });
  }
});

/* ================= GET LEADS (PARTNER) ================= */
router.get("/list/:boutiqueId", async (req, res) => {
  const { boutiqueId } = req.params;
  console.log(`[Leads] List request for boutiqueId: ${boutiqueId}`);

  try {
    const { data, error } = await supabase
      .from(LEADS_TABLE)
      .select("*")
      .eq("boutique_id", boutiqueId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Leads] Supabase error:", error);
      return res.status(500).json({ message: "Database error", error: error.message });
    }

    const rows = Array.isArray(data) ? data : [];
    console.log(`[Leads] Found ${rows.length} leads`);
    return res.json(rows);
  } catch (err) {
    console.error("[Leads] Unexpected error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
