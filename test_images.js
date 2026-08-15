const fs = require('fs');
const content = fs.readFileSync('./frontend/src/lib/inspirationData.ts', 'utf8');

const regex = /id:\s*"([^"]+)",\s*title:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g;
const matches = [...content.matchAll(regex)];

async function checkAll() {
  console.log(`Checking ${matches.length} items...`);
  for (const m of matches) {
    const id = m[1];
    const title = m[2];
    const url = m[3];
    try {
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) {
        console.log(`[ERROR ${res.status}] ${id}: ${title} -> ${url}`);
      } else {
        console.log(`[OK ${res.status}] ${id}: ${title}`);
      }
    } catch(err) {
      console.log(`[NETWORK FAIL] ${id}: ${title} -> ${err.message}`);
    }
  }
}

checkAll();
