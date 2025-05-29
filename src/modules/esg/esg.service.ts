// ESG 계산 & 저장)
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EsgService {
  constructor(private prisma: PrismaService) {}

  async getUserReports(userId: number) {
    return this.prisma.esgReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateEsgReport(userId: number) {
    const trips = await this.prisma.trip.findMany({ where: { userId } });

    const total = trips.length;
    const publicUsed = trips.filter((t) => t.publicTransport === true).length;
    const avgDistance = total > 0
      ? trips.reduce((sum, t) => sum + (t.distanceKm ?? 0), 0) / total
      : 0;

    // ✅ ESG 점수 계산
    const score =
      (publicUsed / total) * 50 + // 최대 50점
      (avgDistance < 300 ? 30 : avgDistance < 600 ? 20 : 10); // 최대 30점
    const finalScore = Math.round(score);

    // ✅ 저장
    const report = await this.prisma.esgReport.create({
      data: {
        userId,
        period: this.getCurrentQuarter(),
        score: finalScore,
        summary: `친환경 교통 ${publicUsed}/${total}, 평균거리 ${Math.round(avgDistance)}km`,
      },
    });

    return report;
  }

  private getCurrentQuarter(): string {
    const now = new Date();
    const q = Math.floor(now.getMonth() / 3) + 1;
    return `${now.getFullYear()}-Q${q}`;
  }
}

