/*
  Warnings:

  - You are about to drop the `UserProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- DropTable
DROP TABLE "UserProfile";

-- CreateTable
CREATE TABLE "UserProfileHistory" (
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

    CONSTRAINT "UserProfileHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserProfileHistory" ADD CONSTRAINT "UserProfileHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
