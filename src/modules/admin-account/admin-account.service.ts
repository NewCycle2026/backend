// /src/modules/admin-account/admin-account.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AdminAccountChangePasswordDto } from './dto/admin-account-change-password.dto';
import { AdminAccountCreateDto } from './dto/admin-account-create.dto';
import { AdminAccountDetailDto } from './dto/admin-account-detail.dto';
import { AdminAccountEditDto } from './dto/admin-account-edit.dto';
import { AdminAccountResetPasswordDto } from './dto/admin-account-reset-password.dto';
import { AdminAccountUpdateDto } from './dto/admin-account-update.dto';
import { AdminAccountUserListDto } from './dto/admin-account-userlist.dto';

@Injectable()
export class AdminAccountService {
  constructor(private prisma: PrismaService) {}

  async createAdmin(dto: AdminAccountCreateDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.prisma.adminAccount.create({
      data: {
        email: dto.email,
        password: hashed,
        role: dto.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getMyProfile(adminId: number): Promise<AdminAccountDetailDto> {
    const admin = await this.prisma.adminAccount.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.deletedAt !== null) {
      throw new NotFoundException('관리자 정보를 찾을 수 없습니다.');
    }

    return {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    };
  }

  async changeMyPassword(adminId: number, dto: AdminAccountChangePasswordDto) {
    const admin = await this.prisma.adminAccount.findUnique({
      where: { id: adminId },
    });

    if (!admin || admin.deletedAt !== null) {
      throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다.');
    }

    const isMatch = await bcrypt.compare(dto.currentPassword, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException('현재 비밀번호가 일치하지 않습니다.');
    }

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    return this.prisma.adminAccount.update({
      where: { id: adminId },
      data: { password: hashed },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async editMyProfile(adminId: number, dto: AdminAccountEditDto) {
    return this.prisma.adminAccount.update({
      where: { id: adminId },
      data: dto,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getAdminList(): Promise<AdminAccountUserListDto[]> {
    const admins = await this.prisma.adminAccount.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return admins.map((admin) => ({
      id: admin.id,
      email: admin.email,
      role: admin.role,
      createdAt: admin.createdAt,
    }));
  }

  async updateAdmin(id: number, dto: AdminAccountUpdateDto) {
    const data: any = { ...dto };

    if (dto.password) {
      const hashed = await bcrypt.hash(dto.password, 10);
      data.password = hashed;
    }

    return this.prisma.adminAccount.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async resetPassword(id: number, dto: AdminAccountResetPasswordDto) {
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    return this.prisma.adminAccount.update({
      where: { id },
      data: { password: hashed },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deleteAdmin(id: number) {
    return this.prisma.adminAccount.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: {
        id: true,
        email: true,
        role: true,
        deletedAt: true,
      },
    });
  }

  async restoreAdmin(id: number) {
    return this.prisma.adminAccount.update({
      where: { id },
      data: { deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        deletedAt: true,
      },
    });
  }
}
