// src/modules/post/like.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class LikeService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleLike(userId: number, postId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.isDeleted) throw new NotFoundException('게시글을 찾을 수 없습니다.');

    const existing = await this.prisma.like.findUnique({
      where: {
        userId_postId: { userId, postId },
      },
    });

    if (existing) {
      await this.prisma.like.delete({
        where: { userId_postId: { userId, postId } },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: { userId, postId },
      });
      return { liked: true };
    }
  }

  async count(postId: number) {
    return this.prisma.like.count({
      where: { postId },
    });
  }

  async isLiked(userId: number, postId: number) {
    const liked = await this.prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    return !!liked;
  }
}
