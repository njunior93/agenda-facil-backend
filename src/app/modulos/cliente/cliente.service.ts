import { Injectable, ConflictException, InternalServerErrorException, HttpException } from '@nestjs/common';
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
    } catch (error: any) {
      if(error.code === '23505') {
        throw new ConflictException('Email já cadastrado');
      }

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao salvar cliente');
    }
  }

  async findAll(payload: PayloadDto) {
    const usuario_id = String(payload.sub);

    try{
      const clientes = await this.clienteRepository.find({
        where: { usuario: { id: usuario_id } },
        order: { createAt: 'DESC' },
        select: { id: true, nome: true, email: true, telefone: false, celular: true, createAt: false }
      });
   
      return clientes;

    } catch(error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao buscar clientes');
    }
    
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
