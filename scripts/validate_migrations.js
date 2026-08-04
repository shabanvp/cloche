const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');

console.log('--- CLOCHE MIGRATION VALIDATION ---');
console.log(`Checking migrations directory: ${migrationsDir}\n`);

if (!fs.existsSync(migrationsDir)) {
  console.error(`Error: Directory ${migrationsDir} does not exist.`);
  process.exit(1);
}

const files = fs.readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort();

console.log(`Found ${files.length} migration file(s):`);

let hasErrors = false;

files.forEach((file, index) => {
  const filePath = path.join(migrationsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`\n[${index + 1}/${files.length}] ${file}`);
  
  // Remove comment lines for checks
  const uncommented = content.replace(/^--.*$/gm, '').trim();

  // Syntax checks
  const forbiddenKeywords = /\b(NULLABLE|NVARCHAR|IDENTITY|UNIQUEIDENTIFIER|GETDATE|GO|AUTO_INCREMENT)\b/i;

  const checks = [
    { name: 'Contains BEGIN; block', test: /^BEGIN;/m.test(uncommented) },
    { name: 'Ends with COMMIT;', test: /COMMIT;$/m.test(uncommented) },
    { name: 'Contains valid DDL or DML statements', test: /CREATE|ALTER|INSERT/i.test(uncommented) },
    { name: 'Strict PostgreSQL 16 keyword compliance (no T-SQL/MySQL keywords)', test: !forbiddenKeywords.test(uncommented) },
    { name: 'No syntax error artifacts', test: !/\[object Object\]|NaN/i.test(uncommented) }
  ];

  checks.forEach(check => {
    if (check.test) {
      console.log(`  ✓ ${check.name}`);
    } else {
      console.log(`  ✗ FAIL: ${check.name}`);
      hasErrors = true;
    }
  });
});

if (hasErrors) {
  console.error('\nValidation completed with errors.');
  process.exit(1);
} else {
  console.log('\nAll migration files passed syntax & structure validation successfully!');
}
