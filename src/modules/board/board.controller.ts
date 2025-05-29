// src/modules/board/board.controller.ts
import {
  Body, Controller, Delete, Get,
  Param, ParseIntPipe, Patch, Post, Query
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Board } from '@prisma/client';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@ApiTags('Board')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get('list')
  @ApiOperation({ summary: '게시판 전체 목록 조회 (일반 리스트)' })
  getBoardList(): Promise<Board[]> {
    return this.boardService.findAll();
  }

  @Get('tree/all')
  @ApiOperation({ summary: '전체 게시판 트리 조회 (최상위 + 자식 게시판 포함)' })
  findAllTree() {
    return this.boardService.findAllTree();
  }

  @Post()
  @ApiOperation({ summary: '게시판 생성' })
  create(@Body() dto: CreateBoardDto) {
    return this.boardService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시판 상세 조회' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.boardService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '게시판 수정' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBoardDto
  ) {
    return this.boardService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '게시판 삭제 (force=true 시 자식 포함)' })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Query('force') force?: string,
  ) {
    return this.boardService.delete(id, force === 'true');
  }
}

/*
   @Get('list')
  @ApiOperation({ summary: "게시판 목록 조회" })
  async findAll(): Promise<{ boards: Board[] }> {
    const boards = await this.boardService.findAll();
    return { boards };
  }
*/
/*
  @Post()
  @ApiOperation({ summary: '게시판 생성' })
  async createBoard(@Body() dto: CreateBoardDto) {
    const exists = await this.boardService.findByName(dto.name);
    if (exists) {
      throw new ConflictException('동일한 게시판이 이미 존재합니다.');
    }
    return this.boardService.create(dto);
  }*/
/*
  @Get('list')
  @ApiOperation({ summary: "게시판 목록 조회" })
  async findAll(): Promise<Board[]> {
    return this.boardService.findAll();
  }
*/ 