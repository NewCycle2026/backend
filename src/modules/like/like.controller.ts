// src/modules/post/like.controller.ts
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikeService } from './like.service';

@ApiTags('Like')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  @ApiOperation({ summary: '좋아요 토글' })
  toggleLike(@Param('postId', ParseIntPipe) postId: number, @Req() req: any) {
    return this.likeService.toggleLike(req.user.id, postId);
  }

  @Get(':postId/count')
  @ApiOperation({ summary: '해당 게시글 좋아요 개수' })
  count(@Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.count(postId);
  }

  @Get(':postId/status')
  @ApiOperation({ summary: '내가 해당 글에 좋아요 눌렀는지 여부' })
  isLiked(@Param('postId', ParseIntPipe) postId: number, @Req() req: any) {
    return this.likeService.isLiked(req.user.id, postId);
  }
}
