import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthSerivce } from './auth.service';
import { UsuarioModule } from 'src/app/modulos/usuario/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { Usuario } from 'src/app/modulos/usuario/entities/usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthSerivce],
  imports: [
    TypeOrmModule.forFeature([Usuario]), 
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig)
]
})
export class AuthModule {}