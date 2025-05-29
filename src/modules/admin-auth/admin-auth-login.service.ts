//src/modules/admin-auth/admin-auth-login.service.ts
import { AdminLogService } from '@/modules/admin-log/admin-log.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AdminAuthLoginDto } from './dto/admin-auth-login.dto';


@Injectable()
export class AdminAuthLoginService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly adminLogService: AdminLogService,
  ) {}

  async login(dto: AdminAuthLoginDto, ip: string, userAgent: string): Promise<{ accessToken: string }> {
    // 1. 관리자 계정 조회 (이메일 & 소프트삭제된 계정 제외)
    const admin = await this.prisma.adminAccount.findFirst({
      where: {
        email: dto.email,
        deletedAt: null,
      },
    });

    if (!admin) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 2. 비밀번호 검증
    const isValid = await bcrypt.compare(dto.password, admin.password);
    if (!isValid) {
      // 실패 로그 기록
      await this.adminLogService.createLog({
        adminId: admin.id,
        ip,
        userAgent,
        success: false,
        type: LogType.LOGIN,
      });
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 3. JWT 토큰 생성
    const payload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    };
    const accessToken = this.jwtService.sign(payload);

    // 4. 성공 로그 기록
    await this.adminLogService.createLog({
      adminId: admin.id,
      ip,
      userAgent,
      success: true,
      type: LogType.LOGIN,
    });

    return { accessToken };
  }


  async logout(adminId: number, ip: string, userAgent: string): Promise<{ message: string }> {
    await this.adminLogService.createLog({
      adminId,
      ip,
      userAgent,
      success: true,
      type: 'LOGOUT',
    });

    return { message: '로그아웃 성공' };
  }
}
