// /src/modules/admin-account/dto/admin-account-change-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AdminAccountChangePasswordDto {
  @IsString()
  @ApiProperty({ example: 'CurrentPassword123!' })
  currentPassword!: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'NewSecurePassword2025!' })
  newPassword!: string;
}


