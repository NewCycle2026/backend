/*
  Warnings:

  - You are about to drop the column `profileId` on the `Trip` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_profileId_fkey";

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "profileId",
ADD COLUMN     "userProfileId" INTEGER;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
