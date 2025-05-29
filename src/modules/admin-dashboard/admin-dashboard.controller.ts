// 📁 src/modules/admin-dashboard/admin-dashboard.controller.ts
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminJwtGuard } from '../admin-auth/guards/admin-jwt.guard';
import { AdminDashboardService } from './admin-dashboard.service';

interface JwtPayload {
  sub: number;
  email: string;
  role?: string;
}

@ApiTags('AdminDashboard')
@Controller('admin-dashboard')
class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('summary')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '대시보드 요약 통계' })
  getSummary() {
    return this.dashboardService.getSummaryStats();
  }

  @Get('weekly')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '일주일간 게시글/댓글 등록 수 통계' })
  getWeeklyStats() {
    return this.dashboardService.getDailyPostCounts();
  }

  @Get('posts')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 목록 조회' })
  getPostList(
    @Query('page') page: string,
    @Query('take') take: string,
    @Query('isDeleted') isDeleted?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.dashboardService.getPostList(
      parseInt(page || '1', 10),
      parseInt(take || '10', 10),
      isDeleted === undefined ? undefined : isDeleted === 'true',
      keyword,
    );
  }

  @Get('posts/:id')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 상세 조회' })
  getPostDetail(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.getPostDetail(id);
  }

  @Post('posts/:id/delete')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '게시글 삭제 또는 복구 (관리자)' })
  deletePostByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() admin: JwtPayload,
    @Req() req: Request,
  ) {
    return this.dashboardService.deletePostByAdmin(
      id,
      admin.sub,
      req.ip?.toString() || '0.0.0.0',
      req.headers['user-agent']?.toString() || '',
    );
  }

  @Get('comments')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 목록 조회' })
  getCommentList(
    @Query('page') page: string,
    @Query('take') take: string,
    @Query('isDeleted') isDeleted?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.dashboardService.getCommentList(
      parseInt(page || '1', 10),
      parseInt(take || '10', 10),
      isDeleted === undefined ? undefined : isDeleted === 'true',
      keyword,
    );
  }

  @Get('comments/:id')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 상세 조회' })
  getCommentDetail(@Param('id', ParseIntPipe) id: number) {
    return this.dashboardService.getCommentDetail(id);
  }

  @Post('comments/:id/delete')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '댓글 삭제 또는 복구 (관리자)' })
  deleteCommentByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() admin: JwtPayload,
    @Req() req: Request,
  ) {
    return this.dashboardService.deleteCommentByAdmin(
      id,
      admin.sub,
      req.ip?.toString() || '0.0.0.0',
      req.headers['user-agent']?.toString() || '',
    );
  }
}

export { AdminDashboardController };
