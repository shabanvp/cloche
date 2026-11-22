import assert from "node:assert/strict";
import test from "node:test";
import { formatCategory, formatLocation, formatPrice, formatReviews } from "../src/lib/format.ts";

 test("formatPrice uses INR grouping and handles missing and string prices", () => {
  assert.equal(formatPrice(15000), "Starts from ₹15,000");
  assert.equal(formatPrice("15000"), "Starts from ₹15,000");
  assert.equal(formatPrice(null), "Contact for pricing");
  assert.equal(formatPrice(0), "Contact for pricing");
  assert.equal(formatPrice("₹1,50,000 / day"), "Starts from ₹1,50,000 / day");
  assert.equal(formatPrice("₹25k+"), "Starts from ₹25,000+");
});

test("formatReviews handles zero, singular, and plural counts", () => {
  assert.equal(formatReviews(0), "No reviews yet");
  assert.equal(formatReviews(1), "1 review");
  assert.equal(formatReviews(2), "2 reviews");
});

test("formatLocation canonicalizes aliases and removes duplicate city and district", () => {
  assert.equal(formatLocation("kozhikod"), "Kozhikode");
  assert.equal(formatLocation("ernakulam"), "Ernakulam");
  assert.equal(formatLocation("perinthalmanna"), "Perinthalmanna");
  assert.equal(formatLocation("Oachira, Oachira"), "Oachira");
  assert.equal(formatLocation("Kochi", "ernakulam"), "Kochi, Ernakulam");
  assert.equal(formatLocation(null, null), "Kerala");
});

test("formatCategory normalizes known category names and fallbacks", () => {
  assert.equal(formatCategory("bridal_wear"), "Bridal Studio");
  assert.equal(formatCategory("photographer"), "Photographers");
  assert.equal(formatCategory(null), "Wedding Vendor");
});
