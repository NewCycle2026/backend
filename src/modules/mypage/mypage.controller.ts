// src/modules/mypage/mypage.controller.ts
import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MypageService } from './mypage.service';

@ApiTags('mypage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mypage')
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}

  @Get(':id')
  @ApiOperation({ summary: '사용자 정보 조회' })
  @ApiParam({ name: 'id', type: Number, description: '사용자 ID' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  getMyInfo(@Param('id', ParseIntPipe) id: number) {
    return this.mypageService.getMyInfo(id);
  }

  @Get('posts')
  @ApiOperation({ summary: '내가 쓴 게시글 목록' })
  getMyPosts(@Req() req: any) {
    return this.mypageService.getMyPosts(req.user.id);
  }

  @Get('comments')
  @ApiOperation({ summary: '내가 쓴 댓글 목록' })
  getMyComments(@Req() req: any) {
    return this.mypageService.getMyComments(req.user.id);
  }
}

