// src/modules/post/dto/update-post.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '수정된 제목', required: false })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '수정된 본문 내용입니다.', required: false })
  content?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, description: '공지글 여부', required: false })
  isNotice?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true, description: '비밀글 여부', required: false })
  isSecret?: boolean;
}

