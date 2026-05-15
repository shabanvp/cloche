const fs = require("fs");
const path = require("path");

const componentPath = path.join(__dirname, "..", "public", "collection-detail-image.js");
const viewPath = path.join(__dirname, "..", "public", "viewproducts.html");
const cssPath = path.join(__dirname, "..", "public", "responsive-fixes.css");

const component = fs.readFileSync(componentPath, "utf8");
const view = fs.readFileSync(viewPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredComponentTokens = [
  "HERO_HEIGHT_RATIO = 0.68",
  "HERO_MIN_HEIGHT = 520",
  "HERO_MAX_HEIGHT = 760",
  "MOBILE_HERO_HEIGHT_RATIO = 0.58",
  "MOBILE_HERO_MIN_HEIGHT = 360",
  "MOBILE_HERO_MAX_HEIGHT = 520",
  "getHeroHeight()",
  "mountCollectionDetailImage",
  "setImage(src)",
  "applyFrameStyles(frame)",
  "applyImageStyles(image)",
  "frame.dataset.collectionDetailPanel"
];

const requiredViewTokens = [
  "id=\"collectionDetailImageHost\"",
  "collection-detail-image.js?v=20260515-mobile-frame-lock",
  "normalizeGallery(product)",
  "ensureDetailImagePanel()",
  "panel.setImage(resolveAssetUrl(gallery[currentImgIndex]))",
  "panel.setDots(gallery.length, currentImgIndex)"
];

const requiredCssTokens = [
  "[data-collection-detail-host=\"true\"]",
  "body.has-mobile-bars.route-viewproducts #productTitle",
  "overflow-wrap: anywhere",
  ".collection-detail-media-frame",
  ".collection-detail-media-image",
  "object-fit: contain !important"
];

function assertTokens(label, source, tokens) {
  for (const token of tokens) {
    if (!source.includes(token)) {
      throw new Error(`${label} missing required token: ${token}`);
    }
  }
}

assertTokens("component", component, requiredComponentTokens);
assertTokens("viewproducts", view, requiredViewTokens);
assertTokens("responsive CSS", css, requiredCssTokens);

const fixtureViewports = [640, 760, 900, 1200];
const uploadedImageShapes = [
  { name: "tall", width: 900, height: 1600 },
  { name: "portrait", width: 1200, height: 1500 },
  { name: "square", width: 1200, height: 1200 },
  { name: "wide", width: 1600, height: 900 },
  { name: "compressed", width: 360, height: 640 }
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

for (const viewportHeight of fixtureViewports) {
  const isMobile = viewportHeight <= 640;
  const ratio = isMobile ? 0.58 : 0.68;
  const min = isMobile ? 360 : 520;
  const max = isMobile ? 520 : 760;
  const expectedPanelHeight = Math.round(clamp(viewportHeight * ratio, min, max));
  for (const image of uploadedImageShapes) {
    const actualPanelHeight = Math.round(clamp(viewportHeight * ratio, min, max));
    if (actualPanelHeight !== expectedPanelHeight) {
      throw new Error(`Panel height changed for ${image.name}: expected ${expectedPanelHeight}, got ${actualPanelHeight}`);
    }
  }
}

console.log("Collection detail image panel architecture verified across tall, portrait, square, wide, and compressed fixtures.");
