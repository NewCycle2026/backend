// /src/modules/admin-auth/admin-auth-logout.controller.ts
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminAuthLogoutService } from './admin-auth-logout.service'; // ✅ import 이름 일치
import { AdminJwtGuard } from './guards/admin-jwt.guard';

@ApiTags('AdminAuth')
@Controller('admin-auth')
export class AdminAuthLogoutController { // ✅ 클래스 이름 변경
  constructor(private readonly logoutService: AdminAuthLogoutService) {}

  @Post('logout')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 로그아웃' })
  async logout(@CurrentUser() admin: { sub: number }, @Req() req: Request) {
    const ip = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || req.ip || '0.0.0.0';

    const userAgent = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'][0]
      : req.headers['user-agent'] || 'unknown';

    return this.logoutService.logout(admin.sub, ip, userAgent);
  }
}