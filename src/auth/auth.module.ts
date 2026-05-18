import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { Usuario } from 'src/app/modulos/usuario/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ResetSenhaToken } from './entities/reset-senha-token.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    MailerModule,
    TypeOrmModule.forFeature([Usuario, ResetSenhaToken]), 
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig)
]
})
export class AuthModule {}