import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ example: '공지사항' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'board_notice' })
  @IsString()
  slug!: string;

  @ApiProperty({ example: 'master', description: '게시판 유형: master, post, comment, file' })
  @IsString()
  type!: string;

  @ApiProperty({ example: null, description: '부모 게시판 ID (없으면 null)' })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty({ example: '사이트 공지사항입니다.', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isPublic!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowPost!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  allowComment!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  allowFile!: boolean;

  @ApiProperty({ example: 'ALL', description: '글쓰기 권한: ALL | LOGIN | ADMIN' })
  @IsString()
  writePermission!: string;

  @ApiProperty({ example: 'ALL', description: '댓글 권한: ALL | LOGIN | ADMIN' })
  @IsString()
  commentPermission!: string;

  @ApiProperty({ example: 'LOGIN', description: '파일 업로드 권한' })
  @IsString()
  filePermission!: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  displayOrder!: number;

  @ApiProperty({ example: '📢' })
  @IsOptional()
  @IsString()
  icon?: string;
}
