/*
  Warnings:

  - The `role` column on the `AdminAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER', 'ADMIN', 'STAFF');

-- AlterTable
ALTER TABLE "AdminAccount" DROP COLUMN "role",
ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'ADMIN';
