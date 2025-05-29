// src/modules/password-change-log/password-change-log.module.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { PasswordChangeLogController } from './password-change-log.controller';
import { PasswordChangeLogService } from './password-change-log.service';

@Module({
  controllers: [PasswordChangeLogController],
  providers: [PasswordChangeLogService, PrismaService],
  exports: [PasswordChangeLogService],
})
export class PasswordChangeLogModule {}
