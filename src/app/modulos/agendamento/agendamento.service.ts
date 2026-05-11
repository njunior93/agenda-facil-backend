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
        status: 'a',
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
      
        relations:{ cliente: true },

        select: { cliente: {nome:true}}
       
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

  async findOne(id: string, payload: PayloadDto) {
    const usuario_id = String(payload.sub);

    try{
      const agendamento = await this.agendamentoRepository.findOne({
        where: { id, usuario: { id: usuario_id }},
        relations:{ cliente: true },
      });

      if(!agendamento){
        throw new NotFoundException('Agendamento não encontrado');
      }

      return agendamento;

    }catch(error:any){
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar agendamento');
    }
  }

  async update(id: string, updateAgendamentoDto: UpdateAgendamentoDto, payload: PayloadDto) {
    const usuario_id = String(payload.sub);

    const agendamentoAtualizado = await this.agendamentoRepository.preload({
      id,
      ...updateAgendamentoDto,
      usuario: { id: usuario_id }
    });

    if(!agendamentoAtualizado){
        throw new NotFoundException('Agendamento não encontrado');
      }

      return await this.agendamentoRepository.save(agendamentoAtualizado);

    }catch(error:any){
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar agendamento');
    }
  

  remove(id: number) {
    return `This action removes a #${id} agendamento`;
  }
}
