/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,name]` on the table `teams` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "teams_organizationId_name_idx";

-- CreateIndex
CREATE INDEX "teams_organizationId_idx" ON "teams"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "teams_organizationId_name_key" ON "teams"("organizationId", "name");
