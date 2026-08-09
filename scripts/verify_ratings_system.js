const fs = require('fs');

const url = 'https://fumfjbcixcudjrnezfjl.supabase.co/rest/v1';
const key = 'sb_secret_UrI6GZ8y25k5U8HheVLKnQ_LRbo08ox';

async function supabaseFetch(endpoint, options = {}) {
  const headers = {
    apikey: key,
    Authorization: 'Bearer ' + key,
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const res = await fetch(url + '/' + endpoint, { ...options, headers });
  const text = await res.text();
  let data = null;
  try { data = JSON.parse(text); } catch (e) { data = text; }
  return { status: res.status, data };
}

async function recalculateVendorRatingInDb(vendorId) {
  const res = await supabaseFetch(`reviews?vendor_id=eq.${encodeURIComponent(vendorId)}&status=eq.published&select=rating`);
  const reviews = Array.isArray(res.data) ? res.data : [];
  const count = reviews.length;
  let avgRating = 0;
  if (count > 0) {
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    avgRating = Math.round((sum / count) * 10) / 10;
  }
  await supabaseFetch(`vendor_profiles?vendor_id=eq.${encodeURIComponent(vendorId)}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ rating: avgRating, review_count: count, updated_at: new Date().toISOString() }),
  });
  return { rating: avgRating, review_count: count };
}

async function saveCustomerReviewInDb(reviewData) {
  const { customer_id, vendor_id, rating, review, title } = reviewData;
  const existing = await supabaseFetch(`reviews?customer_id=eq.${encodeURIComponent(customer_id)}&vendor_id=eq.${encodeURIComponent(vendor_id)}&select=id`);
  if (existing.data && Array.isArray(existing.data) && existing.data.length > 0) {
    return { error: { message: "You have already submitted a review for this vendor. You can edit or delete your existing review from your dashboard." } };
  }
  const insertPayload = {
    customer_id,
    vendor_id,
    rating: Math.max(1, Math.min(5, Math.round(Number(rating)))),
    title: title || "",
    review_text: String(review).trim(),
    status: "published",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const res = await supabaseFetch(`reviews`, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(insertPayload),
  });
  if (res.status >= 400) {
    return { error: res.data };
  }
  await recalculateVendorRatingInDb(vendor_id);
  return { data: res.data };
}

async function deleteCustomerReviewInDb(reviewId, customerId) {
  const getRes = await supabaseFetch(`reviews?id=eq.${encodeURIComponent(reviewId)}&customer_id=eq.${encodeURIComponent(customerId)}&select=id,vendor_id`);
  const review = Array.isArray(getRes.data) && getRes.data.length > 0 ? getRes.data[0] : null;
  const deleteRes = await supabaseFetch(`reviews?id=eq.${encodeURIComponent(reviewId)}&customer_id=eq.${encodeURIComponent(customerId)}`, { method: "DELETE" });
  if (review?.vendor_id) {
    await recalculateVendorRatingInDb(review.vendor_id);
  }
  return deleteRes;
}

async function updateReviewStatusByAdmin(reviewId, status) {
  const getRes = await supabaseFetch(`reviews?id=eq.${encodeURIComponent(reviewId)}&select=id,vendor_id`);
  const review = Array.isArray(getRes.data) && getRes.data.length > 0 ? getRes.data[0] : null;
  const updateRes = await supabaseFetch(`reviews?id=eq.${encodeURIComponent(reviewId)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ status, updated_at: new Date().toISOString() }),
  });
  if (review?.vendor_id) {
    await recalculateVendorRatingInDb(review.vendor_id);
  }
  return updateRes;
}

async function run() {
  const targetVendorId = "60393f6d-c1fb-41b0-b737-240c18fd2a68"; // shaban
  const customer1 = "6007720b-5da8-4b81-8811-af6327fab1ea"; // Muhammed Shaban
  const customer2 = "3d385f13-82a8-4068-afb3-efcc974c509b"; // Meharoofa

  console.log("=== STEP 0: CLEANUP PREVIOUS TEST REVIEWS ===");
  await supabaseFetch(`reviews?vendor_id=eq.${targetVendorId}`, { method: 'DELETE' });
  await recalculateVendorRatingInDb(targetVendorId);

  let vp = (await supabaseFetch(`vendor_profiles?vendor_id=eq.${targetVendorId}&select=business_name,rating,review_count`)).data[0];
  console.log("INITIAL VENDOR PROFILE ROW:", JSON.stringify(vp, null, 2));

  console.log("\n=== STEP 1: CUSTOMER 1 POSTS 5-STAR REVIEW ===");
  const res1 = await saveCustomerReviewInDb({
    customer_id: customer1,
    vendor_id: targetVendorId,
    rating: 5,
    title: "Exceptional Service",
    review: "The decorations were stunning and beyond our expectations!"
  });
  console.log("POST RESPONSE 1:", JSON.stringify(res1, null, 2));

  vp = (await supabaseFetch(`vendor_profiles?vendor_id=eq.${targetVendorId}&select=business_name,rating,review_count`)).data[0];
  console.log("AFTER STEP 1 VENDOR PROFILE ROW:", JSON.stringify(vp, null, 2));

  console.log("\n=== STEP 2: CUSTOMER 1 ATTEMPTS DUPLICATE REVIEW ===");
  const resDup = await saveCustomerReviewInDb({
    customer_id: customer1,
    vendor_id: targetVendorId,
    rating: 4,
    title: "Another review",
    review: "Trying to submit duplicate"
  });
  console.log("DUPLICATE ATTEMPT RESPONSE:", JSON.stringify(resDup, null, 2));

  console.log("\n=== STEP 3: CUSTOMER 2 POSTS 4-STAR REVIEW ===");
  const res2 = await saveCustomerReviewInDb({
    customer_id: customer2,
    vendor_id: targetVendorId,
    rating: 4,
    title: "Great Coordination",
    review: "Very professional team and great responsiveness."
  });
  console.log("POST RESPONSE 2:", JSON.stringify(res2, null, 2));

  vp = (await supabaseFetch(`vendor_profiles?vendor_id=eq.${targetVendorId}&select=business_name,rating,review_count`)).data[0];
  console.log("AFTER STEP 3 VENDOR PROFILE ROW (AVERAGE (5+4)/2 = 4.5):", JSON.stringify(vp, null, 2));

  const review2Id = res2.data[0].id;
  console.log("\n=== STEP 4: ADMIN FLAGS CUSTOMER 2 REVIEW AS 'hidden' ===");
  await updateReviewStatusByAdmin(review2Id, 'hidden');
  vp = (await supabaseFetch(`vendor_profiles?vendor_id=eq.${targetVendorId}&select=business_name,rating,review_count`)).data[0];
  console.log("AFTER ADMIN HIDE VENDOR PROFILE ROW (ONLY PUBLISHED REVIEW COUNTED = 5.0):", JSON.stringify(vp, null, 2));

  console.log("\n=== STEP 5: DELETE CUSTOMER 1 REVIEW (RESET TO ZERO) ===");
  const review1Id = res1.data[0].id;
  await deleteCustomerReviewInDb(review1Id, customer1);
  vp = (await supabaseFetch(`vendor_profiles?vendor_id=eq.${targetVendorId}&select=business_name,rating,review_count`)).data[0];
  console.log("AFTER DELETION VENDOR PROFILE ROW (CLEAN RESET TO 0/NEW):", JSON.stringify(vp, null, 2));

  console.log("\n=== STEP 6: CLEANUP HIDDEN TEST REVIEWS ===");
  await supabaseFetch(`reviews?vendor_id=eq.${targetVendorId}`, { method: 'DELETE' });
  await recalculateVendorRatingInDb(targetVendorId);
  vp = (await supabaseFetch(`vendor_profiles?vendor_id=eq.${targetVendorId}&select=business_name,rating,review_count`)).data[0];
  console.log("FINAL CLEAN PROFILE ROW:", JSON.stringify(vp, null, 2));
}

run().catch(console.error);
