-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "isScheduled" BOOLEAN DEFAULT false,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "scheduledBy" TEXT,
ADD COLUMN     "scheduledFor" TEXT;
