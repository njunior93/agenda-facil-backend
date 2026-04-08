import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto{
    @ApiProperty({
        description: 'email do usuario para o login',
        example: 'usuario@email.com',
        maxLength: 255
    })
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @ApiProperty({
        description: 'senha do usuario',
        example: 'usuario123',
        minLength: 8,
        maxLength: 32
    })
    @IsString()
    @IsNotEmpty()
    senha!: string;
}