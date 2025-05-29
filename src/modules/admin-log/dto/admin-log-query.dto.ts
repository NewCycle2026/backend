// src/modules/admin-log/dto/admin-log-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LogType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class AdminLogQueryDto {
  @ApiPropertyOptional({ enum: LogType, description: '로그 타입' })
  @IsOptional()
  @IsEnum(LogType)
  type?: LogType;

  @ApiPropertyOptional({ description: '관리자 이메일 검색' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ enum: ['true', 'false'], description: '성공 여부' })
  @IsOptional()
  @IsString()
  success?: string;

  @ApiPropertyOptional({ description: '페이지 시작 위치 (skip)' })
  @IsOptional()
  skip?: number;

  @ApiPropertyOptional({ description: '페이지 크기 (take)' })
  @IsOptional()
  take?: number;
}

export class AdminLogResponseDto {
  id!: number;
  email!: string;
  type!: LogType;
  ip!: string;
  userAgent!: string;
  success!: boolean;
  createdAt!: Date;
}