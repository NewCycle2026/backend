// src/modules/post/post.controller.ts
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Delete, Get, Param, ParseIntPipe, Patch, Post,
  Query,
  Req, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';

@ApiTags('Post')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: '게시글 작성' })
  create(@Body() dto: CreatePostDto, @Req() req: any) {
    return this.postService.create(req.user.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '게시글 수정 (작성자 또는 관리자)' })
  update(
    @Param('id', ParseIntPipe) postId: number,
    @Body() dto: UpdatePostDto,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.postService.update(postId, user.id, user.isAdmin, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '게시글 상세 조회 (조회수 증가 + 댓글, 파일 포함)' })
  getPostDetail(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const userId = req.user?.id ?? null;
    return this.postService.getDetail(id, userId);
  }
  
  @Delete(':id')
  @ApiOperation({ summary: '게시글 삭제 (Soft Delete)' })
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any
  ) {
    const userId = req.user?.id ?? 0;
    const isAdmin = req.user?.role === 'ADMIN';
    return this.postService.delete(id, userId, isAdmin);
  }

  @Get('board/:slug')
  @ApiOperation({ summary: '게시판별 게시글 목록 조회' })
  getBoardPosts(
    @Param('slug') slug: string,
    @Query('page') page: string,
    @Query('take') take: string,
    @Req() req: any,
  ) {
    const userId = req.user?.id ?? 0;
    const isAdmin = req.user?.role === 'ADMIN';
    const pageNum = parseInt(page || '1', 10);
    const takeNum = parseInt(take || '10', 10);

    return this.postService.findByBoardSlug(slug, userId, isAdmin, pageNum, takeNum);
  }

  @Post('comment')
  @ApiOperation({ summary: '댓글 작성' })
  createComment(@Body() dto: CreatePostDto, @Req() req: any) {
    return this.postService.createComment(dto, req.user.id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: '댓글 목록 조회' })
  getComments(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getCommentsByPostId(id);
  }

  @Patch('comment/:id')
  @ApiOperation({ summary: '댓글 수정' })
  updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
    @Req() req: any,
  ) {
    return this.postService.updateComment(
      id,
      req.user.id,
      req.user.role === 'ADMIN',
      dto,
    );
  }

  @Delete('comment/:id')
  @ApiOperation({ summary: '댓글 삭제 (작성자 또는 관리자)' })
  deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.postService.deleteComment(
      id,
      req.user.id,
      req.user.role === 'ADMIN',
    );
  }
}
