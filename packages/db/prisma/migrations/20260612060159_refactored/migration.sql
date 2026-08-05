/*
  Warnings:

  - Added the required column `itemType` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "leadStatus" ADD VALUE 'CANCELLED';

-- DropIndex
DROP INDEX "appointments_leadId_idx";

-- DropIndex
DROP INDEX "items_installationId_key";

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "assignedToId" UUID,
ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "installations" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "invitations" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "itemType" "interestedItem" NOT NULL,
ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid(),
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "leads" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "members" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "organizations" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "sessions" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- AlterTable
ALTER TABLE "verifications" ALTER COLUMN "id" SET DEFAULT pg_catalog.gen_random_uuid();

-- CreateIndex
CREATE INDEX "appointments_leadId_assignedToId_idx" ON "appointments"("leadId", "assignedToId");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
