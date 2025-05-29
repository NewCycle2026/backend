// /src/modules/admin-account/dto/admin-account-reset-password.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AdminAccountResetPasswordDto {
  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'NewSecurePassword2025!' })
  newPassword!: string;
}
