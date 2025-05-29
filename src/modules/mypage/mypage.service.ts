// src/modules/mypage/mypage.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MypageService {
  constructor(private readonly prisma: PrismaService) {}

  // 기본 정보
  async getMyInfo(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });
  }

  // 내가 작성한 게시글
  async getMyPosts(userId: number) {
    return this.prisma.post.findMany({
      where: {
        userId,
        parentPostId: null,       // 게시글만 (댓글 제외)
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 내가 작성한 댓글
  async getMyComments(userId: number) {
    return this.prisma.post.findMany({
      where: {
        userId,
        NOT: { parentPostId: null }, // 댓글만
        isDeleted: false,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

