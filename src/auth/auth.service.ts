import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "src/app/modulos/usuario/entities/usuario.entity";
import { EsqueciSenhaDto } from "./dto/esqueci-senha.dto";
import * as crypto from 'crypto';
import { HttpException, InternalServerErrorException } from "@nestjs/common";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import jwtConfig from './config/jwt.config';
import * as config from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ResetSenhaToken } from "./entities/reset-senha-token.entity";
import { ResetSenhaDto } from "./dto/reset-senha.dto";
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(Usuario) private readonly usuarioRepository: Repository<Usuario>,
        @Inject(jwtConfig.KEY) private readonly jwtConfiguration: config.ConfigType<typeof jwtConfig>,
        @InjectRepository(ResetSenhaToken) private resetSenhaToken: Repository<ResetSenhaToken>,

        private readonly mailerService: MailerService,

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

    async esqueciMinhaSenha(esqueciSenhaDto: EsqueciSenhaDto) {

    try {

        const usuario = await this.usuarioRepository.findOne({
            where: {email: esqueciSenhaDto.email,},
        });

        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado',);
        }

        const token = crypto.randomBytes(32).toString('hex');

        const expiresAt = new Date(Date.now() + 1000 * 60 * 15,);

        const novoToken =this.resetSenhaToken.create({
            email: usuario.email,
            token,
            expiresAt,
        });

        await this.resetSenhaToken.save(novoToken);

        const link = `http://localhost:5173/redefinir-senha?token=${token}`;

        await this.mailerService.sendMail({
          to: usuario.email, //
          subject: 'Recuperação de Senha - Agenda Fácil',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
              <h2 style="color: #ff5722;">Recuperação de Senha</h2>
              <p>Olá,</p>
              <p>Você solicitou a redefinição de senha para a sua conta no <strong>Agenda Fácil</strong>.</p>
              <p>Clique no botão abaixo para criar uma nova senha. Este link é válido por 15 minutos.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="background-color: #ff5722; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Redefinir Minha Senha</a>
              </div>
              <p style="font-size: 12px; color: #777;">Se você não solicitou essa alteração, por favor desconsidere este e-mail.</p>
            </div>
          `,
        });

        return { message: 'Link de recuperação enviado com sucesso para o seu e-mail.' };

  } catch (error) {

    if (error instanceof HttpException) {
      throw error;
    }

    console.error('Erro real no envio de e-mail:', error);

    throw new InternalServerErrorException(
      'Erro ao recuperar senha',
    );
  }
    }

    async resetPassword(resetPasswordDto: ResetSenhaDto) {

    try {

    const tokenEncontrado = await this.resetSenhaToken.findOne({
        where: {
          token: resetPasswordDto.token,
        },
      });


    if (!tokenEncontrado) {
      throw new BadRequestException('Token inválido',);
    }

    if (new Date() >
      tokenEncontrado.expiresAt
    ) {
      throw new BadRequestException(
        'Token expirado',
      );
    }

    const senhaHash =
      await bcrypt.hash(
        resetPasswordDto.password,
        10,
      );

    const usuario =
      await this.usuarioRepository.findOne({
        where: {
          email: tokenEncontrado.email,
        },
      });

    if (!usuario) {
      throw new NotFoundException(
        'Usuário não encontrado',
      );
    }

    usuario.senhaHash = senhaHash;

    await this.usuarioRepository.save(
      usuario,
    );

    await this.resetSenhaToken.delete({
      token: tokenEncontrado.token,
    });

    return {
      message:
        'Senha alterada com sucesso',
    };

  } catch (error) {

    if (error instanceof HttpException) {
      throw error;
    }

    throw new InternalServerErrorException(
      'Erro ao redefinir senha',
    );
  }
}
}