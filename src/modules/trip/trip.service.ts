// src/modules/trip/trip.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TripService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ 여행 생성 시 profileHistoryId 포함 가능하도록 수정
  async createTrip(data: {
    userId: number;
    profileHistoryId?: number; // 선택 사항
    title: string;
    countryCode: string;
    distanceKm?: number;
    publicTransport?: boolean;
    startDate: Date;
    endDate: Date;
  }) {
    return this.prisma.trip.create({
      data: {
        userId: data.userId,
        userProfileId: data.profileHistoryId,
        title: data.title,
        countryCode: data.countryCode,
        distanceKm: data.distanceKm,
        publicTransport: data.publicTransport ?? false,
        startDate: data.startDate,
        endDate: data.endDate,
      },
    });
  }

  // ✅ 사용자 ID로 여행 목록 조회
  async findAllByUser(userId: number) {
    return this.prisma.trip.findMany({
      where: { userId },
      include: {
        profileHistory: true, // ✅ 성향 정보 포함
      },
    });
  }

  // ✅ 모집 중인 여행 (예: 동행자 수 기준으로 필터 가능)
  async findRecruitingTrips() {
    return this.prisma.trip.findMany({
      where: {
        companions: {
          some: {
            status: 'pending',
          },
        },
      },
      include: {
        companions: true,
      },
    });
  }
}

