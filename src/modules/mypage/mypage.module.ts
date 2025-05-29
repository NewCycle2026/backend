// src/modules/mypage/mypage.module.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { MypageController } from './mypage.controller';
import { MypageService } from './mypage.service';

@Module({
  controllers: [MypageController],
  providers: [MypageService, PrismaService],
})
export class MypageModule {}
