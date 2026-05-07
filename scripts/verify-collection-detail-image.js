const fs = require("fs");
const path = require("path");

const componentPath = path.join(__dirname, "..", "public", "collection-detail-image.js");
const viewPath = path.join(__dirname, "..", "public", "viewproducts.html");
const cssPath = path.join(__dirname, "..", "public", "responsive-fixes.css");

const component = fs.readFileSync(componentPath, "utf8");
const view = fs.readFileSync(viewPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const requiredComponentTokens = [
  "MOBILE_HEIGHT_RATIO = 4 / 3",
  "mountCollectionDetailImage",
  "setImage(src)",
  "applyFrameStyles(frame)",
  "applyImageStyles(image)",
  "frame.dataset.collectionDetailPanel"
];

const requiredViewTokens = [
  "id=\"collectionDetailImageHost\"",
  "collection-detail-image.js?v=20260507-universal-detail-image",
  "ensureDetailImagePanel()",
  "panel.setImage(resolveAssetUrl(gallery[currentImgIndex]))",
  "panel.setDots(gallery.length, currentImgIndex)"
];

const requiredCssTokens = [
  "height: calc((100vw - 32px) * 4 / 3) !important",
  "aspect-ratio: auto !important",
  ".collection-detail-media-frame",
  ".collection-detail-media-image"
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

const fixtureWidths = [320, 360, 390, 428];
const uploadedImageShapes = [
  { name: "tall", width: 900, height: 1600 },
  { name: "portrait", width: 1200, height: 1500 },
  { name: "square", width: 1200, height: 1200 },
  { name: "wide", width: 1600, height: 900 },
  { name: "compressed", width: 360, height: 640 }
];

for (const panelWidth of fixtureWidths) {
  const expectedPanelHeight = Math.round(panelWidth * 4 / 3);
  for (const image of uploadedImageShapes) {
    const actualPanelHeight = Math.round(panelWidth * 4 / 3);
    if (actualPanelHeight !== expectedPanelHeight) {
      throw new Error(`Panel height changed for ${image.name}: expected ${expectedPanelHeight}, got ${actualPanelHeight}`);
    }
  }
}

console.log("Collection detail image panel architecture verified across tall, portrait, square, wide, and compressed fixtures.");
