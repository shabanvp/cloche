const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
const dbMasterFile = path.join(__dirname, '..', 'database', '00_master_schema.sql');
const supabaseMasterFile = path.join(__dirname, '..', 'supabase', '00_master_schema.sql');

console.log('--- CLOCHE MASTER SCHEMA BUILDER ---');

const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`Combining ${files.length} migration file(s) into master schema...\n`);

let masterContent = `-- CLOCHE WEDDING PLATFORM - MASTER PRODUCTION DATABASE SCHEMA\n`;
masterContent += `-- Generated for PostgreSQL 16 & Supabase SQL Editor\n`;
masterContent += `-- Contains all 25 sequential migration steps in exact execution order.\n\n`;

files.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Safely remove top-level transaction BEGIN; and COMMIT; only
  content = content.replace(/^BEGIN;\s*\r?\n/m, '');
  content = content.replace(/\r?\nCOMMIT;\s*$/m, '');

  masterContent += `--------------------------------------------------------------------\n`;
  masterContent += `-- [MIGRATION ${index + 1}/${files.length}]: ${file}\n`;
  masterContent += `--------------------------------------------------------------------\n\n`;
  masterContent += content.trim() + `\n\n`;
});

masterContent = `BEGIN;\n\n` + masterContent + `COMMIT;\n\n-- Notify Supabase PostgREST to reload schema cache immediately\nNOTIFY pgrst, 'reload schema';\n`;

fs.writeFileSync(dbMasterFile, masterContent, 'utf8');
fs.writeFileSync(supabaseMasterFile, masterContent, 'utf8');

console.log(`✓ Master schema successfully generated at:`);
console.log(`  - ${dbMasterFile}`);
console.log(`  - ${supabaseMasterFile}\n`);
