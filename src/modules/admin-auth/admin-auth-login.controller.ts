// src/modules/admin-auth/admin-auth-login.controller.ts
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AdminAuthLoginService } from './admin-auth-login.service';
import { AdminAuthLoginDto } from './dto/admin-auth-login.dto';

@ApiTags('AdminAuth')
@Controller('admin-auth')
export class AdminAuthLoginController {
  
  constructor(private readonly loginService: AdminAuthLoginService) {}

  @Post('login')
  @ApiOperation({ summary: '관리자 로그인' })
  async login(@Body() dto: AdminAuthLoginDto, @Req() req: Request) {
    const ip = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || req.ip || '0.0.0.0';

    const userAgent = Array.isArray(req.headers['user-agent'])
      ? req.headers['user-agent'][0]
      : req.headers['user-agent'] || 'unknown';

      console.log(`✅ 관리자 로그인 요청: email=${dto.email}, ip=${ip}`);

    return this.loginService.login(dto, ip, userAgent);
  }
}

