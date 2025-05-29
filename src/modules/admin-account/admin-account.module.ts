// /src/modules/admin-account/admin-account.module.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AdminAccountController } from './admin-account.controller';
import { AdminAccountService } from './admin-account.service';

@Module({
  controllers: [AdminAccountController],
  providers: [AdminAccountService, PrismaService],
})
export class AdminAccountModule {}
