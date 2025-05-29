// src/modules/post/like.module.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';

@Module({
  providers: [LikeService, PrismaService],
  controllers: [LikeController],
})
export class LikeModule {}
