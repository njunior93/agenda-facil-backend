import { IsEmail, IsNotEmpty, IsString, Max, MaxLength, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(255)
    nome!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;
    
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(32)
    senha!: string;
}
