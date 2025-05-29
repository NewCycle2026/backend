-- AlterTable
ALTER TABLE "AdminLog" ADD COLUMN     "action" TEXT,
ADD COLUMN     "detail" TEXT,
ADD COLUMN     "targetId" INTEGER,
ADD COLUMN     "targetType" TEXT;
