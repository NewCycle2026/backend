// src/modules/post/post.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        userId,
        boardId: dto.boardId,
        parentPostId: dto.parentPostId ?? null, // ✅ null로 명시
        title: dto.title ?? '제목 없음',
        content: dto.content,
        isNotice: dto.isNotice ?? false,        // ✅ 기본값 보장
        isSecret: dto.isSecret ?? false,
      },
    });
  }

  async findOne(postId: number, userId: number, isAdmin: boolean) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        board: true,
        user: {
          select: { id: true, email: true },
        },
      },
    });

    if (!post || post.isDeleted) {
      throw new Error('게시글을 찾을 수 없습니다.');
    }

    // 비밀글 접근 제한
    if (post.isSecret && post.userId !== userId && !isAdmin) {
      throw new Error('비밀글은 작성자 또는 관리자만 볼 수 있습니다.');
    }

    // 조회수 증가
    await this.prisma.post.update({
      where: { id: postId },
      data: { views: { increment: 1 } },
    });
    
    return post;
  }

  // update
  async update(postId: number, userId: number, isAdmin: boolean, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    if (!isAdmin && post.userId !== userId) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    if (!post || post.isDeleted) {
      throw new Error('존재하지 않는 게시글입니다.');
    }

    if (post.userId !== userId && !isAdmin) {
      throw new Error('수정 권한이 없습니다.');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  // delete
  async delete(postId: number, userId: number, isAdmin: boolean) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.isDeleted) {
      throw new Error('존재하지 않거나 이미 삭제된 게시글입니다.');
    }

    if (post.userId !== userId && !isAdmin) {
      throw new Error('삭제 권한이 없습니다.');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { isDeleted: true },
    });
  }

  // 내 게시글
  async findByBoardSlug(slug: string, userId: number, isAdmin: boolean, page = 1, take = 10) {
    const board = await this.prisma.board.findUnique({
      where: { slug },
    });

    if (!board) throw new Error('게시판을 찾을 수 없습니다.');

    const skip = (page - 1) * take;
    const posts = await this.prisma.post.findMany({
      where: {
        boardId: board.id,
        isDeleted: false,
        OR: [
          { isSecret: false },
          { userId: userId }, // 본인 글은 보여줘야 함
          ...(isAdmin ? [{}] : []) // 관리자면 다 보여줘도 됨
        ],
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
    return posts;
  }

  // 게시글 상세 조회
  async getDetail(postId: number, userId: number | null) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true, email: true } },
        childPosts: {
          where: { isDeleted: false },
          include: {
            user: { select: { id: true, email: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        File: true,
      },
    });

    if (!post || post.isDeleted) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 비밀글인데 본인도 아니고 관리자도 아님
    if (post.isSecret && post.userId !== userId) {
      throw new ForbiddenException('비밀글은 본인만 열람할 수 있습니다.');
    }
    return post;
  }

  // 댓글 조회
  async getComments(postId: number) {
    return this.prisma.post.findMany({
      where: {
        parentPostId: postId,
        isDeleted: false,
    },
    orderBy: { createdAt: 'asc' },
    include: {
      user: { select: { id: true, email: true } },
    },
    });
  }

  //
  async createComment(dto: CreatePostDto, userId: number) {
    const board = await this.prisma.board.findUnique({
      where: { id: dto.boardId },
    });
    if (!board) throw new Error('댓글 게시판이 존재하지 않습니다.');

    const parent = await this.prisma.post.findUnique({
      where: { id: dto.parentPostId },
    });
    if (!parent) throw new Error('댓글을 달 게시글이 존재하지 않습니다.');

    return this.prisma.post.create({
      data: {
        boardId: dto.boardId,
        userId,
        parentPostId: dto.parentPostId,
        title: dto.title || '댓글',
        content: dto.content,
      },
    });
  }

  // 댓글 목록
  async getCommentsByPostId(postId: number) {
    const comments = await this.prisma.post.findMany({
      where: {
        parentPostId: postId,
        isDeleted: false,
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
    return comments;
  }

  // 댓글 수정
  async updateComment(
    commentId: number,
    userId: number,
    isAdmin: boolean,
    dto: UpdatePostDto,
  ) {
    const comment = await this.prisma.post.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.isDeleted) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.userId !== userId && !isAdmin) {
      throw new ForbiddenException('수정 권한이 없습니다.');
    }

    return this.prisma.post.update({
      where: { id: commentId },
      data: {
        title: dto.title ?? comment.title,
        content: dto.content ?? comment.content,
        updatedAt: new Date(),
      },
    });
  }

  // 댓글 삭제
  async deleteComment(postId: number, userId: number, isAdmin: boolean) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.isDeleted) {
      throw new NotFoundException('이미 삭제되었거나 존재하지 않는 댓글입니다.');
    }

    if (post.userId !== userId && !isAdmin) {
      throw new ForbiddenException('삭제 권한이 없습니다.');
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: { isDeleted: true },
    });
  }
}
