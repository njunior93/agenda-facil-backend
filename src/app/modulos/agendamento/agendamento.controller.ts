import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';

@Controller('agendamento')
export class AgendamentoController {
  constructor(private readonly agendamentoService: AgendamentoService) {}

  @UseGuards(AuthTokenGuard)
  @Post('/criar-agendamento')
  create(@Body() createAgendamentoDto: CreateAgendamentoDto, @Req() request:Request) {
    const payload = request['usuario']
    return this.agendamentoService.create(createAgendamentoDto, payload);
  }

  @UseGuards(AuthTokenGuard)
  @Get('listar-agendamentos')
  findAll(@Req() request:Request) {
    const payload = request['usuario']
    return this.agendamentoService.findAll(payload);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendamentoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendamentoDto: UpdateAgendamentoDto) {
    return this.agendamentoService.update(+id, updateAgendamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendamentoService.remove(+id);
  }
}
