const fs = require('fs');
const files = [
    'public/viewproducts.html',
    'public/viewboutique.html',
    'public/profile.html',
    'public/index.html',
    'public/dashboard.html',
    'public/collection.html',
    'public/boutiques.html',
    'public/boutiqueproducts.html',
    'public/boutiqueproduct.html'
];

const replacement = `function resolveAssetUrl(url) {
    let raw = String(url || "").trim();
    if (!raw) return "";
    if (/^data:image\\//i.test(raw)) return raw;
    
    if (raw.includes("localhost") || raw.includes("127.0.0.1")) {
       try {
           const u = new URL(raw);
           raw = u.pathname;
       } catch(e) {}
    }
    if (/^https?:\\/\\//i.test(raw)) return raw;

    const normalized = raw.replace(/\\\\/g, "/");
    const lower = normalized.toLowerCase();
    const uploadsWithSlash = lower.indexOf("/uploads/");
    if (uploadsWithSlash >= 0) return \`\${API_ORIGIN}\${normalized.slice(uploadsWithSlash)}\`;
    const uploadsNoSlash = lower.indexOf("uploads/");
    if (uploadsNoSlash >= 0) return \`\${API_ORIGIN}/\${normalized.slice(uploadsNoSlash)}\`;

    return \`\${API_ORIGIN}\${normalized.startsWith("/") ? "" : "/"}\${normalized}\`;
  }`;

for (const file of files) {
    try {
        if (!fs.existsSync(file)) {
            console.log('File not found: ' + file);
            continue;
        }
        let content = fs.readFileSync(file, 'utf8');
        let startIdx = content.indexOf('function resolveAssetUrl');
        if (startIdx === -1) {
            console.log('resolveAssetUrl not found in ' + file);
            continue;
        }

        // find matching brace
        let braceCount = 0;
        let started = false;
        let endIdx = -1;
        for (let i = startIdx; i < content.length; i++) {
            if (content[i] === '{') {
                braceCount++;
                started = true;
            } else if (content[i] === '}') {
                braceCount--;
            }
            if (started && braceCount === 0) {
                endIdx = i;
                break;
            }
        }

        if (endIdx !== -1) {
            content = content.substring(0, startIdx) + replacement + content.substring(endIdx + 1);
            fs.writeFileSync(file, content, 'utf8');
            console.log('Patched ' + file);
        }
    } catch (err) {
        console.error('Error in ' + file + ':', err);
    }
}
