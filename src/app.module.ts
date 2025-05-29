// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// 인증 & 보안
import { AuthModule } from '@/modules/auth/auth.module';
import { JwtStrategy } from '@/modules/auth/jwt.strategy';

// 사용자 관련
import { MypageModule } from '@/modules/mypage/mypage.module';
import { UserProfileModule } from '@/modules/user-profile/user-profile.module';
import { UsersModule } from '@/modules/users/user.module';

// 여행/매칭/ESG
import { CompanionModule } from '@/modules/companion/companion.module';
import { EsgModule } from '@/modules/esg/esg.module';
import { MatchingModule } from '@/modules/matching/matching.module';
import { TripModule } from '@/modules/trip/trip.module';

// 게시판/파일/좋아요
import { BoardModule } from '@/modules/board/board.module';
import { FileModule } from '@/modules/file/file.module';
import { LikeModule } from '@/modules/like/like.module';

// DB
import { PrismaModule } from '@/prisma/prisma.module';

// 관리자 모듈
import { AdminAccountModule } from '@/modules/admin-account/admin-account.module';
import { AdminAuthModule } from '@/modules/admin-auth/admin-auth.module';
import { AdminDashboardModule } from '@/modules/admin-dashboard/admin-dashboard.module';
import { AdminLogModule } from '@/modules/admin-log/admin-log.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ 전역 환경변수 로딩
    JwtModule.register({
      global: true, // 👈 이게 있어야 NestJS 전체에서 JWT 전략 작동
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),

    // 공통
    PrismaModule,
    AuthModule,

    // 사용자
    UsersModule,
    UserProfileModule,
    MypageModule,

    // 여행 및 ESG
    TripModule,
    CompanionModule,
    MatchingModule,
    EsgModule,

    // 게시판 기능
    BoardModule,
    FileModule,
    LikeModule,

    // 관리자
    AdminAuthModule,
    AdminAccountModule,
    AdminLogModule,
    AdminDashboardModule,
  ],
  exports: [JwtModule],
  providers: [JwtStrategy],
})
export class AppModule {}
