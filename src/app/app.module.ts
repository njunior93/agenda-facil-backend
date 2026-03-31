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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl:{
        rejectUnauthorized: false
      },
      autoLoadEntities: true, 
      synchronize: false,
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
