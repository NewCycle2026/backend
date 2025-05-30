///src/modules/admin-account/admin-account.controller.ts
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';
import { AdminJwtGuard } from '@/modules/admin-auth/guards/admin-jwt.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AdminAccountService } from './admin-account.service';

import { AdminAccountChangePasswordDto } from './dto/admin-account-change-password.dto';
import { AdminAccountCreateDto } from './dto/admin-account-create.dto';
import { AdminAccountDetailDto } from './dto/admin-account-detail.dto';
import { AdminAccountEditDto } from './dto/admin-account-edit.dto';
import { AdminAccountResetPasswordDto } from './dto/admin-account-reset-password.dto';
import { AdminAccountUpdateDto } from './dto/admin-account-update.dto';
import { AdminAccountUserListDto } from './dto/admin-account-userlist.dto';

@ApiTags('AdminAccount')
@Controller('admin-account')
export class AdminAccountController {
  constructor(private readonly adminAccountService: AdminAccountService) {}

  @Post('create')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 계정 생성' })
  create(@Body() dto: AdminAccountCreateDto) {
    return this.adminAccountService.createAdmin(dto);
  }

  @Get('me')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '본인 마이페이지 조회' })
  getMe(@CurrentUser() admin: { sub: number }): Promise<AdminAccountDetailDto> {
    return this.adminAccountService.getMyProfile(admin.sub);
  }

  @Patch('me/password')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '본인 비밀번호 변경' })
  changeMyPassword(
    @CurrentUser() admin: { sub: number },
    @Body() dto: AdminAccountChangePasswordDto,
  ) {
    return this.adminAccountService.changeMyPassword(admin.sub, dto);
  }

  @Patch('me/edit')
  @UseGuards(AdminJwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '본인 프로필 수정' })
  editMyProfile(
    @CurrentUser() admin: { sub: number },
    @Body() dto: AdminAccountEditDto,
  ) {
    return this.adminAccountService.editMyProfile(admin.sub, dto);
  }

  @Get('accountlist')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 전체 목록 조회 (SUPER 전용)' })
  getAdminList(): Promise<AdminAccountUserListDto[]> {
    return this.adminAccountService.getAdminList();
  }

  @Patch(':id')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 계정 수정' })
  updateAdmin(
    @Param('id') id: string,
    @Body() dto: AdminAccountUpdateDto,
  ) {
    return this.adminAccountService.updateAdmin(Number(id), dto);
  }

  @Patch(':id/reset-password')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 비밀번호 초기화' })
  resetPassword(
    @Param('id') id: string,
    @Body() dto: AdminAccountResetPasswordDto,
  ) {
    return this.adminAccountService.resetPassword(Number(id), dto);
  }

  @Patch(':id/restore')
  //@UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('SUPER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '삭제된 관리자 복구 (SUPER 전용)' })
  restoreAdmin(@Param('id') id: string) {
    return this.adminAccountService.restoreAdmin(Number(id));
  }

  @Delete(':id')
  @UseGuards(AdminJwtGuard, RolesGuard)
  @Roles('SUPER')
  @ApiBearerAuth()
  @ApiOperation({ summary: '관리자 계정 삭제 (소프트 삭제, SUPER 전용)' })
  deleteAdmin(@Param('id') id: string) {
    return this.adminAccountService.deleteAdmin(Number(id));
  }
}
