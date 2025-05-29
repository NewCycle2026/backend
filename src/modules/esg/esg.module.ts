// src/modules/esg/esg.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { EsgController } from './esg.controller';
import { EsgService } from './esg.service';

@Module({
  imports: [PrismaModule],
  controllers: [EsgController],
  providers: [EsgService],
})
export class EsgModule {}