import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './modulos/usuario/usuario.module';
import { ClienteModule } from './modulos/cliente/cliente.module';
import { ServicoModule } from './modulos/servico/servico.module';
import { AgendamentoModule } from './modulos/agendamento/agendamento.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import jwtConfig from 'src/auth/config/jwt.config';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl:{
        rejectUnauthorized: false
      },
      autoLoadEntities: true, 
      synchronize: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: "suagendafacil@gmail.com",
          pass: "ugzo bgbf uvvl vnth"
        },
      },
      defaults: {
        from: '"Agenda Fácil" <no-reply@gmail.com>',
      },
    }),
    AuthModule, 
    UsuarioModule, 
    ClienteModule, 
    ServicoModule,
    AgendamentoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
