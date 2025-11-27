// Script to fix existing user roles in the database
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fixing user roles...');
  
  // Delete all users (use this if testing, otherwise update them)
  const deleteResult = await prisma.user.deleteMany({});
  console.log(`Deleted ${deleteResult.count} users`);
  
  console.log('All users have been cleaned. You can now create new accounts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
