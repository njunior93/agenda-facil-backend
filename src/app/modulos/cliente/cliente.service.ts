import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/cliente.entity';
import { Repository } from 'typeorm';
import { PayloadDto } from 'src/auth/dto/payload.dto';

@Injectable()
export class ClienteService {
  constructor(@InjectRepository(Cliente) private clienteRepository: Repository<Cliente>) {}

  async create(createClienteDto: CreateClienteDto, payload: PayloadDto) {
    const usuario_id = String(payload.sub);

    try{
      const cliente = {
        nome: createClienteDto.nome,
        email: createClienteDto.email,
        telefone: createClienteDto.telefone?.replace(/\D/g, ''),
        celular: createClienteDto.celular?.replace(/\D/g, ''),
        usuario: { id: usuario_id }
      }

      const novoCliente = this.clienteRepository.create(cliente);
      return await this.clienteRepository.save(novoCliente);
    } catch (error) {
      if(error.code === '23505') {
        throw new ConflictException('Email já cadastrado');
      }

      console.error('Erro ao salvar cliente:', error);
      throw new InternalServerErrorException('Erro ao salvar cliente');
    }
  }

  findAll() {
    return `This action returns all cliente`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cliente`;
  }

  update(id: number, updateClienteDto: UpdateClienteDto) {
    return `This action updates a #${id} cliente`;
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
