// /src/modules/admin-account/dto/admin-account-detail.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '@prisma/client';

export class AdminAccountDetailDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'admin@wayple.io' })
  email!: string;

  @ApiProperty({ enum: AdminRole, example: AdminRole.ADMIN })
  role!: AdminRole;

  @ApiProperty({ example: '2025-05-25T08:00:00.000Z' })
  createdAt!: Date;
}

