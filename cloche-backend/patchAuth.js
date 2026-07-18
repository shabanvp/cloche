const fs = require('fs');
let c = fs.readFileSync('controllers/authController.js', 'utf8');

c = c.replace(
  /if \(\!match\) return res\.status\(401\)\.json\(\{ message: "Invalid credentials" \}\);\s*return res\.json\(\{/g,
  `if (!match) return res.status(401).json({ message: "Invalid credentials" });
        const { generateToken } = require("../middleware/authMiddleware");
        const token = typeof user !== 'undefined' && user ? generateToken({ id: user.id, role: "user" }) : generateToken({ id: boutique.id, role: "vendor" });
        return res.json({ token,`
);

fs.writeFileSync('controllers/authController.js', c);
console.log("Patched authController.js");
