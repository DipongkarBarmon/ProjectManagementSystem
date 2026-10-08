/*
  Warnings:

  - You are about to drop the column `role` on the `invitations` table. All the data in the column will be lost.
  - Added the required column `organizationRole` to the `invitations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invitations" DROP COLUMN "role",
ADD COLUMN     "organizationRole" "OrganizationRole" NOT NULL;
