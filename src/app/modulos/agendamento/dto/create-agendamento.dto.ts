import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAgendamentoDto {
    @IsString()
    @IsNotEmpty()
    tipoServico!: string;
    
    @IsString()
    @IsNotEmpty()
    servico!: string;
    
    @IsString()
    @IsNotEmpty()
    data!: string;
    
    @IsString()
    @IsNotEmpty()
    hora!: string;

    @IsString()
    @IsNotEmpty()
    status!: string;

    @IsString()
    @IsNotEmpty()
    cliente_id!: string;

    @IsString()
    @IsNotEmpty()
    user_id!: string;
}
