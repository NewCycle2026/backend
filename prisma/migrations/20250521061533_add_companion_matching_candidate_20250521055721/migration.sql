-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "profileHistoryId" INTEGER;

-- CreateTable
CREATE TABLE "CompanionMatchingCandidate" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "matchScore" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'suggested',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanionMatchingCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanionMatchingRequest" (
    "id" SERIAL NOT NULL,
    "tripId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "candidateUserId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanionMatchingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompanionMatchingCandidate_tripId_candidateId_key" ON "CompanionMatchingCandidate"("tripId", "candidateId");

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_profileHistoryId_fkey" FOREIGN KEY ("profileHistoryId") REFERENCES "UserProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionMatchingCandidate" ADD CONSTRAINT "CompanionMatchingCandidate_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionMatchingCandidate" ADD CONSTRAINT "CompanionMatchingCandidate_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionMatchingRequest" ADD CONSTRAINT "CompanionMatchingRequest_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionMatchingRequest" ADD CONSTRAINT "CompanionMatchingRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanionMatchingRequest" ADD CONSTRAINT "CompanionMatchingRequest_candidateUserId_fkey" FOREIGN KEY ("candidateUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
