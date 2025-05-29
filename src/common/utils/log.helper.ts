// src/common/util/log.helper.ts (로그 유틸 함수)
// 📁 src/common/util/log.helper.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LogType } from '@prisma/client';

interface LogCreateInput {
  adminId: number;
  type: LogType;
  ip: string;
  userAgent: string;
  success: boolean;
  action?: string;
  targetType?: string;
  targetId?: number;
  detail?: string;
}

@Injectable()
export class AdminLogHelper {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 공통 로그 생성 유틸
   */
  async createLog(data: LogCreateInput) {
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

  /**
   * 로그인 로그 기록
   */
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

  /**
   * 로그아웃 로그 기록
   */
  async createLogoutLog(data: {
    adminId: number;
    ip: string;
    userAgent: string;
    success: boolean;
  }) {
    return this.createLog({
      ...data,
      type: LogType.LOGOUT,
    });
  }
}



