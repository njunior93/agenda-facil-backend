import { ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agendamento } from './entities/agendamento.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class AgendamentoService {
  constructor(@InjectRepository(Agendamento) private agendamentoRepository: Repository<Agendamento>) {}

  async create(createAgendamentoDto: CreateAgendamentoDto, payload: PayloadDto) {
    const usuario_id = String(payload.sub);

    try{
      const agendamento = {
        tipoServico: createAgendamentoDto.tipoServico,
        servico: createAgendamentoDto.servico,
        data: createAgendamentoDto.data,
        hora: createAgendamentoDto.hora,
        cliente: { id: createAgendamentoDto.cliente_id },
        usuario: { id: usuario_id }
      }

      const novoAgendamento = this.agendamentoRepository.create(agendamento);
      return await this.agendamentoRepository.save(novoAgendamento);
    } catch (error: any) {
      if(error.code === '23505') {
        throw new ConflictException('Agendamento ja existe');
      }

      if(error instanceof HttpException){
        throw error;
      }

      throw new InternalServerErrorException('Erro ao salvar agendamento');
    }
  }

  async findAll(payload: PayloadDto) {
    const usuario_id = String(payload.sub);

    try{
      const agendamentos = await this.agendamentoRepository.find({ 
        where: { usuario: { id: usuario_id }},
        
        order: { createAt: 'DESC' },
      
        relations:{ cliente: true }
    });

      if(!agendamentos){
        throw new NotFoundException('Nenhum agendamento encontrado');
      }

      return agendamentos;

    }catch(error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao buscar clientes');
    } 
  }

  findOne(id: number) {
    return `This action returns a #${id} agendamento`;
  }

  update(id: number, updateAgendamentoDto: UpdateAgendamentoDto) {
    return `This action updates a #${id} agendamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} agendamento`;
  }
}
