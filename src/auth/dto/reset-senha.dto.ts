import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetSenhaDto {

  @IsString()
  token!: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password!: string;
}