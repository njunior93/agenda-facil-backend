import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cliente]),
    JwtModule.register({})
],
  controllers: [ClienteController],
  providers: [ClienteService],
  exports: [TypeOrmModule]
})
export class ClienteModule {}
