// src/modules/user/user.service.ts
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/user-register.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: CreateUserDto) {
    try {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existing) {
        throw new ConflictException('이미 사용 중인 이메일입니다.');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
      });

      return {
        message: '회원가입 성공',
        userId: newUser.id,
      };

    } catch (e) {
      console.error('[회원가입 에러]', e);
      throw new InternalServerErrorException('회원가입 중 오류 발생');
    }
  }
}
