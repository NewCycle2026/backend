// src/modules/mypage/dto/update-nickname.dto.ts
import { IsString, Length } from 'class-validator';

export class UpdateNicknameDto {
  @IsString()
  @Length(2, 20)
  nickname!: string;
}
