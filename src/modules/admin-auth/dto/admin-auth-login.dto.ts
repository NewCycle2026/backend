// /src/modules/admin-auth/dto/admin-auth-login.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AdminAuthLoginDto {
  @IsEmail()
  @ApiProperty({ example: 'admin@wayple.io' })
  email!: string;

  @IsString()
  @ApiProperty({ example: '1234' })
  password!: string;
}
