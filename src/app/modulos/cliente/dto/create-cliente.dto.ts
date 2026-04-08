import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateClienteDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(255)
    nome!: string;

    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(10)
    @MaxLength(11)
    telefone?: string;

    @IsString()
    @MinLength(11)
    @MaxLength(12)
    celular?: string;

    @IsString()
    @IsNotEmpty()
    user_id!: string;
}
