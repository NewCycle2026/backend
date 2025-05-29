// src/modules/user-profile/user-profile.controller.ts
import { extractUserId } from '@/common/utils/extract-user-id.util';
import {
  Body, Controller, Delete, Get, Post, Query, Req, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateOrUpdateUserProfileDto } from './dto/user-profile-create-or-update.dto';
import { ChangePasswordDto } from './dto/user-profile-password-change.dto';
import { UserProfileService } from './user-profile.service';

@ApiTags('User Profile')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@Controller('profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('me')
  @ApiOperation({ summary: '내 프로필 조회' })
  getMyProfile(@Req() req: Request) {
    const userId = extractUserId(req);
    return this.userProfileService.findMe(userId);
  }

  @Post('register')
  @ApiOperation({ summary: '프로필 등록 또는 수정 (없으면 생성, 있으면 수정)' })
  registerOrUpdate(@Body() dto: CreateOrUpdateUserProfileDto, @Req() req: Request) {
    const userId = extractUserId(req);
    console.log('🧾 컨트롤러 userId:', userId);
    return this.userProfileService.registerOrUpdate(userId, dto);
  }

  @Get('check-nickname')
  @ApiOperation({ summary: '닉네임 중복 확인' })
  checkNickname(@Query('nickname') nickname: string) {
    return this.userProfileService.checkNicknameDuplicate(nickname);
  }

  @Post('change-password')
  @ApiOperation({ summary: '비밀번호 변경' })
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const userId = extractUserId(req);
    return this.userProfileService.changePassword(userId, dto);
  }

  @Delete('withdraw')
  @ApiOperation({ summary: '회원 탈퇴 (계정 비활성화)' })
  withdraw(@Req() req: Request) {
    const userId = extractUserId(req);
    return this.userProfileService.delete(userId);
  }
}
