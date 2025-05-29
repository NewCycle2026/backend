// src/modules/matching/matching.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class MatchingService {
  constructor(private prisma: PrismaService) {}

  async getCandidates(tripId: number) {
    return this.prisma.companionMatchingCandidate.findMany({
      where: { tripId },
      include: { candidate: true },
    });
  }

  async sendRequest(dto: CreateRequestDto) {
    return this.prisma.companionMatchingRequest.create({
      data: {
        tripId: dto.tripId,
        userId: dto.userId,
        candidateUserId: dto.candidateUserId,
      },
    });
  }

  async acceptRequest(id: number) {
    const request = await this.prisma.companionMatchingRequest.update({
      where: { id },
      data: { status: 'accepted' },
    });

    await this.prisma.companion.create({
      data: {
        tripId: request.tripId,
        userId: request.candidateUserId,
        status: 'confirmed',
        matchedAt: new Date(),
      },
    });

    return { message: '요청 수락 및 동행자 등록 완료' };
  }
}
