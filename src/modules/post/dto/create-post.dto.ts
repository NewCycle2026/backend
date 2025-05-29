// src/modules/post/dto/create-post.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsInt()
  @ApiProperty({ example: 12, description: '게시판 ID' })
  boardId!: number;

  @IsOptional()
  @IsInt()
  @ApiProperty({ example: 3, description: '댓글이 달릴 부모 게시글 ID', required: false })
  parentPostId?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '제목입니다', required: false })
  title?: string;

  @IsString()
  @ApiProperty({ example: '내용입니다' })
  content!: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, required: false })
  isNotice?: boolean;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false, required: false })
  isSecret?: boolean;
}

