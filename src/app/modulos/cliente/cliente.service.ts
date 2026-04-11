import { Injectable, ConflictException, InternalServerErrorException, HttpException, NotFoundException } from '@nestjs/common';
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

      if(!clientes){
        throw new NotFoundException('Lista de clientes não encontrada')
      }
   
      return clientes;

    } catch(error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao buscar clientes');
    }
    
  }

  async findOne(id: string, payload: PayloadDto) {
    const usuario_id = String(payload.sub);

    try{
      const cliente = await this.clienteRepository.findOne({
        where: { id, usuario: { id: usuario_id }},      
      });

      if(!cliente){
        throw new NotFoundException('Cliente não encontrado');
      }

      return cliente;

    }catch(error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar cliente');
    }
  }

  async update(id: string, updateClienteDto: UpdateClienteDto, payload: PayloadDto) {
    try{
      const cliente = await this.findOne(id, payload);

      const clienteAtualizado = {
        nome: updateClienteDto.nome,
        email: updateClienteDto.email,
        telefone: updateClienteDto.telefone?.replace(/\D/g, ''),
        celular: updateClienteDto?.celular?.replace(/\D/g, ''),
      }

      Object.assign(cliente, clienteAtualizado);

      return await this.clienteRepository.save(cliente)
    } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }
    console.log(error)
    throw new InternalServerErrorException('Erro ao atualizar cliente');
    
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }
}
