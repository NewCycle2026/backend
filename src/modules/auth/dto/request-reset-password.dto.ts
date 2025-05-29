// src/modules/auth/dto/request-reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

// ✅ 이메일 인증 요청 DTO
export class RequestResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  email!: string;
}

// ✅ 비밀번호 재설정 DTO
export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  token!: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
