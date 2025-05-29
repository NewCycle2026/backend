// src/modules/board/board.module.ts
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [PrismaModule],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
