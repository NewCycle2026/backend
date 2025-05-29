// /src/modules/admin-account/dto/admin-account-create.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

export class AdminAccountCreateDto {
  @IsEmail()
  @ApiProperty({ example: 'admin@wayple.io' })
  email!: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'WaypleSecure2025!' })
  password!: string;

  @IsEnum(AdminRole)
  @ApiProperty({ enum: AdminRole, example: AdminRole.ADMIN })
  role!: AdminRole;
}
