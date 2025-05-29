// src/modules/admin-log/admin-log.module.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AdminLogController } from './admin-log.controller';
import { AdminLogService } from './admin-log.service';

@Module({
  controllers: [AdminLogController],
  providers: [AdminLogService, PrismaService],
  exports: [AdminLogService],
})
export class AdminLogModule {}


