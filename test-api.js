const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function test() {
  console.log("Testing bcryptjs...");
  try {
    const hash = await bcrypt.hash("test", 10);
    console.log("Bcrypt success:", hash);
  } catch (e) {
    console.error("Bcrypt failed:", e);
  }

  console.log("Testing Prisma...");
  const prisma = new PrismaClient();
  try {
    const userCount = await prisma.user.count();
    console.log("Prisma success, user count:", userCount);
  } catch (e) {
    console.error("Prisma failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

test();
