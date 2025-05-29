// src/modules/admin-log/admin-log.service.ts
// src/modules/admin-log/admin-log.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { LogType } from '@prisma/client';
import { AdminLogQueryDto } from './dto/admin-log-query.dto';
import { AdminLogResponseDto } from './dto/admin-log-response.dto';

@Injectable()
export class AdminLogService {
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

  async logPostAction(adminId: number, ip: string, userAgent: string, postId: number, post: { isDeleted: boolean }) {
    await this.prisma.adminLog.create({
      data: {
        adminId,
        type: LogType.POST,
        ip,
        userAgent,
        success: true,
        action: post.isDeleted ? 'POST_RECOVER' : 'POST_SOFT_DELETE',
        targetType: 'POST',
        targetId: postId,
        detail: `관리자가 게시글(${postId})을 ${post.isDeleted ? '복구' : '삭제'} 처리`,
      },
    });
  }

  async logCommentDelete(adminId: number, ip: string, userAgent: string, id: number) {
    await this.prisma.adminLog.create({
      data: {
        adminId,
        type: LogType.COMMENT,
        ip,
        userAgent,
        success: true,
        action: 'COMMENT_DELETE',
        targetType: 'COMMENT',
        targetId: id,
        detail: `관리자가 댓글(${id})을 삭제`,
      },
    });
  }

  async getLogs(query: AdminLogQueryDto): Promise<AdminLogResponseDto[]> {
    const { type, email, success, skip = 0, take = 20 } = query;

    const logs = await this.prisma.adminLog.findMany({
      where: {
        type,
        success: success === undefined ? undefined : success === 'true',
        admin: {
          email: email ? { contains: email } : undefined,
          deletedAt: null,
        },
      },
      include: { admin: true },
      orderBy: { createdAt: 'desc' },
      skip: Number(skip),
      take: Number(take),
    });

    return logs.map((log) => ({
      id: log.id,
      email: log.admin.email,
      type: log.type,
      ip: log.ip,
      userAgent: log.userAgent,
      success: log.success,
      createdAt: log.createdAt,
    }));
  }
}
