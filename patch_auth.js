const fs = require('fs');

// Patch public/profile.html
let profileContent = fs.readFileSync('public/profile.html', 'utf8');

const profileSearchStr = `  async function uploadShowcaseImage() {
    const boutiqueId = localStorage.getItem("boutiqueId");
    const input = document.getElementById("showcaseImageInput");
    const status = document.getElementById("showcaseImageStatus");
    if (!input?.files?.length) {
      alert("Please select an image first.");
      return;
    }

    if (status) status.textContent = \`Uploading \${input.files[0].name}...\`;

    const formData = new FormData();
    formData.append("image", input.files[0]);

    const res = await fetch(\`\${API_BASE}/profile/\${boutiqueId}/showcase-image\`, {
      method: "POST",
      body: formData
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to upload image");

    clearShowcasePreviewObjectUrl();
    updateShowcasePreviewImage(resolveAssetUrl(result.image_url));
    showcaseSnapshot = { ...(showcaseSnapshot || {}), image_url: result.image_url };
    if (status) status.textContent = \`Current saved image: \${fileNameFromPath(result.image_url) || "Uploaded image"}\`;
    input.value = "";
  }`;

const profileReplaceStr = `  async function uploadShowcaseImage() {
    const boutiqueId = localStorage.getItem("boutiqueId");
    const input = document.getElementById("showcaseImageInput");
    const status = document.getElementById("showcaseImageStatus");
    if (!input?.files?.length) {
      alert("Please select an image first.");
      return;
    }

    if (status) status.textContent = \`Uploading \${input.files[0].name} to Cloudinary...\`;

    try {
      // 1. Upload to Cloudinary Unsigned
      const cloudData = new FormData();
      cloudData.append("file", input.files[0]);
      cloudData.append("upload_preset", "cloche_upload");
      
      const cloudRes = await fetch(\`https://api.cloudinary.com/v1_1/dycwsnzyd/image/upload\`, {
        method: "POST",
        body: cloudData
      });
      const cloudResult = await cloudRes.json();
      if (!cloudResult.secure_url) throw new Error("Cloudinary upload failed: " + (cloudResult.error?.message || "Unknown Error"));
      
      const imageUrl = cloudResult.secure_url;

      if (status) status.textContent = \`Saving to Database...\`;

      // 2. Send the URL to backend
      const res = await fetch(\`\${API_BASE}/profile/\${boutiqueId}/showcase-image\`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: imageUrl })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to save image URL to backend");

      clearShowcasePreviewObjectUrl();
      updateShowcasePreviewImage(imageUrl);
      showcaseSnapshot = { ...(showcaseSnapshot || {}), image_url: imageUrl };
      if (status) status.textContent = \`Current saved image: \${fileNameFromPath(imageUrl) || "Uploaded image"}\`;
      input.value = "";
    } catch (err) {
      if (status) status.textContent = err.message || "Failed to upload image.";
      throw err;
    }
  }`;

function normalize(str) {
    return str.replace(/\r\n/g, '\n');
}

profileContent = normalize(profileContent);
if (profileContent.includes(normalize(profileSearchStr))) {
    profileContent = profileContent.replace(normalize(profileSearchStr), normalize(profileReplaceStr));
    fs.writeFileSync('public/profile.html', profileContent, 'utf8');
    console.log("Patched profile.html successfully");
} else {
    console.error("Failed to patch profile.html string not found");
}

let authContent = fs.readFileSync('cloche-backend/auth.js', 'utf8');

const authSearchStr = `router.post("/profile/:boutiqueId/showcase-image", showcaseUpload.single("image"), async (req, res) => {
  const { boutiqueId } = req.params;
  if (!req.file) return res.status(400).json({ message: "Image file is required" });
  let imageUrl = "";
  try {
    const uploaded = await uploadBufferToStorage({
      folder: \`showcase/\${boutiqueId}\`,
      file: req.file
    });
    imageUrl = uploaded.publicUrl;

    const { data: existing, error: eErr } = await supabase`;

const authReplaceStr = `router.post("/profile/:boutiqueId/showcase-image", showcaseUpload.single("image"), async (req, res) => {
  const { boutiqueId } = req.params;
  let imageUrl = req.body.imageUrl || "";

  if (!req.file && !imageUrl) return res.status(400).json({ message: "Image file or imageUrl is required" });
  
  try {
    if (req.file) {
      const uploaded = await uploadBufferToStorage({
        folder: \`showcase/\${boutiqueId}\`,
        file: req.file
      });
      imageUrl = uploaded.publicUrl;
    }

    const { data: existing, error: eErr } = await supabase`;

authContent = normalize(authContent);
if (authContent.includes(normalize(authSearchStr))) {
    authContent = authContent.replace(normalize(authSearchStr), normalize(authReplaceStr));
    fs.writeFileSync('cloche-backend/auth.js', authContent, 'utf8');
    console.log("Patched auth.js successfully");
} else {
    console.error("Failed to patch auth.js string not found");
}

