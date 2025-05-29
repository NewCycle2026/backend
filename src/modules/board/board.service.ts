// src/modules/board/board.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { Board } from '@prisma/client';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  // 이름 또는 슬러그 중복 검사
  async findByNameOrSlug(name: string, slug: string) {
    return this.prisma.board.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    });
  }

  // 게시판 생성
  async create(dto: CreateBoardDto) {
    // ✅ 중복 검사
    const exists = await this.findByNameOrSlug(dto.name, dto.slug);
    if (exists) {
      throw new ConflictException('동일한 이름 또는 slug의 게시판이 이미 존재합니다.');
    }

    const parent = await this.prisma.board.create({ data: dto });

    // ✅ 댓글/파일 게시판 자동 생성
    if (dto.type === 'post') {
      await Promise.all([
        this.prisma.board.create({
          data: {
            name: `${dto.name} - 댓글`,
            slug: `${dto.slug}_comment`,
            type: 'comment',
            parentId: parent.id,
            isPublic: false,
            allowPost: true,
            allowComment: false,
            allowFile: false,
            writePermission: 'LOGIN',
            commentPermission: 'NONE',
            filePermission: 'NONE',
            displayOrder: 98,
          },
        }),
        this.prisma.board.create({
          data: {
            name: `${dto.name} - 파일`,
            slug: `${dto.slug}_file`,
            type: 'file',
            parentId: parent.id,
            isPublic: false,
            allowPost: false,
            allowComment: false,
            allowFile: true,
            writePermission: 'ADMIN',
            commentPermission: 'NONE',
            filePermission: 'LOGIN',
            displayOrder: 99,
          },
        }),
      ]);
    }

    return parent;
  }

  // 게시판 전체 목록 조회 (단순 리스트)
  async findAll(): Promise<Board[]> {
    const result = await this.prisma.board.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    console.log('📋 전체 게시판 수:', result.length);
    return result;
  }

/*
  async findAll(): Promise<Board[]> {
    return this.prisma.board.findMany({
      //where: { type: 'post' }, // 필요 시 필터링 조건 적용
      orderBy: { displayOrder: 'asc' },
    });
    console.log('📋 전체 게시판 수:', result.length);
    return result;
  }
*/

  // 트리형 전체 게시판 목록 (트리 구조)
  async findAllTree() {
    return this.prisma.board.findMany({
      where: { parentId: null },
      orderBy: { displayOrder: 'asc' },
      include: {
        children: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  // 게시판 상세 조회
  async findOne(id: number) {
    return this.prisma.board.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { displayOrder: 'asc' },
        },
        parent: true,
      },
    });
  }

  // 게시판 수정
  async update(id: number, dto: UpdateBoardDto) {
    return this.prisma.board.update({
      where: { id },
      data: dto,
    });
  }

  // 게시판 삭제
  async delete(id: number, force = false) {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!board) throw new Error('Board not found');

    if (board.children.length > 0 && !force) {
      throw new Error('하위 게시판이 있어 삭제할 수 없습니다.');
    }

    if (force && board.children.length > 0) {
      const childIds = board.children.map((child) => child.id);
      await this.prisma.board.deleteMany({ where: { id: { in: childIds } } });
    }

    return this.prisma.board.delete({ where: { id } });
  }
}
