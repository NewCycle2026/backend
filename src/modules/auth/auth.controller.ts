// src/modules/auth/auth.controller.ts
import { extractUserId } from '@/common/utils/extract-user-id.util';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '사용자 로그인' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      return { message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiBearerAuth()
  @ApiOperation({ summary: '사용자 로그아웃' })
  async logout(@Req() req: Request) {
    const rawToken = req.headers.authorization;
    if (!rawToken) { throw new UnauthorizedException('Authorization header 누락'); }
    const accessToken = rawToken.replace('Bearer ', '');
    const userId = extractUserId(req);
    await this.authService.logout(userId, accessToken);
    return { message: '로그아웃 되었습니다.' };
  }

  @Get('check-email')
  @ApiOperation({ summary: '이메일 중복 확인' })
  checkEmail(@Query('email') email: string) {
    return this.authService.checkEmailDuplicate(email);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '로그인 → 프로필 호출' })
  @Get('profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @ApiOperation({ summary: '비밀번호 분실 → 재설정 요청' })
  @Post('request-reset')
  requestResetPassword(@Body() dto: RequestResetPasswordDto) {
    return this.authService.requestResetPassword(dto);
  }
}
