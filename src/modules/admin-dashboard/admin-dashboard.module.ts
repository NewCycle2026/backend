// src/modules/admin-dashboard/admin-dashboard.module.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminLogModule } from '../admin-log/admin-log.module';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminDashboardService } from './admin-dashboard.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultsecret',
      signOptions: { expiresIn: '1d' },
    }),
    AdminLogModule,
  ],
  controllers: [AdminDashboardController],
  providers: [AdminDashboardService, PrismaService],
})
export class AdminDashboardModule {}
