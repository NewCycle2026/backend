// src/modules/password-change-log/password-change-log.controller.ts
import { AdminJwtGuard } from '@/modules/admin-auth/guards/admin-jwt.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PasswordChangeLogService } from './password-change-log.service';

@ApiTags('PasswordChangeLog')
@Controller('password-change-log')
export class PasswordChangeLogController {
  constructor(private readonly passwordChangeLogService: PasswordChangeLogService) {}

  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 비밀번호 변경 로그 조회' })
  @Get('admin/:adminId')
  async getLogsByAdmin(@Param('adminId') adminId: string) {
    return this.passwordChangeLogService.getLogs(Number(adminId));
  }
}
