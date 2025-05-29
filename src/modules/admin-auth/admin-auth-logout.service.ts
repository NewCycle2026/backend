// src/modules/admin-auth/admin-auth-logout.service.ts (또는 admin-log.service.ts)
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LogType } from '@prisma/client';

@Injectable()
export class AdminAuthLogoutService {
  constructor(private readonly prisma: PrismaService) {}

  async createLog(data: {
    adminId: number;
    type: LogType;
    ip: string;
    userAgent: string;
    success: boolean;
    action?: string;
    targetType?: string;
    targetId?: number;
    detail?: string;
  }) {
    return this.prisma.adminLog.create({
      data: {
        adminId: data.adminId,
        type: data.type,
        ip: data.ip,
        userAgent: data.userAgent,
        success: data.success,
        action: data.action ?? null,
        targetType: data.targetType ?? null,
        targetId: data.targetId ?? null,
        detail: data.detail ?? null,
      },
    });
  }

  async createLoginLog(data: {
    adminId: number;
    ip: string;
    userAgent: string;
    success: boolean;
  }) {
    return this.createLog({
      ...data,
      type: LogType.LOGIN,
    });
  }

  async logout(adminId: number, ip: string, userAgent: string) {
    return this.createLog({
      adminId,
      ip,
      userAgent,
      success: true,
      type: LogType.LOGOUT,
    });
  }
}
