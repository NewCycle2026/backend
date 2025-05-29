// src/modules/board/dto/update-board.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  allowPost?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  allowComment?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  allowFile?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  writePermission?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  commentPermission?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  filePermission?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}
