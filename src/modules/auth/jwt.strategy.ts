// src/modules/auth/jwt.strategy.ts
// src/modules/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service'; // 경로는 프로젝트 구조에 맞게 조정


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'wayple2026secretkey',
    });
  }

  async validate(payload: any) {
    console.log('🧩 JWT VALIDATED:', payload);

    // 실제 DB에서 유저 조회 (option)
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) throw new UnauthorizedException();
    return user;
    /*
    if (!user) return null;

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    */
  }
}


/*
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'wayple2026secretkey',
      // secretOrKey: process.env.JWT_SECRET, // 비밀키 
    });
  }

  async validate(payload: any) {
    console.log('🧩 JWT VALIDATED:', payload); // <== 여기에 로그!
    const user = await this.prisma.user.findUnique({ where: { email } });
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    }
  }
}
  */
