/*
  Warnings:

  - You are about to drop the column `role` on the `OrganizationMember` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "OrganizationMember_organizationId_role_idx";

-- AlterTable
ALTER TABLE "OrganizationMember" DROP COLUMN "role",
ADD COLUMN     "organizationRole" "OrganizationRole" NOT NULL DEFAULT 'MEMBER';

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_organizationRole_idx" ON "OrganizationMember"("organizationId", "organizationRole");
