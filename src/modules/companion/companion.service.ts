// src/modules/companion/companion.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompanionService {
  constructor(private readonly prisma: PrismaService) {}

  async applyForCompanion(userId: number, tripId: number) {
    const existing = await this.prisma.companion.findFirst({
      where: { userId, tripId },
    });

    if (existing) {
      throw new ConflictException('이미 신청한 여행입니다.');
    }

    const application = await this.prisma.companion.create({
      data: {
        userId,
        tripId,
        status: 'pending',
      },
    });

    return {
      message: '동행 신청 완료',
      applicationId: application.id,
    };
  }

  async listTripCompanions( tripId: number, status?: 'pending' | 'accepted' | 'rejected',) {
    return this.prisma.companion.findMany({
      where: {
        tripId,
        ...(status ? { status } : {}),
      },
      include: { user: { select: {
        id: true,
        email: true,
        userProfiles: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
          select: {
            nickname: true,
          },
        },
      }, 
    }, 
  }, }); }

  async updateStatus(companionId: number, status: 'accepted' | 'rejected') {
    return this.prisma.companion.update({
      where: { id: companionId },
      data: { status, matchedAt: new Date() },
    });
  }
}
