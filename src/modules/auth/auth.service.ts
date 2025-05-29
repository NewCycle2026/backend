// src/modules/auth/auth.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RequestResetPasswordDto, ResetPasswordDto } from './dto/request-reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ✅ 로그인 유저 검증
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // ✅ 로그인 토큰 발급
  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  // ✅ 로그인 아웃
  async logout(userId: number, accessToken: string): Promise<void> {
    console.log(`🚪 로그아웃 요청 - 사용자 ID: ${userId}, 토큰: ${accessToken}`);
    // 🔒 향후 확장:
    // - Redis 블랙리스트에 accessToken 저장 (만료시간까지)
    // - RefreshToken 삭제 (DB/Redis)
    // - 활동 로그 저장
  }


  // ✅ 이메일 중복 확인
  async checkEmailDuplicate(email: string) {
    const exists = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return { isDuplicate: !!exists };
  }

  // ✅ 닉네임 중복 확인
  async checkNickname(nickname: string) {
    const exists = await this.prisma.userProfile.findFirst({
      where: { nickname },
      orderBy: { recordedAt: 'desc' },
    });
    return { exists: !!exists };
  }

  // ✅ 이메일 인증 (초기화 토큰 발급)
  async requestResetPassword(dto: RequestResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // 보안상 존재하지 않아도 응답
    if (!user) {
      return { message: '비밀번호 초기화 이메일이 전송되었습니다.' };
    }

    const token = uuidv4(); // 또는 JWT 사용 가능

    // ✅ 이메일 전송 생략 (TODO: 실제 구현)
    console.log(`📨 Password reset token for ${dto.email}: ${token}`);

    // ✅ DB에 초기화 토큰 저장
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15분 유효
      },
    });

    return { message: '비밀번호 초기화 이메일이 전송되었습니다.' };
  }

  // ✅ 비밀번호 초기화 처리
  async resetPassword(dto: ResetPasswordDto) {
    const tokenEntry = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true },
    });

    if (!tokenEntry || tokenEntry.expiresAt < new Date()) {
      throw new BadRequestException('토큰이 유효하지 않거나 만료되었습니다.');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: tokenEntry.userId },
      data: { password: hashed },
    });

    await this.prisma.passwordResetToken.delete({
      where: { id: tokenEntry.id },
    });

    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
