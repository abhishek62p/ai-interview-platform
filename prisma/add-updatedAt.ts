import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ensureUpdatedAtOnInterview() {
  console.log('Checking for missing `updatedAt` column on `Interview` table...');
  const rows: Array<{ column_name: string }> = await prisma.$queryRawUnsafe(
    "SELECT column_name FROM information_schema.columns WHERE table_name='Interview' AND column_name='updatedAt'"
  );

  if (rows.length > 0) {
    console.log('`updatedAt` column already exists. No action needed.');
    return;
  }

  console.log('`updatedAt` column missing. Adding column...');
  // Add the column with a default value so existing rows are populated.
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "Interview" ADD COLUMN "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW();'
  );
  console.log('`updatedAt` column successfully added.');
}

async function main() {
  await ensureUpdatedAtOnInterview();
}

main()
  .catch((e) => {
    console.error('Failed to add `updatedAt` column:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
