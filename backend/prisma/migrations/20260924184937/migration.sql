/*
  Warnings:

  - Changed the type of `provider` on the `oauthaccounts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('CREDENTIALS', 'GOOGLE', 'GITHUB', 'FACEBOOK');

-- AlterTable
ALTER TABLE "oauthaccounts" DROP COLUMN "provider",
ADD COLUMN     "provider" "AuthProvider" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "oauthaccounts_provider_providerAccountId_key" ON "oauthaccounts"("provider", "providerAccountId");
