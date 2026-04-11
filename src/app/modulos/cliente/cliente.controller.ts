import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { request } from 'express';

@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}
  
  @UseGuards(AuthTokenGuard)
  @Post('/criar-cliente')
  create(@Body() createClienteDto: CreateClienteDto, @Req() request:Request) {
    const payload = request['usuario']
    return this.clienteService.create(createClienteDto, payload);
  }

  @UseGuards(AuthTokenGuard)
  @Get('/listar-clientes')
  findAll(@Req() request:Request) {
    const payload = request['usuario']
    return this.clienteService.findAll(payload);
  }

  @UseGuards(AuthTokenGuard)
  @Get('/localizar-cliente/:id')
  findOne(@Param('id') id: string, @Req() request:Request) {
    const payload = request['usuario']
    return this.clienteService.findOne(id, payload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch('/editar-cliente/:id')
  update(@Param('id') id: string, @Body() updateClienteDto: UpdateClienteDto, @Req() request: Request) {
    const payload = request['usuario']
    return this.clienteService.update(id, updateClienteDto, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clienteService.remove(+id);
  }
}
