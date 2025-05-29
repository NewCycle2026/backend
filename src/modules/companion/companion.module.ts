// src/modules/companion/companion.module.ts
import { Module } from '@nestjs/common';
import { CompanionService } from './companion.service';
import { CompanionController } from './companion.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CompanionController],
  providers: [CompanionService],
})
export class CompanionModule {}

