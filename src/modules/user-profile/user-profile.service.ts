// src/modules/user-profile/user-profile.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable, InternalServerErrorException, NotFoundException
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateOrUpdateUserProfileDto } from './dto/user-profile-create-or-update.dto';
import { ChangePasswordDto } from './dto/user-profile-password-change.dto';

@Injectable()
export class UserProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async findMe(userId: number) {
    const profile = await this.prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('프로필을 찾을 수 없습니다.');
    return profile;
  }

  async registerOrUpdate(userId: number, dto: CreateOrUpdateUserProfileDto) {
    try {
      console.log('✅ userId:', userId);
      console.log('✅ DTO:', JSON.stringify(dto));

      const safeInterests = Array.isArray(dto.interests) ? dto.interests : [];

      const existing = await this.prisma.userProfile.findUnique({ where: { userId } });

      if (!existing) {
        const created = await this.prisma.userProfile.create({
          data: {
            userId,
            name: dto.name ?? null,
            nickname: dto.nickname ?? null,
            bio: dto.bio ?? null,
            age: dto.age ?? null,
            gender: dto.gender ?? null,
            travelType: dto.travelType ?? null,
            interests: safeInterests,
            country: dto.country ?? null,
            recordedAt: new Date(),
          },
        });
        return { message: '프로필이 등록되었습니다.', profile: created };
      }

      const updated = await this.prisma.userProfile.update({
        where: { userId },
        data: {
          name: dto.name ?? undefined,
          nickname: dto.nickname ?? undefined,
          bio: dto.bio ?? undefined,
          age: dto.age ?? undefined,
          gender: dto.gender ?? undefined,
          travelType: dto.travelType ?? undefined,
          interests: safeInterests,
          country: dto.country ?? undefined,
        },
      });
      return { message: '프로필이 수정되었습니다.', profile: updated };
    } catch (error: any) {
      console.error('🔥 프로필 처리 중 에러 발생');
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('[🔥 Prisma Error]', error.code, error.meta);
      } else {
        console.error('[🔥 Unknown Error]', error.message, error.stack);
      }
      throw new InternalServerErrorException('프로필 등록 또는 수정 중 오류 발생');
    }
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.');
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { message: '비밀번호 변경 완료' };
  }

  async checkNicknameDuplicate(nickname: string) {
    const exists = await this.prisma.userProfile.findUnique({
      where: { nickname },
    });
    return { isDuplicate: !!exists };
  }

  async delete(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });
    return { message: '계정이 비활성화 되었습니다.' };
  }
}
