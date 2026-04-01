const { execSync } = require('child_process');
process.env.DATABASE_URL = 'mysql://root:password@localhost:3306/colvo_seo';
try {
  console.log('Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Success!');
} catch (error) {
  console.error('Failed to generate Prisma Client:', error.message);
  process.exit(1);
}
