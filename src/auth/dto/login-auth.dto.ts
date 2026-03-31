import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginAuthDto{
    @ApiProperty({
        description: 'Login do usuário',
        example: 'usuario@email.com',
        maxLength: 255
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        description: 'Login do usuário',
        example: 'usuario123',
        minLength: 5,
        maxLength: 10
    })
    @IsString()
    @IsNotEmpty()
    senha: string;
}