/*
  Warnings:

  - You are about to drop the column `action` on the `AdminLog` table. All the data in the column will be lost.
  - You are about to drop the column `detail` on the `AdminLog` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `AdminLog` table. All the data in the column will be lost.
  - You are about to drop the column `targetType` on the `AdminLog` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdminLog" DROP COLUMN "action",
DROP COLUMN "detail",
DROP COLUMN "targetId",
DROP COLUMN "targetType";
