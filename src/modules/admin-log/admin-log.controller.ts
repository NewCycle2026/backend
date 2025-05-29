// src/modules/admin-log/admin-log.controller.ts
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { AdminJwtGuard } from '@/modules/admin-auth/guards/admin-jwt.guard';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminLogService } from './admin-log.service';
import { AdminLogQueryDto } from './dto/admin-log-query.dto';
import { AdminLogResponseDto } from './dto/admin-log-response.dto';

@ApiTags('AdminLog')
@Controller('admin-log')
export class AdminLogController {
  constructor(private readonly adminLogService: AdminLogService) {}

  @Get('list')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('SUPER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 로그인/로그아웃 로그 조회 (검색/필터/페이징 포함)' })
  async getLogList(@Query() query: AdminLogQueryDto): Promise<AdminLogResponseDto[]> {
    return this.adminLogService.getLogs(query);
  }
}


