// xrc/modules/admin-account/password-change-log.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordChangeLogService {
  constructor(private readonly prisma: PrismaService) {}

  async logPasswordChange(adminId: number, changedBy: string, description?: string) {
    return this.prisma.passwordChangeLog.create({
      data: {
        adminId,
        changedBy,
        description,
      },
    });
  }

  async getLogs(adminId: number) {
    return this.prisma.passwordChangeLog.findMany({
      where: { adminId },
      orderBy: { changedAt: 'desc' },
    });
  }
}
