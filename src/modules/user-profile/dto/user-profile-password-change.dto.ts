// src/modules/user-profile/dto/user-profile-password-change.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'current1234' })
  @IsString()
  currentPassword!: string;

  @ApiProperty({ example: 'newPassword123!' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}
