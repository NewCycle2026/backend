// src/modules/matching/dto/create-request.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({ example: 1, description: '여행 ID' })
  tripId!: number;

  @ApiProperty({ example: 10, description: '요청 보낸 사용자 ID' })
  userId!: number;

  @ApiProperty({ example: 15, description: '후보 사용자 ID' })
  candidateUserId!: number;
}
