/*
  Warnings:

  - You are about to drop the column `profileHistoryId` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the `UserProfileHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProfileHistory" DROP CONSTRAINT "UserProfileHistory_userId_fkey";

-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "profileHistoryId",
ADD COLUMN     "profileId" INTEGER;

-- DropTable
DROP TABLE "UserProfileHistory";

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "age" INTEGER,
    "gender" TEXT,
    "travelType" TEXT,
    "interests" TEXT[],
    "budgetLevel" TEXT,
    "preferredSeason" TEXT,
    "ecoFriendly" BOOLEAN,
    "country" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
