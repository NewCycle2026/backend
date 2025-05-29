// src/modules/admin-auth/admin-auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AdminAuthLoginController } from './admin-auth-login.controller';
import { AdminAuthLoginService } from './admin-auth-login.service';

import { AdminAuthLogoutController } from './admin-auth-logout.controller';
import { AdminAuthLogoutService } from './admin-auth-logout.service';

import { AdminJwtGuard } from './guards/admin-jwt.guard';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';

import { AdminLogModule } from '@/modules/admin-log/admin-log.module';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default-secret',
      signOptions: { expiresIn: '1h' },
    }),
    AdminLogModule,
  ],
  controllers: [
    AdminAuthLoginController,
    AdminAuthLogoutController,
  ],
  providers: [
    AdminAuthLoginService,
    AdminAuthLogoutService,
    AdminJwtStrategy,
    AdminJwtGuard,
    PrismaService,
  ],
})
export class AdminAuthModule {}


