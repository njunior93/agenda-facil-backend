import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/app/modulos/usuario/entities/usuario.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import jwtConfig from './config/jwt.config';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthSerivce{
    constructor(
        @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
        @Inject(jwtConfig.KEY) private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
    ){}

    async login(loginAuthDto: LoginAuthDto){
        const usuario = await this.usuarioRepository.findOneBy({
            email: loginAuthDto.email,
            ativo: true
        });

        if(!usuario){
            throw new NotFoundException('Usuario não encontrado');
        }

        const isPasswordvalid = await bcrypt.compare(loginAuthDto.senha, usuario.senhaHash);

        if(!isPasswordvalid){
            throw new UnauthorizedException('Senha incorreta');
        }

        const acessToken = await this.jwtService.signAsync(
            {
                sub: usuario.id,
                email: usuario.email
            },
            {
                secret: this.jwtConfiguration.secret,
                expiresIn: this.jwtConfiguration.jwtTtl,
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer
            }
        );

        return{
            token: acessToken
        }
    }
}