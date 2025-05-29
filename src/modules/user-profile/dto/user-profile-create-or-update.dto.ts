// src/modules/user-profile/dto/user-profile-create-or-update.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateOrUpdateUserProfileDto {
  @ApiProperty({ example: '홍길동' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'eco_traveler_99' })
  @IsOptional()
  @IsString()
  nickname?: string;

  @ApiProperty({ example: '안녕하세요! 친환경 여행을 좋아해요.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 25 })
  @IsOptional()
  @IsInt()
  age?: number;

  @ApiProperty({ example: 'male' })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiProperty({ example: 'solo' })
  @IsOptional()
  @IsString()
  travelType?: string;

  @ApiProperty({ example: ['eco', 'culture'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiProperty({ example: 'Korea' })
  @IsOptional()
  @IsString()
  country?: string;
}
