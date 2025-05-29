/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
DROP COLUMN "nickname";

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "name" TEXT,
ADD COLUMN     "nickname" TEXT;
