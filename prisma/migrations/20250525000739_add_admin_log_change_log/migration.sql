/*
  Warnings:

  - You are about to drop the column `detail` on the `AdminLog` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `AdminLog` table. All the data in the column will be lost.
  - You are about to drop the column `targetType` on the `AdminLog` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('LOGIN', 'LOGOUT');

-- AlterTable
ALTER TABLE "AdminAccount" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "AdminLog" DROP COLUMN "detail",
DROP COLUMN "targetId",
DROP COLUMN "targetType",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "ip" TEXT NOT NULL DEFAULT '0.0.0.0',
ADD COLUMN     "success" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "LogType" NOT NULL DEFAULT 'LOGIN',
ADD COLUMN     "userAgent" TEXT NOT NULL DEFAULT 'unknown',
ALTER COLUMN "action" DROP NOT NULL;

-- CreateTable
CREATE TABLE "PasswordChangeLog" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedBy" TEXT NOT NULL,
    "description" TEXT,
    "adminLogId" INTEGER,

    CONSTRAINT "PasswordChangeLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PasswordChangeLog_adminId_idx" ON "PasswordChangeLog"("adminId");

-- CreateIndex
CREATE INDEX "AdminLog_adminId_idx" ON "AdminLog"("adminId");

-- AddForeignKey
ALTER TABLE "PasswordChangeLog" ADD CONSTRAINT "PasswordChangeLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordChangeLog" ADD CONSTRAINT "PasswordChangeLog_adminLogId_fkey" FOREIGN KEY ("adminLogId") REFERENCES "AdminLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;
