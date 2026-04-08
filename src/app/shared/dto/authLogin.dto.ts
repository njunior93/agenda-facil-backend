import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class authLoginDto {
    @ApiProperty({
        description: 'Token de acesso do usuário',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjg4ODQyODk3LCJleHAiOjE2ODg4NDY0OTd9.7s8nqj8l5m9v6w3x2y1z0a9b8c7d6e5f4g3h2i1j0k'
    })
    @IsString()
    token!: string;
}