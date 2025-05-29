// src/modules/companion/dto/apply-companion.dto.ts
// src/modules/companion/dto/apply-companion.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ApplyCompanionDto {
  @ApiProperty({ example: 1, description: '신청자(사용자)의 ID' })
  @IsInt()
  userId!: number;

  @ApiProperty({ example: 3, description: '신청하려는 여행 ID' })
  @IsInt()
  tripId!: number;
}

