// /src/modules/admin-account/dto/admin-account-update.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class AdminAccountUpdateDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'updated@wayple.io' })
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  @ApiPropertyOptional({ example: 'NewPassword123' })
  password?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  @ApiPropertyOptional({ enum: AdminRole, example: AdminRole.SUPER })
  role?: AdminRole;
}
