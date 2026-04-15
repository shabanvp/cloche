const fs = require('fs');
const path = require('path');
const dir = 'public';

const version = Date.now();
let count = 0;

fs.readdirSync(dir).forEach(file => {
  if (!file.endsWith('.html')) return;
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/href=(['"])responsive-fixes\.css[^'"]*\1/g, 'href=$1responsive-fixes.css?v=' + version + '$1');
  content = content.replace(/src=(['"])responsive-layout\.js[^'"]*\1/g, 'src=$1responsive-layout.js?v=' + version + '$1');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
  }
});

console.log('Cache busted ' + count + ' files successfully.');
