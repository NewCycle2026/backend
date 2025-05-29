// /src/modules/admin-account/dto/admin-account-edit.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional } from 'class-validator';

export class AdminAccountEditDto {
  @IsOptional()
  @IsEmail()
  @ApiPropertyOptional({ example: 'updated.admin@wayple.io' })
  email?: string;

  @IsOptional()
  @IsEnum(AdminRole)
  @ApiPropertyOptional({ enum: AdminRole, example: AdminRole.STAFF })
  role?: AdminRole;
}

